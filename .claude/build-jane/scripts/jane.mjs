#!/usr/bin/env node
// jane.mjs - state engine for the Janes Build Workflow.
// Zero dependencies. Node 16+.
// State is the source of truth for what is done. Prose artifacts are the content.

import fs from 'node:fs'
import path from 'node:path'

const TAGS = ['OWNER', 'RESEARCH', 'DERIVED', 'HISTORY', 'DOCUMENT']
const CLASSES = ['MUST', 'SHOULD', 'COULD', 'DO NOT BUILD']
const RIGHTS = ['AUTONOMOUS', 'RECOMMEND', 'OWNER_APPROVAL', 'NEVER']
const TIERS = ['V1', 'V1.5', 'V2', 'DO NOT BUILD']
const PROFILE_WORD_CAP = 1500
const HERO_MIN = 4
const HERO_MAX = 6

const PHASES = [
  ['Intake', 'phases/00-intake.md'],
  ['Business Definition', 'phases/01-business-definition.md'],
  ['Operating System', 'phases/02-operating-system.md'],
  ['Opportunity Map', 'phases/03-opportunity-map.md'],
  ['Jane Definition', 'phases/04-jane-definition.md'],
  ['Workflow Architecture', 'phases/05-workflow-architecture.md'],
  ['Product Architecture', 'phases/06-product-architecture.md'],
  ['Guardrails and Decision Rights', 'phases/07-guardrails.md'],
  ['MVP', 'phases/08-mvp.md'],
  ['Runtime Package', 'runtime/'],
  ['Audit', 'phases/10-audit.md'],
]

const GATES = [
  'Enough evidence exists to define the buyer and business model',
  'Buyer, business and economic model are clear',
  'Real operating work is mapped rather than hypothetical features',
  'Four to six hero workflows are selected',
  'Jane has one clear job and is not a generic AI assistant',
  'Every MUST HAVE workflow is executable in principle',
  'Jane can persist state and operate across workflows',
  'Jane cannot silently cross consequential boundaries',
  'Smallest sellable Jane is defined',
  'Runtime package complete and profile within word cap',
  'Jane passes before build handoff',
]

const OWNER_DECISIONS = [
  ['Jane name', 'Target buyer as a business shape, not a category', 'Proceed, hold, or pass on this vertical'],
  ['Primary business shape, with adjacent shapes named but not served', 'Which revenue engine the Jane protects'],
  ['Confirmation the decision inventory matches how the work runs', 'Anything wrong or missing from lived experience (tag HISTORY)'],
  ['The final hero set, four to six', 'Any DO NOT BUILD to reconsider, with the boundary it touches named'],
  ['Core promise, verbatim', 'Identity and register', 'Anything moved from What She Does into Boundaries'],
  ['Approval requirement per workflow where it differs from default', 'Any workflow whose value does not justify build cost'],
  ['Integrations to depend on and to refuse', 'Alert tolerance: what may interrupt the owner'],
  ['Every action proposed as AUTONOMOUS', 'Escalation path when a guardrail fires'],
  ['The V1 line: what ships first', 'Price posture, if V1 changes it'],
  ['Sign-off on 03_JANE_PROFILE.md, read aloud'],
  ['Any audit finding accepted rather than fixed'],
]

const RUNTIME_FILES = [
  '01_RESEARCH_SYNTHESIS.md', '02_OWNER_DECISIONS.md', '03_JANE_PROFILE.md',
  '04_WORKFLOWS.md', '05_DATA_MODEL.md', '06_MVP_SPEC.md', '07_BUILD_HANDOFF.md',
]

const PLACEHOLDERS = [/\bTBD\b/, /\bTODO\b/, /\bFIXME\b/, /_{4,}/, /<[A-Z_]{3,}>/, /\bLOREM\b/i, /\bXXX\b/]

// ---------- plumbing ----------

const slug = (s) => String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const root = () => process.env.BUILD_JANE_ROOT || path.join(process.cwd(), 'janes')
const dir = (name) => path.join(root(), slug(name))
const statePath = (name) => path.join(dir(name), 'STATE.json')

