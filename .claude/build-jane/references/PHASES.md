# Janes Build Workflow

Eleven phases, Phase 0 through Phase 10. Each phase has one artifact, one gate,
and a short list of decisions that require owner judgment.

Two rules govern the whole workflow:

1. **Never skip a gate.** A phase is complete only when its gate is met with
   recorded evidence. `jane.mjs` refuses to open a phase whose predecessor is unmet.
2. **Surface only owner judgment at a gate.** Everything else is recorded in the
   artifact and the decision log. Do not re-present completed analysis for review.
   The OWNER DECISIONS list in each phase below is the entire review surface.

## Provenance

Every important decision or value carries exactly one tag. See `PROVENANCE.md`.
`OWNER`, `RESEARCH`, `DERIVED`, `HISTORY`, `DOCUMENT`.

## Architecture boundaries

These hold in every phase and are not negotiable by findings. Sourced from the
`jane-operator-research` skill's off-architecture list.

- No live or autonomous conversation with the owner's clients.
- Nothing sent without owner approval. She writes, the owner sends.
- No named AI employees with overlapping roles.
- No proprietary software as the delivery mechanism.
- No promises of hours saved, autopilot, hands-off operation, or revenue outcomes.
- No volume-based content production treadmills.

If research keeps pointing at an off-architecture route, that is a finding about
the vertical, not an argument to bend the architecture. Record it and say so.

---

## Phase 0. Intake

**Purpose.** Establish who this Jane is for and what evidence already exists.
Nothing is researched here. This phase inventories what is already known.

**Captures**

| Field | Notes |
|---|---|
| Jane name | Proper noun, one word, drawn from the naming source Farrah approves |
| Target buyer | The person who pays, not the vertical |
| Industry / category | The trade or service category |
| Available research | What already exists, by location and form |
| Existing decisions | Anything Farrah has already settled, tagged OWNER |
| Source / provenance | Where each intake value came from |

**Gate 0.** Enough evidence exists to define the buyer and the business model.

Fails when the target buyer is a vertical rather than a person, when no Tier 1 or
Tier 2 evidence is reachable, or when every intake field is DERIVED.

**OWNER DECISIONS**

- Jane name.
- Target buyer, stated as a business shape and not a category.
- Whether to proceed, hold for more evidence, or pass on this vertical.

**Artifact.** `phases/00-intake.md`

---

## Phase 1. Business Definition

**Purpose.** Describe the business this Jane serves, in economic terms.

**Captures**

| Field | Notes |
|---|---|
| Buyer | Business shape, who does the operator work today, whether that person exists |
| Business model | How the business is structured |
| Revenue engines | Appointment, retainer, project, product, class, and their mix |
| Customer types | Segments, and which ones carry the margin |
| Operating environment | Physical or remote, staffed or solo, tooling baseline, seasonality |

**Gate 1.** Buyer, business and economic model are clear.

Fails when revenue engines are listed without a mix, when the operator role is
unnamed, or when the description would fit a different vertical with three words
changed.

**OWNER DECISIONS**

- Primary business shape, with adjacent shapes named but not served.
- Which revenue engine the Jane is built to protect.

**Artifact.** `phases/01-business-definition.md`

---

## Phase 2. Operating System

**Purpose.** Map the real operating work. This is the evidence phase and it runs
on the `jane-operator-research` skill. Read that skill before starting.

**Captures**

| Field | Notes |
|---|---|
| Recurring work | Decision inventory first, task inventory second |
| Workflows | The sequences the work actually moves through |
| Triggers | What prompts each piece of work |
| Systems / tools | What handles it today, including spreadsheets, memory, nothing |
| Failure points | Where it breaks, and what it costs when it does |
| Current manual work | The quiet work nobody notices until it stops |

Every finding carries an evidence tier and a provenance tag. Tier definitions
live in the `jane-operator-research` skill. Do not restate them here.

**Gate 2.** Real operating work is mapped rather than hypothetical features.

Fails when the inventory lists tasks without the decisions attached to them, when
a finding has no source tier, or when the map contains capabilities rather than work.

**OWNER DECISIONS**

- Confirmation that the decision inventory matches how the work actually runs.
- Any item Farrah knows to be wrong or missing from lived experience, tagged HISTORY.

**Artifact.** `phases/02-operating-system.md`

---

## Phase 3. Opportunity Map

