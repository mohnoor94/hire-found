# All-opinions synthesis — what to change now (all02)

Date: 2026-10-09
Sources: `rebuild/opinion01.md` (smart rebuild), `rebuild/opinion02.md` (hybrid-strangler scoring), `rebuild/opinion03.md` (cut-then-skin debate + plan).
Method: parent read all three in full, then verified the load-bearing code claims inline (no extra agents — nothing left that needed a new evidence surface).
Source of truth: `docs/platform-plan.md` (Phase 6 Cutover in progress; Phase 7 redesign not started).

## 1. Verdict

**Cut over, delete the dual world, rebuild tokens + visible surfaces. No greenfield platform rewrite. No endless parity patching.**

In one line: adopt opinion03's sequence, fold opinion01's in-Next hit list into it, obey opinion02's locks.

## 2. What each opinion actually says

### opinion01 — "Smart rebuild" (most aggressive on UI)

- Diagnosis: the Next app is a "Frankenstein" parity port — imperative DOM scripts (`getElementById`, `MutationObserver` on `document.body`, `setTimeout` typing loops, 1,500+ lines ported CSS) wrapped in React shells; plus weak brand UX (fake WhatsApp hero, hidden Trust section, disconnected Yasmin styling, `?id=` query routing with no OG/SEO).
- Prescription: rebuild 100% of UI/design-system/components in a 4-day blitz, including dynamic `/jobs/[slug]` + OG + JSON-LD now; preserve the domain engine (189 tests, Firestore rules, auth state machine, Quill→Tiptap sanitizer, RTL, slug engine).
- All its code charges verified true by parent on 2026-10-09 (see §4).

### opinion02 — "Hybrid-strangler" (most conservative on scope)

- Diagnosis: pain is dual-stack + CDN fragility (Tailwind CDN order-dependence, Firebase 11.8.1 CDN vs 11.10.0 npm drift, untyped/unlinted legacy), not version rot — stack is current.
- Prescription: finish Phase 6 cutover (Pages Actions, DNS, merge, rules, smoke, deferred `agy` reviews) → delete legacy root tree → redesign in Phase 7 after a direction pick. Keep `?id=` (locked). Scores strangler cheapest/lowest-risk on every dimension.
- Weakness: thin on the in-Next cleanup (effects components, cursor, modal polling) that 01 proved real.

### opinion03 — "Cut, then skin" (the synthesis of the two)

- Decision matrix: homepage shell → rebuild; jobs UX → redesign in place; Yasmin → redesign in place; tokens → rebuild; routing/hosting → keep; with explicit anti-goals (no field renames, no `?id=` change mid-redesign, no test-suite rewrite, no host/CMS change).
- Sequenced plan A (cutover ~2–4d) → B (deletion ~1d) → C (Phase 7 kickoff) → D (surfaces ~2–4wk, tokens/chrome first) → E (optional later: `[slug]`, CI, SSR host).
- This file adopts 03 as the spine.

## 3. Agreements (unanimous — just do them)

1. No full wipe. Keep: Firestore `jobs` contract, Auth allowlist model, `src/lib/jobs/*`, `editor-html` Quill compat, 189-test suite, Next 16 + React 19 + Tailwind v4 + shadcn + GH Pages `out/` host.
2. No parity-patching forever. Parity was a migration tactic; it is not the product destination.
3. Cutover first: Pages → Actions, DNS off Squarespace parking, `v2`→`main`, rules deploy, smoke, close the deferred Phase 6 reviews.
4. Delete vanilla after smoke: root `index.html`, `jobs/`, vanilla `yasmin/`, `js/`, `css/shared.css`, CDN tags/pins, dead eslint ignores.
5. Tokens are the highest-leverage single change; end the multi-stylesheet collision tax.
6. "Fresh" = presentation rebuild on the proven spine, with per-surface dual review.

## 4. Verified evidence (parent-observed, 2026-10-09)

Platform (supports 02/03 locks):

- `docs/platform-plan.md:11` — Phase 6 Cutover in progress; `main` serves vanilla.
- `package.json` — next 16.4.0, react 19.3.0, firebase ^11.10.0, Tiptap ^3.31.4, tailwindcss v4, vitest ^4.1.7.
- `index.html:30-31` + `js/tailwind-config.js` — CDN Tailwind + global `tailwind.config` side effect.
- `js/firebase-config.js:8-10` — CDN ESM 11.8.1 vs npm ^11.10.0 drift.
- `eslint.config.mjs:9-19` — legacy trees ignored by lint.
- `next.config.ts:7-11` — static export + trailingSlash + unoptimized images (the `[slug]` constraint).
- `firestore.rules:5-11` — `isAdmin()` allowlist with keep-in-sync comment.
- `platform-plan.md:64` — `?id=` locked so new jobs work without rebuild.