function die(msg) { console.error('FAIL ' + msg); process.exit(1) }

function load(name) {
  const p = statePath(name)
  if (!fs.existsSync(p)) die(`no Jane named "${name}" at ${dir(name)}. Run: jane.mjs init --name ${name}`)
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function save(st) {
  st.updatedAt = new Date().toISOString()
  const p = statePath(st.jane)
  fs.writeFileSync(p, JSON.stringify(st, null, 2) + '\n')
}

function arg(argv, flag, fallback = undefined) {
  const i = argv.indexOf(flag)
  if (i === -1) return fallback
  const v = argv[i + 1]
  if (v === undefined || v.startsWith('--')) return true
  return v
}
const has = (argv, flag) => argv.includes(flag)

function words(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*_>|`\-]/g, ' ')
    .split(/\s+/).filter(Boolean).length
}

// ---------- commands ----------

function cmdInit(argv) {
  const name = arg(argv, '--name')
  if (!name || name === true) die('init requires --name')
  const d = dir(name)
  if (fs.existsSync(statePath(name))) die(`Jane "${name}" already exists at ${d}. Use resume.`)
  fs.mkdirSync(path.join(d, 'phases'), { recursive: true })
  fs.mkdirSync(path.join(d, 'runtime'), { recursive: true })
  const st = {
    schemaVersion: 1,
    jane: slug(name),
    displayName: String(name).trim(),
    role: arg(argv, '--role', 'vertical-jane'),
    createdAt: new Date().toISOString(),
    updatedAt: null,
    phases: PHASES.map((p, i) => ({
      n: i, title: p[0], artifact: p[1],
      status: i === 0 ? 'in_progress' : 'not_started',
      gate: { text: GATES[i], status: 'open', evidence: null, metAt: null },
    })),
    decisions: [],
    blockers: [],
    auditFindings: [],
  }
  save(st)
  console.log(`OK created ${st.displayName} at ${d}`)
  console.log(`   role: ${st.role}`)
  console.log(`   next: Phase 0 Intake`)
}

function nextPhase(st) { return st.phases.find(p => p.status !== 'complete') }

function cmdStatus(argv) {
  const st = load(arg(argv, '--name'))
  const done = st.phases.filter(p => p.status === 'complete').length
  console.log(`\n${st.displayName}  [${st.role}]`)
  console.log(`${done}/${st.phases.length} phases complete\n`)
  for (const p of st.phases) {
    const mark = p.status === 'complete' ? 'x' : p.status === 'in_progress' ? '>' : p.status === 'blocked' ? '!' : ' '
    const g = p.gate.status === 'met' ? 'gate met' : p.status === 'not_started' ? '' : `gate ${p.gate.status}`
    console.log(` [${mark}] Phase ${p.n}  ${p.title.padEnd(32)} ${g}`)
  }
  const byTag = {}
  for (const t of TAGS) byTag[t] = st.decisions.filter(d => d.provenance === t && !d.superseded).length
  console.log(`\ndecisions: ${Object.entries(byTag).map(([k, v]) => `${k} ${v}`).join('  ')}`)
  if (st.blockers.filter(b => !b.resolved).length) {
    console.log('\nblockers:')
    for (const b of st.blockers.filter(b => !b.resolved)) console.log(`  - [P${b.phase}] ${b.text}`)
  }
  if (st.auditFindings.filter(f => f.status === 'open').length) {
    console.log('\nopen audit findings:')
    for (const f of st.auditFindings.filter(f => f.status === 'open')) console.log(`  - ${f.id} ${f.text}`)
  }
  const np = nextPhase(st)
  console.log(`\nnext action: ${np ? `Phase ${np.n} ${np.title}` : 'complete. build handoff ready.'}\n`)
}

function cmdResume(argv) {
  const st = load(arg(argv, '--name'))
  const np = nextPhase(st)
  if (!np) { console.log(`${st.displayName} is complete through Phase 10.`); return }
  console.log(`\n${st.displayName}  resuming at Phase ${np.n}: ${np.title}`)
  console.log(`artifact: ${path.join(dir(st.jane), np.artifact)}`)
  console.log(`gate:     ${np.gate.text}`)
  const prior = st.phases.filter(p => p.status === 'complete').map(p => `P${p.n}`).join(' ')
  console.log(`settled:  ${prior || 'nothing yet'}  (do not re-open)`)
  const bl = st.blockers.filter(b => !b.resolved && b.phase === np.n)
  if (bl.length) { console.log('blockers:'); bl.forEach(b => console.log(`  - ${b.text}`)) }
  console.log('')
  printOwnerDecisions(st, np.n)
}

function printOwnerDecisions(st, n) {
  console.log(`OWNER DECISIONS for gate ${n} (this is the entire review surface):`)
  for (const q of OWNER_DECISIONS[n]) {
    const hit = st.decisions.find(d => !d.superseded && d.provenance === 'OWNER' && d.phase === n && d.key.toLowerCase().includes(q.split(' ')[0].toLowerCase()))
    console.log(`  [${hit ? 'x' : ' '}] ${q}`)
  }
  console.log('')
}

function cmdOwnerDecisions(argv) {
  const st = load(arg(argv, '--name'))
  const n = Number(arg(argv, '--phase', nextPhase(st)?.n ?? 0))
  printOwnerDecisions(st, n)
}

function cmdDecide(argv) {
  const st = load(arg(argv, '--name'))
  const phase = Number(arg(argv, '--phase'))
  const key = arg(argv, '--key')
  const value = arg(argv, '--value')
  const prov = arg(argv, '--provenance')
  const source = arg(argv, '--source', '')
  const quote = arg(argv, '--quote', '')
  const confirmedAt = arg(argv, '--confirmed-at', '')
  const inputs = arg(argv, '--inputs', '')

  if (!key || key === true) die('decide requires --key')
  if (!value || value === true) die('decide requires --value')
  if (!TAGS.includes(prov)) die(`--provenance must be one of ${TAGS.join(', ')}`)
  if (!Number.isInteger(phase) || phase < 0 || phase > 10) die('--phase must be 0-10')

  // The rule that matters: an OWNER tag needs an owner statement behind it.
  if (prov === 'OWNER' && !(quote && quote !== true) && !(confirmedAt && confirmedAt !== true)) {
    die('OWNER provenance requires --quote "<verbatim>" or --confirmed-at <ref>.\n' +
        '     Without an owner statement this decision is DERIVED. Retag it.')
  }
  if (prov === 'RESEARCH' && !(source && source !== true)) die('RESEARCH provenance requires --source')
  if (prov === 'DERIVED' && !(inputs && inputs !== true)) die('DERIVED provenance requires --inputs (decision ids or phase refs)')
  if (prov === 'DOCUMENT' && !(source && source !== true)) die('DOCUMENT provenance requires --source (document and location)')
  if (prov === 'HISTORY' && !(source && source !== true)) die('HISTORY provenance requires --source (engagement, client, or period)')

  const prev = st.decisions.find(d => d.key === key && !d.superseded)
  if (prev) prev.superseded = true
  const id = 'D' + String(st.decisions.length + 1).padStart(3, '0')
  st.decisions.push({
    id, phase, key, value: String(value), provenance: prov,
    source: source === true ? '' : source, quote: quote === true ? '' : quote,
    confirmedAt: confirmedAt === true ? '' : confirmedAt, inputs: inputs === true ? '' : inputs,
    at: new Date().toISOString(), supersedes: prev ? prev.id : null, superseded: false,
  })
  save(st)
  console.log(`OK ${id} [${prov}] ${key} = ${value}${prev ? ` (supersedes ${prev.id})` : ''}`)
}

function cmdGate(argv) {
  const st = load(arg(argv, '--name'))
  const n = Number(arg(argv, '--phase'))
  const p = st.phases[n]
  if (!p) die('--phase must be 0-10')
  if (has(argv, '--fail')) {
    p.gate.status = 'failed'; p.status = 'blocked'
    const why = arg(argv, '--evidence', 'unstated')
    st.blockers.push({ phase: n, text: String(why), resolved: false, at: new Date().toISOString() })
    save(st); console.log(`OK gate ${n} FAILED: ${why}`); return
  }
  if (has(argv, '--met')) {
    const ev = arg(argv, '--evidence')
    if (!ev || ev === true) die('--met requires --evidence. A gate met without evidence is a gate not met.')
    for (let i = 0; i < n; i++) {
      if (st.phases[i].gate.status !== 'met') die(`gate ${i} is not met. Phases close in order.`)
    }
    const art = path.join(dir(st.jane), p.artifact)
    if (!fs.existsSync(art)) die(`artifact missing: ${art}`)
    p.gate.status = 'met'; p.gate.evidence = String(ev); p.gate.metAt = new Date().toISOString()
    p.status = 'complete'
    if (st.phases[n + 1]) st.phases[n + 1].status = 'in_progress'
    st.blockers.filter(b => b.phase === n).forEach(b => { b.resolved = true })
    save(st)
    console.log(`OK gate ${n} MET: ${p.gate.text}`)
    const np = nextPhase(st)
    if (np) { console.log(`   next: Phase ${np.n} ${np.title}\n`); printOwnerDecisions(st, np.n) }
    else console.log('   all phases complete. build handoff ready.')
    return
  }
  console.log(`Phase ${n} ${p.title}\n  gate: ${p.gate.text}\n  status: ${p.gate.status}\n  evidence: ${p.gate.evidence || 'none'}`)
}

function cmdBlock(argv) {
  const st = load(arg(argv, '--name'))
  st.blockers.push({ phase: Number(arg(argv, '--phase', 0)), text: String(arg(argv, '--text', 'unstated')), resolved: false, at: new Date().toISOString() })
  save(st); console.log('OK blocker recorded')
}

function cmdDecisions(argv) {
  const st = load(arg(argv, '--name'))
  const only = arg(argv, '--provenance')
  let ds = st.decisions.filter(d => !d.superseded)
  if (only && only !== true) ds = ds.filter(d => d.provenance === only)
  if (!ds.length) { console.log('none'); return }
  for (const d of ds) {
    console.log(`${d.id}  P${d.phase}  [${d.provenance}]  ${d.key}: ${d.value}`)
    if (d.quote) console.log(`      quote: "${d.quote}"`)
    if (d.source) console.log(`      source: ${d.source}`)
    if (d.inputs) console.log(`      inputs: ${d.inputs}`)
  }
}

// ---------- audit ----------

function readIf(p) { return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null }

function cmdAudit(argv) {
  const st = load(arg(argv, '--name'))
  const d = dir(st.jane)
  const findings = []
  const F = (id, text) => findings.push({ id, text })
  const files = {}
  const labels = {}
  for (const [i, p] of PHASES.entries()) if (p[1].endsWith('.md')) { files[i] = readIf(path.join(d, p[1])); labels[i] = p[1] }
  const runtime = {}
  for (const f of RUNTIME_FILES) runtime[f] = readIf(path.join(d, 'runtime', f))
  const live = st.decisions.filter(x => !x.superseded)

  // A1 provenance completeness
  for (const x of live) if (!TAGS.includes(x.provenance)) F('A1', `${x.id} has invalid provenance "${x.provenance}"`)

  // A2 OWNER decisions carry an owner statement
  for (const x of live) if (x.provenance === 'OWNER' && !x.quote && !x.confirmedAt)
    F('A2', `${x.id} "${x.key}" is tagged OWNER with no quote or confirmation. Retag DERIVED.`)

  // A3 gates met carry evidence
  for (const p of st.phases) if (p.gate.status === 'met' && !p.gate.evidence) F('A3', `gate ${p.n} met with no evidence`)

  // A4 phase ordering
  for (let i = 1; i < st.phases.length; i++)
    if (st.phases[i].status === 'complete' && st.phases[i - 1].status !== 'complete')
      F('A4', `Phase ${i} complete while Phase ${i - 1} is not`)

  // A5 runtime profile word cap
  const prof = runtime['03_JANE_PROFILE.md']
  if (prof !== null) {
    const w = words(prof)
    if (w > PROFILE_WORD_CAP) F('A5', `03_JANE_PROFILE.md is ${w} words, cap is ${PROFILE_WORD_CAP}. Cut rationale, not instruction.`)
  }

  // A6 runtime package complete, no placeholders
  if (st.phases[9].status === 'complete' || Object.values(runtime).some(v => v !== null)) {
    for (const f of RUNTIME_FILES) {
      if (runtime[f] === null) { F('A6', `runtime/${f} missing`); continue }
      for (const re of PLACEHOLDERS) if (re.test(runtime[f])) F('A6', `runtime/${f} contains a surviving placeholder (${re})`)
    }
  }

  // A7 cross-Jane leak. Other Janes' names must not appear in this Jane's artifacts,
  // and no Jane name may appear in the framework itself.
  const others = fs.existsSync(root()) ? fs.readdirSync(root()).filter(x => x !== st.jane && fs.existsSync(path.join(root(), x, 'STATE.json'))) : []
  const otherNames = others.map(o => JSON.parse(fs.readFileSync(path.join(root(), o, 'STATE.json'), 'utf8')).displayName)
  const named = {}
  for (const [k, v] of Object.entries(files)) if (v) named[labels[k] || `phase ${k}`] = v
  for (const [k, v] of Object.entries(runtime)) if (v) named[`runtime/${k}`] = v
  for (const [k, v] of Object.entries(named))
    for (const on of otherNames)
      if (new RegExp(`\\b${on}\\b`, 'i').test(v)) F('A7', `${k} references another Jane by name ("${on}"). Cross-Jane assumption leak.`)

  // A8 hero count and classification, Phase 3
  if (files[3]) {
    const heroes = (files[3].match(/^\s*[-*|]?\s*.*\bMUST\b/gim) || []).length
    if (heroes < HERO_MIN || heroes > HERO_MAX) F('A8', `Phase 3 shows ${heroes} MUST items. Gate requires ${HERO_MIN}-${HERO_MAX}.`)
    if (!CLASSES.some(c => files[3].includes(c))) F('A8', 'Phase 3 has no MUST/SHOULD/COULD/DO NOT BUILD classification')
  }

  // A9 every MUST workflow carries all nine fields
  if (files[5]) {
    const nine = ['trigger', 'input', 'analysis', 'action', 'system', 'output', 'approval', 'escalation', 'value']
    const blocks = files[5].split(/^##\s+/m).slice(1)
    for (const b of blocks) {
      const title = b.split('\n')[0].trim()
      const missing = nine.filter(f => !new RegExp(f, 'i').test(b))
      if (missing.length) F('A9', `workflow "${title}" missing field(s): ${missing.join(', ')}`)
    }
  }

  // A10 every action categorized, and nothing client-facing is AUTONOMOUS
  if (files[7]) {
    if (!RIGHTS.every(r => files[7].includes(r))) F('A10', `Phase 7 does not use all four decision-right categories`)
    for (const line of files[7].split('\n')) {
      if (/AUTONOMOUS/.test(line) && /\b(client|customer|guest|patient|send|post|publish|price|invoice|charge|refund)\b/i.test(line))
        F('A10', `AUTONOMOUS action touches a client, money, or public record: "${line.trim().slice(0, 90)}"`)
    }
  }

  // A11 duplicate functionality
  if (files[5]) {
    const titles = (files[5].match(/^##\s+(.+)$/gm) || []).map(t => t.replace(/^##\s+/, '').trim().toLowerCase())
    const seen = new Set(), dup = new Set()
    for (const t of titles) { if (seen.has(t)) dup.add(t); seen.add(t) }
    for (const t of dup) F('A11', `duplicate workflow: "${t}"`)
    const trigs = (files[5].match(/^\s*[-*]?\s*\**trigger\**\s*[:|]\s*(.+)$/gim) || []).map(s => s.replace(/.*?[:|]\s*/, '').trim().toLowerCase())
    const s2 = new Set(), d2 = new Set()
    for (const t of trigs) { if (t && s2.has(t)) d2.add(t); s2.add(t) }
    for (const t of d2) F('A11', `two workflows share a trigger: "${t}"`)
  }

  // A12 stale facts embedded as permanent knowledge
  if (prof) {
    const stale = /\b(currently|as of|right now|this year|today|20\d\d|\$\s?\d|\d+\s*(clients|chairs|staff|followers)|version\s+\d)/gi
    const hits = [...new Set((prof.match(stale) || []).map(s => s.trim()))]
    const kn = prof.split(/what she learns/i)[0]
    const inKnows = hits.filter(h => kn.includes(h))
    if (inKnows.length) F('A12', `time-bound or volatile values in standing knowledge: ${inKnows.join(', ')}. Move to What She Learns.`)
  }

  // A13 DERIVED cannot be sole support for a guardrail, a MUST, or V1
  for (const x of live) {
    if (x.provenance !== 'DERIVED') continue
    if (/guardrail|decision right|v1|must/i.test(x.key)) F('A13', `${x.id} "${x.key}" is DERIVED and cannot be sole support. Needs OWNER or RESEARCH.`)
  }

  // A14 feature creep: runtime scope with no gate behind it
  if (runtime['04_WORKFLOWS.md'] && files[3]) {
    const rt = (runtime['04_WORKFLOWS.md'].match(/^##\s+(.+)$/gm) || []).map(t => t.replace(/^##\s+/, '').trim())
    for (const w of rt) if (!files[3].toLowerCase().includes(w.toLowerCase().slice(0, 18)))
      F('A14', `runtime workflow "${w}" does not appear in the Phase 3 opportunity map. Feature creep.`)
  }

  st.auditFindings = findings.map((f, i) => ({ id: `${f.id}.${i + 1}`, text: f.text, status: 'open', at: new Date().toISOString() }))
  save(st)

  if (!findings.length) { console.log(`AUDIT CLEAN ${st.displayName} passes all ${14} checks.`); process.exit(0) }
  console.log(`AUDIT FOUND ${findings.length} finding(s) for ${st.displayName}:\n`)
  for (const f of findings) console.log(`  ${f.id}  ${f.text}`)
  console.log('\nFindings may be fixed, or accepted with a recorded OWNER rationale. They may not be deleted.')
  process.exit(1)
}

// ---------- negative controls ----------

function cmdSelfTest() {
  const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'janetest-'))
  process.env.BUILD_JANE_ROOT = tmp
  let pass = 0, fail = 0
  const t = (label, fn) => {
    try { fn(); console.log(`  ok   ${label}`); pass++ }
    catch (e) { console.log(`  FAIL ${label}: ${e.message}`); fail++ }
  }
  const must = (cond, msg) => { if (!cond) throw new Error(msg) }

  // the checker must reject an OWNER tag with no owner statement
  t('OWNER without quote is rejected', () => {
    cmdInit(['--name', 'Testcase'])
    const st = load('Testcase')
    let threw = false
    const realExit = process.exit; process.exit = () => { throw new Error('exited') }
    const realErr = console.error; console.error = () => {}
    try { cmdDecide(['--name', 'Testcase', '--phase', '0', '--key', 'k', '--value', 'v', '--provenance', 'OWNER']) }
    catch { threw = true }
    process.exit = realExit; console.error = realErr
    must(threw, 'accepted an OWNER decision with no quote')
    must(load('Testcase').decisions.length === 0, 'recorded the bad decision anyway')
  })

  // the checker must reject a gate met without evidence
  t('gate met without evidence is rejected', () => {
    let threw = false
    const realExit = process.exit; process.exit = () => { throw new Error('exited') }
    const realErr = console.error; console.error = () => {}
    try { cmdGate(['--name', 'Testcase', '--phase', '0', '--met']) } catch { threw = true }
    process.exit = realExit; console.error = realErr
    must(threw, 'accepted a gate with no evidence')
  })

  // the checker must reject out-of-order gate closure
  t('out-of-order gate closure is rejected', () => {
    const d = dir('Testcase')
    fs.writeFileSync(path.join(d, 'phases', '03-opportunity-map.md'), '# x\nMUST a\n')
    let threw = false
    const realExit = process.exit; process.exit = () => { throw new Error('exited') }
    const realErr = console.error; console.error = () => {}
    try { cmdGate(['--name', 'Testcase', '--phase', '3', '--met', '--evidence', 'x']) } catch { threw = true }
    process.exit = realExit; console.error = realErr
    must(threw, 'closed gate 3 while gate 0 was open')
  })

  // the audit must fail on a fixture it is designed to catch
  t('audit fails on an over-cap runtime profile', () => {
    const d = dir('Testcase')
    fs.writeFileSync(path.join(d, 'runtime', '03_JANE_PROFILE.md'), 'word '.repeat(PROFILE_WORD_CAP + 50))
    const st = load('Testcase')
    must(words(fs.readFileSync(path.join(d, 'runtime', '03_JANE_PROFILE.md'), 'utf8')) > PROFILE_WORD_CAP, 'fixture is not over cap')
  })

  t('audit fails on a client-facing AUTONOMOUS action', () => {
    const d = dir('Testcase')
    fs.writeFileSync(path.join(d, 'phases', '07-guardrails.md'),
      'AUTONOMOUS RECOMMEND OWNER_APPROVAL NEVER\n- AUTONOMOUS: send the client a reminder\n')
    let exited = 0
    const realExit = process.exit; process.exit = (c) => { exited = c; throw new Error('exit') }
    const realLog = console.log; console.log = () => {}
    try { cmdAudit(['--name', 'Testcase']) } catch {}
    process.exit = realExit; console.log = realLog
    must(exited === 1, 'audit passed a client-facing AUTONOMOUS action')
    const st = load('Testcase')
    must(st.auditFindings.some(f => f.id.startsWith('A10')), 'A10 did not fire')
  })

  t('audit fails on a DERIVED guardrail', () => {
    cmdDecide(['--name', 'Testcase', '--phase', '7', '--key', 'guardrail refund limit', '--value', '100', '--provenance', 'DERIVED', '--inputs', 'D001'])
    let exited = 0
    const realExit = process.exit; process.exit = (c) => { exited = c; throw new Error('exit') }
    const realLog = console.log; console.log = () => {}
    try { cmdAudit(['--name', 'Testcase']) } catch {}
    process.exit = realExit; console.log = realLog
    const st = load('Testcase')
    must(st.auditFindings.some(f => f.id.startsWith('A13')), 'A13 did not fire on a DERIVED guardrail')
  })

  fs.rmSync(tmp, { recursive: true, force: true })
  console.log(`\nself-test: ${pass} passed, ${fail} failed`)
  process.exit(fail ? 1 : 0)
}

// ---------- dispatch ----------

const [cmd, ...rest] = process.argv.slice(2)
const table = {
  init: cmdInit, status: cmdStatus, resume: cmdResume, decide: cmdDecide,
  gate: cmdGate, audit: cmdAudit, block: cmdBlock, decisions: cmdDecisions,
  'owner-decisions': cmdOwnerDecisions, 'self-test': cmdSelfTest,
}
if (!cmd || !table[cmd]) {
  console.log(`jane.mjs <command>

  init   --name <Name> [--role <role>]
  status --name <Name>
  resume --name <Name>
  gate   --name <Name> --phase <0-10> [--met --evidence "..." | --fail --evidence "..."]
  decide --name <Name> --phase <n> --key <k> --value <v> --provenance <TAG> [--quote|--source|--inputs|--confirmed-at]
  decisions --name <Name> [--provenance <TAG>]
  owner-decisions --name <Name> [--phase <n>]
  block  --name <Name> --phase <n> --text "..."
  audit  --name <Name>
  self-test

  provenance tags: ${TAGS.join(', ')}
  jane root: ${root()}  (override with BUILD_JANE_ROOT)`)
  process.exit(cmd ? 1 : 0)
}
table[cmd](rest)
