---
description: Run the Janes Build Workflow. Create, resume, status, or audit a Jane through Phases 0-10 with gated state and provenance tracking.
argument-hint: new <Name> | resume <Name> | status <Name> | audit <Name>
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Skill, AskUserQuestion, WebSearch, WebFetch
---

# /build-jane

Reusable development system for Studio Jane verticals. Runs one Jane through
eleven gated phases, preserving state so work stops and resumes without redoing
completed phases.

**Arguments:** `$ARGUMENTS`

## Setup

```
BJ=~/.claude/build-jane
JANE=node $BJ/scripts/jane.mjs
```

Janes live in `./janes/<slug>/` under the current working directory. Override
with `BUILD_JANE_ROOT`. Read before doing anything:

- `$BJ/references/PHASES.md` for the phase specs, gates, and owner decision lists
- `$BJ/references/PROVENANCE.md` for the tagging rules
- `$BJ/references/AUDIT.md` before Phase 10

Phase 2 runs on the `jane-operator-research` skill. Invoke it when you reach
Phase 2, and follow its evidence tiers and routing table. This command owns the
state and the gates. That skill owns the evidence.

## Subcommands

### `new <Name>`

1. `$JANE init --name <Name>`
2. Read `PHASES.md` Phase 0.
3. Run Phase 0 Intake. Gather the six fields by asking **one question at a time**.
   Do not ask for what you can find. Do not ask all six at once.
4. Record each settled value with `$JANE decide`, tagged honestly.
5. Present the Phase 0 OWNER DECISIONS and only those.
6. On approval: `$JANE gate --name <Name> --phase 0 --met --evidence "..."`

Stop at the gate. Do not run into Phase 1 without a decision.

### `resume <Name>`

1. `$JANE resume --name <Name>` to get the first incomplete phase and its
   open owner decisions.
2. Read that phase's spec in `PHASES.md` and its artifact if one exists.
3. Continue from there.

**Do not re-open a settled phase.** Completed phases are shown as settled and
stay settled. If a later phase contradicts an earlier one, that is a Phase 10
audit finding, not a reason to reopen. Record it and continue.

### `status <Name>`

`$JANE status --name <Name>`, then report in prose: phases complete, current
gate, decisions by provenance, open blockers, open audit findings, next action.
Do not re-summarize the analysis. Status is state, not content.

### `audit <Name>`

1. `$JANE audit --name <Name>` for the fourteen machine checks.
2. Work the reading checks in `AUDIT.md` by hand.
3. Report findings. Change nothing that a gate already approved.

Audit is read-only against approved work. A finding is fixed or accepted with an
`OWNER` rationale. Never deleted.

## Rules that hold across every subcommand

**Gates are real.** A phase closes only with recorded evidence. `jane.mjs`
refuses out-of-order closure and refuses a gate met with no evidence. Do not
work around it.

**Surface only owner judgment.** At each gate, present the OWNER DECISIONS list
for that phase and nothing else. Farrah has already seen the analysis, or has
chosen not to. Re-presenting completed work is how a build stalls. Everything
else is recorded in the artifact and available on request.

**Ask one question at a time.** Compact, mobile-readable. No em dashes.

**Provenance on every consequential value.** `OWNER`, `RESEARCH`, `DERIVED`,
`HISTORY`, `DOCUMENT`. `OWNER` requires a verbatim quote or a dated confirmation,
and the engine enforces it. When there is no owner statement, the tag is
`DERIVED` and the value goes to the next gate as a question. Never label a
derived decision as owner.

**Architecture boundaries are not negotiable by findings.** No autonomous client
conversation. Nothing sent without owner approval. No named AI employees with
overlapping roles. No proprietary software as delivery. No promises of hours
saved, autopilot, or revenue outcomes. No content treadmills. Research that
keeps pointing at one of these is a finding about the vertical.

**The framework is the deliverable, not any one Jane.** Poppy is the reference
implementation in development. What was learned building her belongs in her
artifacts. Anything written into this framework must stay true for a Jane in a
different vertical with a different buyer and a different revenue engine. Check
A7 and audit reading check 7 exist for this.

**The runtime profile is capped at 1,500 words.** `03_JANE_PROFILE.md` holds
operational instruction only. No research narrative, no evidence tiers, no
scoring tables. Cut rationale before cutting instruction. Machine checked.

## Trust the checks only after proving they fail

`$JANE self-test` runs each machine check against a fixture it must catch. Run
it before relying on a clean audit. An absence check that always passes is a
certificate, not a check.

## Entity naming

The canonical architecture is Farrah and Company LLC, holding Brand Jane Studio,
See Jane Brand, and Brand Jane Labs. Do not collapse, pluralize, or abbreviate
them. The `jane-operator-research` skill uses the phrase "Studio Jane" for this
product line, which appears nowhere else in the ecosystem. Treat it as unsettled
and ask Farrah before putting either form into buyer-facing copy.