**Purpose.** Score every candidate Jane job and classify it.

**Score each candidate on six axes.** Score 1 to 5. Record the score, not just the class.

| Axis | High score means |
|---|---|
| Frequency | Happens often |
| Business / revenue impact | Moves money or client trust |
| Friction | Costs the owner real time or dread |
| Automation feasibility | A Jane can actually do it within architecture |
| Differentiation | Not already solved by a cheap incumbent tool |
| Risk | Low risk scores high. Consequence of error is small and reversible |

**Classify** each candidate as exactly one of:

- `MUST` Build. Hero workflow candidate.
- `SHOULD` Build after the MUST set is executable.
- `COULD` Real value, deferred without loss.
- `DO NOT BUILD` Off-architecture, owned by an incumbent tool, or owner-only judgment.

A candidate that scores well but violates an architecture boundary is
`DO NOT BUILD`. Feasibility never overrides architecture.

**Gate 3.** Four to six hero workflows are selected.

Fails outside that range. Fewer than four is not a product. More than six is a
platform, and the MVP will not survive Phase 8.

**OWNER DECISIONS**

- The final hero set, four to six.
- Any `DO NOT BUILD` that Farrah wants reconsidered, with the boundary it touches named.

**Artifact.** `phases/03-opportunity-map.md`

---

## Phase 4. Jane Definition

**Purpose.** Give this Jane one job.

**Captures**

| Field | Notes |
|---|---|
| Identity | Who she is to this owner |
| Scope | The edge of her work, stated as what falls outside it |
| Core promise | One sentence a buyer would repeat |
| What She Knows | Standing knowledge, true before she meets this owner |
| What She Learns | What only this owner can supply. Becomes the personalizer |
| What She Does | The routed work, drawn from the hero set |
| Boundaries | What she never does, including the architecture boundaries |
| Decision rights | Preview of Phase 7. Where judgment stays with the owner |

**Gate 4.** Jane has one clear job and is not a generic AI assistant.

Fails when the core promise would be true of any AI assistant, when
What She Knows and What She Learns are not clearly separated, or when scope is
stated only as inclusions.

**OWNER DECISIONS**

- Core promise, verbatim.
- Identity and register.
- Anything moved from What She Does into Boundaries.

**Artifact.** `phases/04-jane-definition.md`

---

## Phase 5. Workflow Architecture

**Purpose.** Make each hero workflow executable in principle.

**Every hero workflow defines all nine fields.** A missing field fails the gate.

1. Trigger
2. Inputs
3. Analysis / reasoning
4. Action
5. System / tool
6. Output
7. Approval requirement
8. Escalation
9. Value

**Gate 5.** Every MUST HAVE workflow is executable in principle.

Executable in principle means a competent builder could implement it without
inventing a decision. Fails when any of the nine fields is absent, when the
approval requirement is unstated, or when a workflow depends on a system the
owner does not have.

**OWNER DECISIONS**

- Approval requirement per workflow, where it differs from the Phase 7 default.
- Any workflow whose value does not justify its build cost.

**Artifact.** `phases/05-workflow-architecture.md`

---

## Phase 6. Product Architecture

**Purpose.** Let Jane persist state and operate across workflows.

**Captures**

| Field | Notes |
|---|---|
| Data objects | Entities and their fields |
| Memory | What persists, for how long, and what expires |
| Integrations | What she reads from and writes to |
| APIs | Surface she depends on, and the failure mode when it is down |
| Permissions | Who can see and do what |
| UI surfaces | Where the owner meets her |
| Alerts | What reaches the owner unprompted, and how loudly |
| Audit trail | What she did, when, and on whose authority |
| Provenance | How a stored value records where it came from |

**Gate 6.** Jane can persist state and operate across workflows.

Fails when a Phase 5 workflow needs a data object that does not exist, when
memory has no expiry policy, or when the audit trail cannot answer who approved an action.

**OWNER DECISIONS**

- Integrations Farrah will and will not depend on.
- Alert tolerance. What is allowed to interrupt the owner.

**Artifact.** `phases/06-product-architecture.md`

---

## Phase 7. Guardrails and Decision Rights

**Purpose.** Make sure Jane cannot silently cross a consequential boundary.

**Categorize every action** into exactly one of four:

