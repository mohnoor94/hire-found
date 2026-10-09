# Rebuild vs refine — verdict and plan (opinion02)

Date: 2026-10-09
Question: should `hire-found` be rebuilt from the ground up for nicer UI/UX, or fixed incrementally?
Method: 3 subagents (pro-rebuild, anti-rebuild, neutral auditor) + judge synthesis, then parent corroboration of decisive claims.
Status source of truth: `docs/platform-plan.md` (Phase 6 — Cutover, in progress).

## Verdict

**Hybrid-strangler: finish the Phase 6 cutover. Do NOT greenfield-rebuild. Do NOT stay on incremental vanilla patching.**

The repo already contains both ends of the migration:

- Legacy vanilla: root `index.html` (78KB), `jobs/index.html`, vanilla `yasmin/`, `js/` (nav.js, footer.js, jobs.js, booking-modal.js, utils.js, tailwind-config.js, firebase-config.js), `css/shared.css`, Tailwind via CDN + global side-effect config, Firebase via CDN ESM 11.8.1.
- Modern Next.js: Next 16.4.0 + React 19.3.0 + Firebase ^11.10.0 + Tailwind v4 + shadcn + Tiptap 3.31.4 + Vitest 4.1.7, under `src/` (79 files), 161 git-tracked files, 24 test files / 189 tests reported green.

`docs/platform-plan.md` status line (corroborated): Current phase = Phase 6 — Cutover (in progress); vanilla served from `main` while Next.js `v2` branch prepares the Pages Actions cutover. A scratch rebuild aborts and replays Phases 1–6 for zero architectural gain. Pure incremental vanilla work keeps both stacks and doubles every nav/footer/jobs-fetcher edit forever.

## Pro-rebuild case (strongest version)

1. Dual-stack tax: every change must be mirrored in legacy + Next until cutover.
2. Legacy fragility (all corroborated by parent):
   - `index.html` lines ~30–31: `<script src="https://cdn.tailwindcss.com">` + `<script src="js/tailwind-config.js">`; `js/tailwind-config.js` sets global `tailwind.config` and must load AFTER the CDN — order-dependent, render-blocking, FOUC-prone.
   - `js/firebase-config.js`: CDN ESM pins `11.8.1`; `package.json` npm dep is `^11.10.0` — version drift vector.
   - `eslint.config.mjs`: `globalIgnores(js/**, yasmin/**, __tests__/**)` — legacy is untyped/unlinted; `tsconfig strict:true` covers only the new app.
3. Fresh UI/UX wants one design system, one IA, one jobs pipeline — not mirrored edits.

## Anti-rebuild case (strongest version, wins)

1. Cost/time: rebuild-from-scratch is highest (replays finished strangler, discards test net). Incremental-vanilla is cheapest short-term but perpetuates dual-stack cost. Hybrid-strangler is cheapest to DONE — pages/routes/design-system already built; remaining work is cutover + legacy deletion.
2. Risk/regression: rebuild is highest risk (discards green suite; risks desyncing the duplicated admin allowlist `firestore.rules isAdmin()` vs `src/lib/yasmin/auth.ts ALLOWED_EMAILS`, a flagged Phase 6 high-risk item). Incremental-vanilla is low short-term risk but preserves CDN-order fragility, Firebase drift, and untyped tree. Hybrid-strangler is lowest net risk (keeps tests, removes drift vectors by deletion).
3. UX gain: no version-rot justification — stack is current per `package.json` + `node_modules`. Gains come from build-time Tailwind 4, single npm Firebase SDK, one IA — all delivered by cutover, not a second rewrite.
4. Maintainability: hybrid wins decisively — cutover deletes half the repo, puts all code under strict TS + eslint-config-next + vitest.
5. Morale: rebuild demoralizes (throws away near-complete v2 + green suite); incremental demoralizes (endless mirror edits); finishing the strangler ships visible deletion + single-stack ownership.

## Scoring

| Dimension | Scratch rebuild | Incremental vanilla | Hybrid-strangler (finish cutover) |
|---|---|---|---|
| Cost/time to DONE | Highest | Cheapest today, expensive forever | Cheapest to DONE |
| Risk/regression | Highest | Low now, drift accumulates | Lowest net |
| UX gain | Same as strangler, later | ~None (keeps CDN FOUC/drift) | Full (build Tailwind, one IA/SDK) |
| Maintainability | Good after long delay | Worst (two stacks) | Best (one strict stack) |
| Morale | Demoralizing | Grinding | Shipping (deletions) |

## What "rebuild" concretely means here

Not a new repo. It means: cut over, delete legacy, then redesign on the single Next stack (Phase 7).

