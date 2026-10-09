# Consensus of ultimate reviews 01 · 02 · 03 → rev06

**Document:** `rebuild/ultimate-rev06.md`  
**Date:** 2026-10-09  
**Inputs:**  
- `rebuild/ultimate-rev.01.md` (strategy revision + refinements over `ultimate.md`)  
- `rebuild/ultimate-rev-02.md` (critical cutover-order review)  
- `rebuild/ultimate-rev-03.md` (pre-start clarifications review)  
**Subject:** What all three agree we should treat as settled before / while starting  
**Does not supersede:** use this as the **agreement sheet**; apply contested rulings (§4) once, then execute

---

## 1. One-line consensus

**Adopt the ultimate spine: cut over → delete the dual world → redesign the skin hard. Never rewrite the engine. Never redesign mid-migration. Patch the shared clarifications below before trusting Stage A/B wording.**

All three say: strategy is right; start cutover; do not start Phase 7 redesign or greenfield.

---

## 2. Unanimous agreements

### 2.1 Strategy tattoo (all three)

| Reject | Adopt |
|--------|--------|
| Naive greenfield / replay Phases 1–6 | Finish Phase 6 cutover, then delete vanilla |
| Endless parity patching | Aggressive Phase 7 presentation rebuild |
| Day-1 vanilla purge / 4-day mega-sprint | Sequenced surfaces with effort bands |
| `/jobs/[slug]` + OG in first redesign | Keep `/jobs/?id=` until a later explicit decision |

**Tattoo:** Ship the cutover, delete the dual world, then redesign the skin hard — never the engine, never mid-migration.

### 2.2 Keep (non-negotiable) — all three

- `src/lib/jobs/*` (slug, filters, validation, fetch, admin)  
- Domain Vitest suite (do not rewrite for greenfield)  
- Firestore `jobs` contract + `firestore.rules`  
- Auth allowlist ↔ `isAdmin()` sync test  
- `src/lib/yasmin/editor-html.ts` (Quill → Tiptap forever)  
- Arabic RTL  
- Next 16 + React 19 + Tailwind v4 + shadcn + `output: 'export'` → GH Pages `out/`  
- Job detail: `/jobs/?id={slug}` until Stage E  

### 2.3 Never — all three

- Greenfield platform / domain rewrite  
- Dual-maintain vanilla while redesigning Next  
- Rename Firestore fields / drop Quill HTML compat  
- Reopen host / CMS / middleware as Phase 7 defaults  
- Treat build-time `generateStaticParams` as request-time SSR SEO  

### 2.4 Kill-list (Phase 7) — all three confirm

| Corpse | Agreed action |
|--------|----------------|
| `hero-effects.tsx` (`getElementById` + typing `setTimeout`) | Delete |
| `micro-interactions.tsx` / `scroll-reveals.tsx` (`MutationObserver` on `body`) | Delete |
| `services-effects.tsx` (document click → DOM mutate) | Delete |
| `custom-cursor.tsx` + `cursor: none !important` | Delete |
| `booking-modal.tsx` iframe `setInterval` poll | Replace with Radix/shadcn Dialog |
| Fake WhatsApp hero | Replace with brand-first fold |
| Multi-CSS ownership (`hirefound.css` / `yasmin.css` as owners) | Collapse to one token system |

### 2.5 Stage shape — all three

| Stage | Agreement |
|-------|-----------|
| **A — Cutover** | Get Next `out/` live via Actions on `main`; smoke homepage / `?id=` apply / Yasmin CRUD; close Phase 6 |
| **B — Delete** | After smoke: purge vanilla root (`index.html`, `js/`, `jobs/`, vanilla `yasmin/`, legacy `css/`); clean eslint/vitest ignores; grep-zero CDN Tailwind/Firebase |
| **C — Kickoff** | Record visual direction in decision log; dual review per surface |
| **D — Redesign** | Order: **tokens + shared chrome → homepage → jobs → Yasmin** (chrome before homepage) |
| **E — Later** | `/jobs/[slug]`, OG/JSON-LD, host change, Zod+RHF — explicit new decisions only |

### 2.6 Rulings — all three

- Cutover **before** redesign  
- Phase 7 = **hard skin rebuild**, not timid polish  
- Vanilla deletion **after** merge/smoke (not Day 1)  
- Defer path SEO / `[slug]`  
- Do **not** start homepage/token redesign while two deploy truths exist  

### 2.7 Shared operational clarifications (02 ∩ 03; 01 compatible)

These appear as “must fix / clarify” in rev-02 and rev-03; rev-01’s Stage B and cutover intent align if read carefully:

1. **`public/assets/` is sacred** — Delete root `assets/` only if at all. Never delete `public/assets/` or break `out/CNAME` / `hirefound.com` assert. Next serves `/assets/...` from `public/`.  
2. **Preflight** — Run `npm test` + `npm run build` on `v2` before merge; do not trust folklore “189 green” alone.  
3. **Vitest after delete** — Drop vanilla includes/aliases (`yasmin/__tests__`, root `__tests__` mocks pointing at CDN Firebase); **re-baseline** the Next-only suite count as the new gate (do not forever require “189” if that count included vanilla).  
4. **Ambiguous “leave legacy” wording** — Must mean **switch** Pages from legacy to Actions, not keep legacy.  
5. **`agy` closes the gate, does not forever freeze code** — Mark Phase 6 *done* only after dual review; merge/smoke is not hostage to an open-ended `agy` wait (exact merge-vs-agy timing: see §4).  
6. **Adopt in living plan** — Paste strategy decision-log into `docs/platform-plan.md`; note Phase 7 **execute** chrome/tokens before homepage even if plan checkbox order lists chrome last.  