- `AUTONOMOUS` She acts without asking. Reversible, low consequence, no client contact.
- `RECOMMEND` She proposes. The owner decides.
- `OWNER_APPROVAL` She prepares fully and stops. Nothing leaves without a yes.
- `NEVER` Off-architecture or beyond her standing.

Anything touching a client, money, price, or public record defaults to
`OWNER_APPROVAL` or higher. Default down, never up.

**Add guardrails** in five domains, each with the trigger that fires it:

Legal, financial, security, privacy, reputation.

**Gate 7.** Jane cannot silently cross consequential boundaries.

Fails when any Phase 5 action is uncategorized, when an action touching a client
is `AUTONOMOUS`, or when a guardrail domain has no named trigger.

**OWNER DECISIONS**

- Every action proposed as `AUTONOMOUS`. This list is short by design.
- Escalation path when a guardrail fires.

**Artifact.** `phases/07-guardrails.md`

---

## Phase 8. MVP

**Purpose.** Define the smallest sellable Jane.

**Separate into four tiers.** Every hero workflow lands in exactly one.

| Tier | Meaning |
|---|---|
| `V1` Smallest thing someone would pay for |
| `V1.5` Fast follow. Already designed, not required to sell |
| `V2` Real scope, deferred deliberately |
| `DO NOT BUILD` Cut, with the reason recorded |

Also record, for V1 only:

- **Technical dependencies.** What must exist first.
- **Validation assumptions.** What V1 assumes to be true, and the cheapest test
  that would prove it wrong. Each one tagged and testable.

**Gate 8.** Smallest sellable Jane is defined.

Fails when V1 contains a workflow whose dependency is unbuilt, when V1 has no
stated validation assumptions, or when V1 is the entire hero set.

**OWNER DECISIONS**

- The V1 line. What ships first.
- Price posture, if V1 changes it.

**Artifact.** `phases/08-mvp.md`

---

## Phase 9. Runtime Package

**Purpose.** Produce the handoff. Seven files, generated into `runtime/`.

| File | Contains |
|---|---|
| `01_RESEARCH_SYNTHESIS.md` | Phase 2 findings, with tiers and provenance |
| `02_OWNER_DECISIONS.md` | Every OWNER-tagged decision, with its source quote |
| `03_JANE_PROFILE.md` | The runtime instruction. Hard cap 1,500 words |
| `04_WORKFLOWS.md` | Phase 5, all nine fields per workflow |
| `05_DATA_MODEL.md` | Phase 6 |
| `06_MVP_SPEC.md` | Phase 8 |
| `07_BUILD_HANDOFF.md` | What a builder needs, open questions, validation plan |

**`03_JANE_PROFILE.md` is the runtime instruction and obeys a hard cap of 1,500 words.**

It contains only operationally useful instruction. It is not the dossier. Exclude
research narrative, evidence tiers, scoring tables, market description, and
rationale. Keep identity, scope, promise, What She Knows, What She Learns,
What She Does, boundaries, decision rights, and escalation.

If it will not fit, cut rationale before cutting instruction. The research lives
in `01_RESEARCH_SYNTHESIS.md` and is one file away.

**Gate 9.** All seven files exist, no placeholder survives, and the profile is
at or under 1,500 words. Machine-checked.

**OWNER DECISIONS**

- Sign-off on `03_JANE_PROFILE.md`, read aloud.

**Artifact.** `runtime/`

---

## Phase 10. Audit

**Purpose.** Catch what the phases let through. Runs against the whole Jane, not
the current phase. See `AUDIT.md` for the full checklist and the machine checks.

**Checks**

1. Contradictions between phases.
2. Unsupported assumptions. Anything DERIVED sitting where RESEARCH is required.
3. Feature creep. Scope in Phase 9 that no gate approved.
4. Stale or current facts embedded as permanent knowledge. Prices, counts, tool
   versions, "currently", dated claims. These belong in What She Learns, not What She Knows.
5. Missing approval gates. A Phase 5 action with no Phase 7 category.
6. Duplicate functionality. Two workflows with the same trigger or the same job.
7. Jane-specific assumptions leaking into the master framework. Named for Poppy,
   the reference implementation, and enforced against every Jane.

**Gate 10.** Jane passes before build handoff.

Fails on any unresolved finding. A finding may be accepted with a recorded
rationale, tagged OWNER. It may not be deleted.

**OWNER DECISIONS**

- Any audit finding accepted rather than fixed.

**Artifact.** `phases/10-audit.md`