In-Next debt (supports 01's charges):

- `src/components/site/micro-interactions.tsx`, `scroll-reveals.tsx` — `MutationObserver(document.body)`.
- `src/components/site/hero-effects.tsx:33-37` — `getElementById` typing loop.
- `src/components/site/booking-modal.tsx:134,196-198` — `setInterval` iframe polling.
- `src/app/hirefound.css:200` — `cursor: none !important` global override.
- `src/components/site/sections/Trust.tsx:3` — press section hardcoded `hidden`.

## 5. Divergences and rulings

### (a) `/jobs/[slug]` now vs later — RULE: later (02/03 over 01)

01 wants dynamic routes + OG + JSON-LD in the rebuild. Attractive, but static export on Pages has no per-slug file for post-build jobs — that is exactly why `?id=` was locked. Pretty paths need a prebuild strategy or host change, i.e. a new decision with SEO/redirect planning, not a free UI win. Defer to Stage E.

### (b) UI blitz vs sequenced surfaces — RULE: sequenced (03 over 01)

01's 4-day wipe of all effects/CSS/surfaces at once maximizes blast radius mid-cutover. Same deletions, done surface-by-surface after the dual world is gone, keep every step shippable and reviewable. Fold 01's entire hit list in — just not as one big bang.

### (c) Legacy deletion vs in-Next cleanup priority — RULE: legacy first, in-Next during redesign

Dual-tree tax is what makes every fix tedious today; in-Next effects are what will make Phase 7 feel new. Order: kill the second site, then the second idiom.

## 6. Plan to DONE (adopted)

### Stage A — Finish Phase 6 (~2–4 calendar days; DNS-bound)

1. Pages source → GitHub Actions; apex/www DNS → Pages.
2. Merge `v2` → `main`; deploy workflow builds Next, uploads `out/` only.
3. `npm run firebase:deploy-rules`; verify `isAdmin()` ↔ `ALLOWED_EMAILS`.
4. Smoke: homepage vacancies, `?id=` detail + one apply path, Yasmin sign-in/create/edit/public-render, new-job-without-rebuild.
5. Resume deferred `agy` reviews (firestore-rules, gh-pages-export, phase-6-gate) before marking done.
6. Do not start redesign assuming two trees.

### Stage B — Delete the dual world (~1 day)

Delete root `index.html`, `jobs/`, vanilla `yasmin/`, `js/`, legacy `css/`, root runtime `assets/` as product. Drop dead eslint ignores and vanilla test includes. Grep zero for `cdn.tailwindcss.com`, CDN Firebase pins, global `tailwind.config =`. Keep `.kiro/specs/` + archive note as history.

### Stage C — Phase 7 kickoff (~half day)

Pick visual direction (one decision-log line: brand signal, motion budget, admin density rule). Per-surface dual review via `docs/ui-ux-review-prompt.md`. Standing rule: swap components/CSS; leave `src/lib/**`, Firebase init, schema, domain tests, export hosting alone.

### Stage D — Redesign surfaces (~2–4 weeks, highest "feels new" per day first)

1. Tokens + shared chrome (nav, footer, booking modal → Radix Dialog) — 3–5d.
2. Homepage composition rebuild in `src/components/site/**` (keep vacancy wiring; kill cursor/effects, unhide Trust, replace WhatsApp widget with brand-first fold) — 4–7d.
3. Jobs scan/filter/detail layout (keep `?id=` + apply order) — 3–5d.
4. Yasmin dashboard density (list, filters, status, shortcuts) — 2–4d.
5. Yasmin editor chrome (form layout, Tiptap toolbar, RTL, confirms/toasts; keep HTML contract) — 3–5d.

Parallel surgical work: unify CSS ownership; split `job-editor` (~726 LOC) and other monoliths as their surfaces are touched; single-source the allowlists + keep sync test.

### Stage E — Optional later (not Phase 7)

Pretty `/jobs/[slug]`, CI PR checks, SSR/ISR host, Functions/Storage/CMS — each a new decision, none a prerequisite for "fresh".

## 7. Success criteria

1. Vanilla retired as UX + deploy truth; no parity lock.
2. One token system; no stylesheet collisions.
3. Public first viewport reads brand-first; motion intentional (2–3 pieces, no cursor/effect farm).
4. Yasmin feels operator-grade (target: publish a role in < ~2 min).
5. Domain tests green; Firestore/Quill/auth contracts untouched.
6. Phase 7 ships the rebuild once — no follow-on rewrite.

Reconsider greenfield only if, after A–D, the Next tree is still structurally unworkable or the data/auth/editor model is proven wrong — not because cutover felt tedious.

## 8. Risks

| Risk | Mitigation |
|---|---|
| DNS/Pages slip | Stage A is calendar-critical; no Stage D on dual trees |
| Phase 7 scope creep | Anti-goals (§2/03), 3-route boundary, surface-by-surface gates |
| Quill HTML regressions | Keep `editor-html` helpers; smoke public HTML after edits |
| Allowlist drift | Single source + sync test; deploy rules with UI changes |
| URL/host ambition mid-redesign | Stage E; new-decision rule |
| "Just start over" urge | Re-read §§3–5: platform paid for; presentation is the rebuild |

## 9. Unresolved

- Exact prior allowlist-drift instance (truncated in a subagent ref).
- Full cutover remainder (Actions steps, redirect/SEO plan) beyond the Phase 6 status line.
- No cost/UX-metric data — scores are qualitative from code/config state.
- Suite green (24 files/189 tests) is subagent-reported; parent has not re-run `vitest` in this pass.
