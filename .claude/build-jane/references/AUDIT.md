# Phase 10 Audit

Runs against the whole Jane, not the current phase. Half of this is machine
checked by `jane.mjs audit`. The other half needs reading, and the machine says so.

## Machine checks

`node <build-jane>/scripts/jane.mjs audit --name <Name>`

Exits nonzero with named findings. Prove the checks can fail before trusting a
clean result: `jane.mjs self-test` runs each one against a fixture it must catch.

| Id | Fails when |
|---|---|
| A1 | A decision carries an invalid or missing provenance tag |
| A2 | An `OWNER` decision has no quote and no confirmation reference |
| A3 | A gate is marked met with no evidence |
| A4 | A phase is complete while an earlier phase is not |
| A5 | `03_JANE_PROFILE.md` exceeds 1,500 words |
| A6 | A runtime file is missing, or a placeholder survived into one |
| A7 | This Jane's artifacts name another Jane. Cross-Jane leak |
| A8 | Hero count is outside four to six, or classification is absent |
| A9 | A workflow is missing any of the nine Phase 5 fields |
| A10 | An action is uncategorized, or a client-facing action is `AUTONOMOUS` |
| A11 | Two workflows share a name or a trigger |
| A12 | Time-bound or volatile values sit in standing knowledge |
| A13 | A `DERIVED` decision is the sole support for a guardrail, a MUST, or V1 |
| A14 | A runtime workflow never appeared in the Phase 3 opportunity map |

## Reading checks

No command decides these. Work them by hand and record the result.

**1. Contradictions.** Read Phase 1 against Phase 8. A revenue engine named as
primary in Phase 1 and absent from V1 is a contradiction, not a deferral, unless
Phase 3 recorded why. Read Phase 4 boundaries against Phase 5 actions.

**2. Unsupported assumptions.** Every `DERIVED` value in a consequential position.
A13 catches the ones whose keys name a guardrail or a MUST. It cannot catch the
one phrased as a fact in the middle of a paragraph. Read for confident sentences
with nothing behind them.

**3. Feature creep.** A14 catches new workflows. It does not catch a workflow
that grew. Compare each Phase 9 workflow against its Phase 5 definition and ask
what got added after the gate closed.

**4. Stale facts as permanent knowledge.** A12 catches dates, prices, and counts
by pattern. The real failure is subtler: a claim true of this vertical in this
season, written as though it were always true. "Booking slows in January" is
standing knowledge. "Her January is slow" is something she learns. Anything the
owner could contradict from experience belongs in What She Learns.

**5. Missing approval gates.** A10 catches uncategorized actions in Phase 7. Read
Phase 5 for actions that never reached Phase 7 at all, and for an approval
requirement stated as "as needed", which is not a requirement.

**6. Duplicate functionality.** A11 matches names and triggers. Two workflows can
do the same job under different names with different triggers. Ask of each pair:
if one were deleted, what would actually be lost.

**7. Cross-Jane leakage into the framework.** The check that matters most and the
one hardest to automate. A7 catches a Jane naming another Jane. It does not catch
a vertical assumption written into the framework in general language.

Read `PHASES.md`, `PROVENANCE.md`, and this file, and ask of every sentence:
would this still be true for a Jane in a different vertical, serving a different
buyer, with a different revenue engine. Anything that would not be true is a
finding against the framework, not against the Jane.

The reference implementation is the usual source. What was learned building the
first Jane feels like what is true of all Janes. It is not. Specifics earned in
one vertical belong in that Jane's artifacts. The framework holds only what
survives the change of vertical.

## Disposition

Every finding ends in one of two states. There is no third.

- **Fixed.** The artifact changed. Re-run the audit.
- **Accepted.** Recorded as an `OWNER` decision with a rationale and the finding
  id in the key. Requires a quote. Acceptance is a decision, and decisions have owners.

A finding is never deleted, and an audit is never reported clean while one is open.
