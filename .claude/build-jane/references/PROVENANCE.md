# Provenance Standard

Every important decision or value carries exactly one tag. No value carries two.
An untagged decision is a defect, not a default.

| Tag | Means | Requires |
|---|---|---|
| `OWNER` | Explicitly chosen by Farrah | A verbatim quote or a dated confirmation reference |
| `RESEARCH` | Supported by external research | A source and an evidence tier |
| `DERIVED` | Generated from approved inputs | The inputs it was derived from, by decision id |
| `HISTORY` | Learned from client or business history | The engagement, client, or period it came from |
| `DOCUMENT` | Extracted from a source document | The document and the location inside it |

## The rule that matters

**Never label a DERIVED decision as OWNER.**

This is the failure the standard exists to prevent. A derived decision wearing an
owner tag is how a guess becomes policy. Three phases later nobody can tell which
choices Farrah actually made, and the ones she did not make are the ones that
cannot be revisited, because they look settled.

The machine check is narrow but real. `jane.mjs` refuses to record an `OWNER`
decision without a `--quote` or a `--confirmed-at` reference. It cannot read minds,
so it enforces the one thing it can observe: an owner decision has an owner
statement behind it. If there is no statement, the tag is `DERIVED`, and the
decision goes to the next gate as a question.

## Choosing between adjacent tags

- Farrah repeated a research finding back approvingly. That is `RESEARCH` unless
  she chose between options. Agreement is not authorship.
- A value read out of a source document and then adjusted is `DERIVED`, with the
  document cited as the input. `DOCUMENT` means extracted, not adapted.
- Something true of past clients that has not been tested in this vertical is
  `HISTORY`. It is planning evidence, not build evidence.
- `DERIVED` is the honest default. It is not a weak tag. Most of a good build is
  derived, and labeling it so is what makes the OWNER set short enough to trust.

## Where each tag may travel

| Destination | Allowed |
|---|---|
| `02_OWNER_DECISIONS.md` | `OWNER` only |
| MUST classification, Phase 3 | `OWNER`, `RESEARCH`, `HISTORY` |
| V1, Phase 8 | `OWNER`, `RESEARCH` |
| What She Knows, Phase 4 | `RESEARCH`, `DOCUMENT`, `OWNER` |
| What She Learns, Phase 4 | Any. This is where uncertainty belongs |
| Guardrails, Phase 7 | `OWNER` or `RESEARCH`. Never `DERIVED` alone |

A `DERIVED` value may inform any of these. It may not be the sole support for a
guardrail, a MUST, or a V1 inclusion. Phase 10 checks this.

## Superseding

Decisions are never edited in place and never deleted. A changed decision is a
new record that names the one it supersedes. The log is the record of how the
Jane came to be, and a rewritten log cannot answer the only question an audit asks:
who decided this, and on what.
