# Agreement of ultimate reviews 01 · 02 · 03 (rev05)

Date: 2026-10-09
Inputs: `rebuild/ultimate-rev.01.md`, `rebuild/ultimate-rev-02.md`, `rebuild/ultimate-rev-03.md`
Subject: `rebuild/ultimate.md` (canonical strategy)
Purpose: record exactly what the three reviews agree on, and name what they don't.
Relation: `ultimate-rev06.md` (peer) is a similar agreement sheet with its own rulings;
this file is the agreement record; contested rulings live in §4.

## 1. Unanimous: the spine stands

All three reviews agree — strategy is right, start cutover, no new strategy doc needed:

| Reject | Adopt |
|--------|-------|
| Naive greenfield / replay Phases 1–6 | Finish Phase 6 cutover, then delete vanilla |
| Endless parity patching | Aggressive Phase 7 presentation rebuild (not timid polish) |
| Day-1 vanilla purge / 4-day mega-sprint | Sequenced surfaces with effort bands |
| `/jobs/[slug]` + OG in first redesign | Keep `/jobs/?id=` until a later explicit decision |

Tattoo (all three): ship the cutover, delete the dual world, redesign the skin hard —
never the engine, never mid-migration.

## 2. Unanimous: keep / never / kill

Keep (non-negotiable): `src/lib/jobs/*`, domain Vitest suite (no greenfield rewrite),
Firestore `jobs` contract + `firestore.rules`, auth allowlist ↔ `isAdmin()` sync test,
`editor-html.ts` Quill compat, Arabic RTL, Next 16 + React 19 + Tailwind v4 + shadcn +
`output: 'export'` → GH Pages `out/`, `?id=` until Stage E.

Never: greenfield platform/domain rewrite; dual-maintain vanilla while redesigning;
rename Firestore fields / drop Quill compat; reopen host/CMS/middleware as Phase 7
defaults; treat build-time `generateStaticParams` as request-time SSR SEO.

Kill-list Phase 7 (all three confirm, all parent-verified in code): `hero-effects.tsx`,
`micro-interactions.tsx` / `scroll-reveals.tsx`, `services-effects.tsx`,
`custom-cursor.tsx` + `cursor: none !important`, booking-modal `setInterval` iframe poll
(replace with Radix Dialog), fake WhatsApp hero (brand-first fold), Trust `hidden`,
multi-CSS ownership (collapse to one token system).

## 3. Unanimous: stage shape

- **A — Cutover:** get Next `out/` live via Actions on `main`; smoke vacancies /
  `?id=` + apply / Yasmin CRUD → public HTML; close Phase 6 gate with accurate reviews.
- **B — Delete:** after smoke only — purge vanilla root (`index.html`, `js/`, `jobs/`,
  vanilla `yasmin/`, legacy `css/`, root `assets/`); clean eslint/vitest configs;
  grep-zero CDN Tailwind/Firebase pins and global `tailwind.config`.
- **C — Kickoff:** record visual direction in decision log; dual Cursor + `agy` review
  per surface via `docs/ui-ux-review-prompt.md`.
- **D — Redesign, in this order:** tokens + shared chrome → homepage → jobs →
  Yasmin dashboard → Yasmin editor.
- **E — Later, explicit decisions only:** `/jobs/[slug]`, OG/JSON-LD, host change,
  Zod + RHF, CI checks.

## 4. Near-unanimous operational clarifications (02 ∩ 03, 01 compatible or silent)

1. **`public/assets/` is sacred.** Delete root `assets/` only. Next serves `/assets/...`
   from `public/` (layout icon, OG images, nav/footer/Hero); `out/CNAME` is asserted
   by deploy. (rev-01's "root runtime assets" wording is vague — read it scoped.)
2. **Preflight on `v2`:** `npm test` + `npm run build` must pass before merge; do not
   trust folklore "189 green" — that count is subagent-reported, not parent-rerun.
3. **Vitest re-baseline:** deleting vanilla drops `__tests__` + `yasmin/__tests__`
   includes and dead firebase-mock aliases — record pre-delete count, re-baseline the
   Next-only suite as the new gate.
4. **Pages wording:** "switch source from legacy (`main /`) to GitHub Actions" —
   never "leave legacy."
5. **Adopt in living plan:** paste strategy decision-log into `docs/platform-plan.md`;
   execute chrome/tokens before homepage in Phase 7.

## 5. NOT agreed — one ruling each (decided, not consensus)

| Topic | Positions | Ruling for start |
|-------|-----------|------------------|
| Stage A order | 01/ultimate + 03: Pages→Actions then merge · 02: merge → green run → source → DNS | **Merge-first.** `deploy.yml` is `main`-only; Actions-first Pages with no workflow on `main` = dark site. DNS may move in parallel after the source switch. |
| DNS blocking | 01: fully parallel · others: in-sequence | Parallel OK; do not claim apex cutover complete until DNS points at Pages. |
| `agy` Phase 6 status | 01: claims passed · 02/03 + living plan line 45: deferred | **Deferred until proven.** Run `agy`; never mark the gate from a review doc's word. Merge/smoke are not hostage to it (gate checkbox is). |
| Trust unhide | 01/ultimate: D2 must · 03: soft-check | Confirm content readiness with Yasmin before shipping visible. |
| Brand at Stage C | 01: full palette/type pre-lock · 03: one log line | One decision-log line; boutique linen/burgundy/gold as candidate, not dogma. |
| Lighthouse ≥95 | 01: hard gate · ultimate/03: optional | Optional stretch gate. |

## 6. Start checklist (agreed or ruled above)

- [ ] Preflight on `v2`: `npm test` && `npm run build`
- [ ] Merge `v2` → `main`; confirm first Actions build green
- [ ] Then switch Pages source to Actions; DNS in parallel/next
- [ ] Smoke: vacancies, `?id=` + apply, Yasmin CRUD → public HTML
- [ ] Paste strategy line into `docs/platform-plan.md`; run deferred `agy` to close gate
- [ ] Stage B: delete vanilla root only (never `public/assets/`); re-baseline Vitest; grep-zero CDN pins
- [ ] Only then Stage C–D (tokens/chrome first)

Do not: redesign on two trees, delete before smoke, touch `public/assets`, pull `[slug]` into Phase 7.
