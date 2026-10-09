# Review of `rebuild/ultimate.md` — required changes before starting (rev-02)

Date: 2026-10-09
Reviewed: `rebuild/ultimate.md` (298 lines, canonical strategy)
Against: `opinion01–03`, `all01–03`, plus parent verification of start-critical claims in the live repo (branch `v2`).
Sibling reviews: `ultimate-rev.01.md`, `ultimate-rev-03.md` (peer sessions; this file is independent).

## Verdict

`ultimate.md` is the best merge of all seven docs and is safe to adopt as canonical —
after the 4 fixes below. One is critical (wrong cutover order could take the site dark);
three are hygiene (vague delete scope, missing test re-baseline, missing honesty note).

## Fix 1 (critical): Stage A steps are in deployment-unsafe order

`ultimate.md` §7 orders: (1) Pages source → Actions, (3) merge `v2` → `main`.

Parent-verified facts:

- `.github/workflows/deploy.yml` triggers on `push` to `main` only.
- Current branch is `v2`; `main` still serves the vanilla legacy tree with (presumably) no Actions workflow.

Consequence: flipping Pages source to Actions before the merge leaves Pages with no workflow
to run — the site goes dark until the merge lands. Also, the step-1 parenthetical
"(leave `legacy` from `main /`)" does not parse.

Required rewrite of Stage A:

1. Merge `v2` → `main` first.
2. Watch that first Actions run go green on `main` (build + `out/` assertions).
3. Then switch Pages source from legacy to GitHub Actions.
4. Then move apex/`www` DNS off Squarespace parking to Pages.
5. Then smoke + deferred `agy` gates.

## Fix 2: Stage B "root runtime assets" is dangerously vague

`ultimate.md` Stage B says: "Delete as product: root `index.html`, `jobs/`, vanilla `yasmin/`,
`js/`, legacy `css/`, root runtime assets."

Parent-verified facts:

- 8 files under `src/` reference `/assets/` (nav, footer, Hero, About, booking-modal, jobs + yasmin pages).
- `src/app/layout.tsx:34` hard-depends on `/assets/hirefound-signature.svg`; OG images point at `hirefound.com/assets/yasmin-blasi.png`.
- Those URLs are served from `public/assets/` (which also holds `CNAME = hirefound.com`, asserted by deploy.yml as `out/CNAME`).
- Root `assets/` (favicon, signatures, ~763KB portrait) looks duplicated with `public/assets/`.

Required rewrite: delete root `assets/` only; state explicitly that `public/assets/` +
`public/CNAME` are live product and must never be touched in Stage B. Deletion dedupes
the ~763KB portrait for free.

## Fix 3: Stage B needs an explicit test re-baseline

Parent-verified fact: `vitest.config.mjs` includes `yasmin/__tests__/**` and `__tests__/**`
with mock aliases pointing at `js/firebase-config.js` and the CDN Firebase ESM pin —
i.e. part of today's suite tests the vanilla tree through mocks.

Consequence: after vanilla deletion those includes and aliases must go too, and the
"189 green" count will drop. Carrying "189" as a permanent gate (§6/§8) would then fail
on a healthy tree.

Required addition to Stage B: record the pre-delete count, remove the vanilla includes +
dead firebase-mock aliases, and re-baseline the Next-only suite count as the new gate.
Related: run `npm test && npm run build` once as the Stage A baseline before touching
anything (suite-green to date is subagent-reported, not parent-rerun).

## Fix 4: add the unresolved-honesty note (the all02 graft that didn't land)

`ultimate.md` §4 presents evidence without stating what was *not* verified. Add:

- Full-suite green (24 files / 189 tests) is subagent-reported; parent has not re-run it in this pass.
- The exact prior admin-allowlist drift instance was truncated in a subagent ref; current sync state needs one confirming read.
- The §1 scoring table (42/59/65) and §4 path-economics table are judgment from code/config state, not measured cost/UX data.

## Confirmed good (no change)

- §4 kill-list: every corpse re-verified (MutationObservers, `getElementById` typing loop, `setInterval` iframe poll, `cursor: none !important`, hidden Trust, WhatsApp hero, existing Radix `ui/dialog.tsx`).
- `?id=` deferral to Stage E (static-export lock, `platform-plan.md:64`).
- Anti-goals, boundary thinking, decision-log line (§11), source map (§12), greenfield reconsideration bar.
- Scores table is labeled opinion; leave as-is once Fix 4 labels it.

## Recommended §11 addendum (paste alongside the existing line)

> **2026-10-09 (rev-02)** — Review of `rebuild/ultimate.md`: adopt as canonical after
> reordering Stage A (merge → green Actions run → Pages source → DNS), scoping Stage B
> deletes to root `assets/` only, re-baselining the Vitest suite post-delete, and noting
> unverified items above. Source: `rebuild/ultimate-rev-02.md`.
