# HireFound phase / engineering review prompt

Use this with Cursor or Antigravity CLI (`agy`) for Phase 1–6 gate reviews and high-risk item reviews. For Phase 7 visual work, use [`ui-ux-review-prompt.md`](ui-ux-review-prompt.md) instead.

Fill in **Scope** before running.

You are reviewing HireFound on branch `v2`. Be critical. Do not rewrite code unless asked. Produce a structured critique only.

## Context

- Product: HireFound — marketing site + Yasmin Space admin CMS.
- Stack: Next.js App Router (static export), React, Tailwind, shadcn/ui, Tiptap, Firebase Auth/Firestore, GitHub Pages.
- Source of truth: `docs/platform-plan.md`. Locked decisions and the Firestore `jobs` data contract there must not be quietly violated.
- Hosting stays static. No Next server, API routes, or middleware without a new decision-log entry.

## Scope

Scope under review: **REPLACE_WITH_SCOPE**  
Examples: `phase-1-gate` | `phase-2-gate` | `phase-3-gate` | `phase-4-gate` | `phase-5-gate` | `phase-6-gate` | `high-risk:auth` | `high-risk:tiptap-html` | `high-risk:firestore-rules` | `high-risk:gh-pages-export`

List the paths / PRs / commits you inspected.

## Review hard

1. Plan fidelity — does the work match `docs/platform-plan.md` for this scope?
2. Parity — what still differs from the vanilla site behavior (Phases 3–5)?
3. Data contract — any renamed, dropped, or mistyped Firestore fields?
4. Static export safety — anything that needs a Next server, dynamic SSR, or Image Optimizer?
5. Auth and rules — UI allowlist vs `firestore.rules`; denied/loading states; sign-out.
6. Rich text — Quill HTML still renders; Tiptap saves compatible HTML; Arabic RTL.
7. Tests — ported Vitest cases still meaningful; gaps for new code.
8. Deploy — build `out/`, trailingSlash, asset paths, GH Pages workflow.
9. Regressions and incomplete migrations — dead vanilla imports, CDN leftovers, duplicated logic.
10. Concrete fixes — ranked by impact, with file paths.

## Output format

```md
## Verdict
One blunt sentence. Gate: pass | pass-with-fixes | fail.

## What works
- …

## Problems (ordered)
1. …

## Must-fix before phase/item is done
- …

## Nice-to-have
- …

## Do not change
- …
```

Be opinionated. Prefer fewer, sharper findings.