### 2.8 Product bets for Phase 7 — all three (directionally)

- Brand-first public fold; quieter motion (2–3 intentional)  
- Booking via Radix Dialog (no iframe poll)  
- Jobs: MENA scan, bilingual/RTL, keep `?id=`, clear apply path  
- Yasmin: operator density, ~2 min publish, keep Tiptap + `editor-html`  

---

## 3. Where the three diverge (not consensus — need one ruling)

Do **not** pretend these are agreed. Pick once, then start.

| Topic | rev.01 | rev-02 | rev-03 | Notes |
|-------|--------|--------|--------|-------|
| **Stage A order** | Pages → Actions, then merge; DNS **parallel** (not a merge blocker) | **Critical:** merge `v2`→`main` **first**, wait for green Actions run, **then** switch Pages to Actions, then DNS | Pages → Actions → DNS → merge (agy not merge-block) | **02’s dark-site risk is real:** Actions-only Pages with no workflow on `main` yet = blank site. Prefer **merge-first** unless Pages stays legacy until first green Actions deploy. |
| **External DNS** | Explicitly decouple from code cutover | After Pages source switch | In the cutover sequence | All allow DNS not to block *forever*; 01 is strongest on parallel |
| **`agy` Phase 6 status** | Claims already audited/passed by `agy` | Treats gate hygiene; honesty note | Still **deferred** per `platform-plan.md` (2026-10-07) | Living plan still says deferred — **verify before marking gate done**; do not invent a pass |
| **Trust section** | Unhide as D2 must | Silent | Soft-check with Yasmin first | Prefer confirm content readiness |
| **Brand at Stage C** | Pre-writes full boutique palette/type | Silent | Soft candidates; one decision-log line | Prefer one logged line; avoid locking a full moodboard in the strategy doc |
| **CSS migration tactic** | Extract `@utility` before dropping `hirefound.css` (zero-FOUC) | Silent | Silent | Good Stage D practice; not a cutover blocker |
| **CalDialog spec depth** | Concrete component spec | Silent (kill poll) | Silent (Radix Dialog) | Agreed outcome; 01 has more build detail |
| **Honesty / unverified** | Asserts suite + build times from review pass | Requires unresolved note | Requires preflight re-run | Prefer preflight + honesty |

### Recommended single ruling for start (rev06 suggestion)

Until you override it:

1. **Stage A order:** Preflight on `v2` → **merge `v2`→`main`** → confirm first Actions build green → **then** switch Pages source to Actions → DNS in parallel or next → smoke → close gate with real `agy` status from plan.  
2. **DNS:** Do not block merge on registrar TTL; do not claim apex cutover complete until DNS points at Pages.  
3. **`agy`:** Read `platform-plan.md`; if still deferred, run it to close the gate — do not mark passed from rev.01 alone.  
4. **Trust:** Goal to modernize; confirm with Yasmin before shipping visible.  
5. **Brand:** One decision-log line at Stage C; boutique linen/burgundy/gold as *candidate*, not locked dogma.

---

## 4. Consensus start checklist

Do these; they are agreed or compatible across all three:

- [ ] Treat `ultimate` spine + this rev06 agreement sheet as the cutover brief  
- [ ] Paste decision-log into `docs/platform-plan.md` (ultimate / rev strategy)  
- [ ] Preflight on `v2`: `npm test` && `npm run build`  
- [ ] Execute Stage A with **safe Pages order** (see §3 ruling: merge before flipping to Actions-only)  
- [ ] Smoke: vacancies, `?id=` + apply, Yasmin CRUD → public HTML  
- [ ] Close Phase 6 gate with accurate Cursor + `agy` status  
- [ ] Stage B: delete vanilla root only; **never** `public/assets/` / live CNAME product  
- [ ] Re-baseline Vitest after dropping vanilla includes  
- [ ] Grep-zero: `cdn.tailwindcss.com`, CDN Firebase pins, `tailwind.config =`  
- [ ] Only then Stage C–D redesign (tokens/chrome first)  

**Do not:** start homepage redesign, delete vanilla before smoke, delete `public/assets`, or pull `[slug]` into Phase 7.

---

## 5. Bottom line

| Question | Consensus answer |
|----------|------------------|
| Is the ultimate strategy right? | **Yes** (all three) |
| Greenfield? | **No** |
| Start redesign now? | **No — cutover first** |
| Need clarifications before trusting Stage A/B text? | **Yes** — assets sacred, preflight, vitest re-baseline, clear Pages wording, `agy` = gate not folklore |
| Biggest unresolved fight? | **Stage A order (merge-first vs Pages-first)** — adopt merge-first to avoid a dark site |
| Ready to start Stage A? | **Yes**, once §3 ruling + checklist are followed |

**Ship the cutover. Delete the dual world. Redesign like you mean it — after smoke.**