Stack (locked per `next.config.ts` + plan): Next.js 16.4 App Router static export (`output:'export'`, `trailingSlash:true`, `images.unoptimized:true`) for GitHub Pages at `hirefound.com`; React 19; TS strict; Tailwind v4 (`@tailwindcss/turbopack` + `tw-animate-css`) with `@theme` brand tokens (`--color-primary #7A1E4A`, etc.); shadcn radix-nova (neutral, cssVariables, lucide); Firebase Auth + Firestore client-only (no Functions/Storage/Hosting, no api/ handlers/middleware); Tiptap editor; Vitest + jsdom + fast-check.

IA (single): `src/app/layout.tsx` (Inter/DM_Serif_Display/Noto_Sans_Arabic, BookingModalProvider, globals.css + hirefound.css) with `/` (page.tsx), `/jobs/` (jobs/page.tsx + job-card/job-detail/jobs-page-client/jobs-states, client-loaded `?id=` detail so new jobs work without rebuild), `/yasmin/` (10 admin components incl. dashboard/job-editor/Tiptap rich-text-editor/auth-views).

Design system: consolidate to `src/components/ui` (button/dialog/input/label/select/switch/textarea) + `site-*` sections (site-nav, site-footer, Hero/About/AntiPitch/Services/HowItWorks/Trust/Wave*/live-vacancies) + `yasmin/yasmin.css`.

Delete: `index.html`, `jobs/index.html`, `js/`, vanilla `yasmin/`, `css/shared.css`, `js/tailwind-config.js` + CDN script tags, CDN Firebase ESM pins. Keep `firestore.rules isAdmin()` allowlist (`moh.noor94@gmail.com`, `yasmin@hirefound.com`) in sync with `src/lib/yasmin/auth.ts ALLOWED_EMAILS` via single-source or checked test.

## Plan to DONE

### A. Cutover (Phase 6 remainder — do this, not a rewrite)
1. Set Pages source to GitHub Actions (repo is still `build_type: legacy` from `main /` per 2026-10-07 decision log); point apex/www `hirefound.com` DNS (currently Squarespace parking) at Pages.
2. Merge `v2` → `main` so `.github/workflows/deploy.yml` builds Next and uploads `out/` only.
3. Deploy Firestore rules via `npm run firebase:deploy-rules`; verify `isAdmin()` ↔ `ALLOWED_EMAILS` match.
4. Smoke: `/`, `/jobs/`, `/jobs/?id=<slug>`, `/yasmin/` login/dashboard/editor, new-job-without-rebuild path.
5. Resume deferred `agy` reviews (high-risk firestore-rules, gh-pages-export, phase-6-gate) before marking `done`.

### B. Legacy deletion (the visible "rebuild")
1. Delete root `index.html`, `jobs/`, vanilla `yasmin/`, `js/`, `css/shared.css`.
2. Remove eslint `globalIgnores` entries for deleted trees; keep `.next/out/build` ignores.
3. Confirm single nav/footer/jobs-fetcher; grep for `cdn.tailwindcss.com`, `gstatic.com/firebasejs`, `tailwind.config =` — zero hits expected.

### C. Redesign (Phase 7, after parity — where "nicer UI/UX" belongs)
1. Leave Phase 7 visual direction blank until parity done (per plan); then pick direction + run dual review (Cursor then `agy` per `docs/ui-ux-review-prompt.md`) per surface.
2. Candidates the judge named: build-time Tailwind theme consolidation, one jobs pipeline polish, Yasmin editor polish (Tiptap, `dir="rtl"` Arabic field), homepage sections system.

## Evidence (corroborated by parent 2026-10-09)

- `docs/platform-plan.md:11` — Phase 6 Cutover in progress; `main` serves vanilla until cutover.
- `package.json` — next 16.4.0, react/react-dom 19.3.0, firebase ^11.10.0, Tiptap ^3.31.4, tailwindcss ^4, vitest ^4.1.7.
- `index.html:30-31` — Tailwind CDN script + `js/tailwind-config.js` global side-effect.
- `js/firebase-config.js:8-10` — CDN ESM `11.8.1` vs npm `^11.10.0`.
- `eslint.config.mjs:9-19` — ignores `js/**, yasmin/**, __tests__/**`.
- `next.config.ts:7-11` — static export + trailingSlash + unoptimized images.
- `firestore.rules:5-11` — `isAdmin()` allowlist with keep-in-sync comment.
- `src/app/{layout.tsx,page.tsx,jobs/,yasmin/}` + `src/components/{ui,site,jobs,yasmin}` exist.

## Unresolved / not evidenced

- Exact prior admin-allowlist drift instance ("already drifted once…" truncated in subagent ref).
- Full cutover checklist remainder (Pages Actions steps, redirect/SEO plan) beyond Phase 6 status line.
- No cost/time estimates, UX metrics, or morale survey data — dimension scores are qualitative trade-offs from code/config state.
- Test-suite green state is subagent-reported (`npx vitest run`, 24 files/189 tests); parent did not re-run suite in this turn.
