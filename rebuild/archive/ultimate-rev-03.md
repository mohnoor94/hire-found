# Review of `ultimate.md` — findings before start (rev-03)

**Document:** `rebuild/ultimate-rev-03.md`  
**Date:** 2026-10-09  
**Subject:** `rebuild/ultimate.md` (canonical strategy after comparing opinion01–03 and all01–03)  
**Cross-checked against:** `docs/platform-plan.md` (Phase 6 in progress), deploy workflow, `public/assets` vs root `assets`, Vitest includes  
**Question:** Do we need to change anything about ultimate before we start?

---

## 1. Verdict

**Strategy is solid. Start Stage A.**

Nothing in the review overturns the tattoo: cut over → delete dual world → redesign the skin hard; never the engine; never mid-migration.

A handful of **clarifications** should be patched into `ultimate.md` (or followed as standing rules) so cutover does not create avoidable mistakes. None of them change the spine, the keep/kill matrix, or Stage D ambition.

| Bucket | Count |
|--------|-------|
| Keep as written | Spine, matrix, kill-list, Stage D order, anti-goals, SEO deferral |
| Must clarify before / while starting Stage A | 6 items (§3) |
| Optional / non-blocking | Scoring table, `N` shortcut, Lighthouse ≥95, dual hero CTA copy |

---

## 2. What’s already right (do not change)

1. **Sequencing** — Phase 6 cutover before any surface rebuild; delete vanilla only after smoke.  
2. **Definition of rebuild** — presentation/skin on proven spine; not greenfield platform.  
3. **Keep list** — `src/lib/jobs/*`, 189-test suite, Firestore contract, auth↔rules sync, `editor-html`, RTL, static export, `?id=` until Stage E.  
4. **Never list** — dual vanilla, field renames, Quill-compat drop, host/CMS as Phase 7 default, treating build-time slugs as request-time SSR.  
5. **Kill-list** — effects bridges, custom cursor, WhatsApp hero, Trust `hidden`, booking iframe poll — corroborated in code.  
6. **Stage D order** — tokens + chrome → homepage → jobs → Yasmin dashboard → Yasmin editor (highest “feels new” per day).  
7. **Rulings** — reject Day-1 purge, 4-day blitz, early `/jobs/[slug]`, pre-locked boutique palette, Zod+RHF as must.  
8. **Meta judgment** — all03 as best spine; absorb all02 evidence discipline + all01 surface kill criteria. Correct.

Fidelity to `docs/platform-plan.md` is good: Phase 6 still cutover-in-progress; Phase 7 starts only after Phase 6; `?id=` and `output: 'export'` remain locked.

---

## 3. Must clarify / patch before relying on the doc

### 3.1 Stage A vs deferred `agy` (merge-block ambiguity)

**Issue:** Stage A step 6 says resume deferred `agy` and mark Phase 6 done only after dual review. That is correct for the **gate checkbox**, but can be misread as “do not merge until `agy` finishes.”

**Plan fact:** Cursor reviews for high-risk items already recorded; `agy` was deferred for the day (2026-10-07). Plan “Next work” is Pages→Actions + DNS; then merge + smoke.

**Fix:** State explicitly:

> Pages Actions → DNS → merge `v2`→`main` → smoke may proceed. Deferred `agy` closes the Phase 6 *gate* (and high-risk boxes); it is not a hard block before merge/smoke.

### 3.2 Stage B assets — do not delete `public/assets`

**Issue:** Stage B says delete “root runtime assets.” Root `/assets` is a vanilla duplicate. Next serves files from **`public/assets`** as `/assets/...` (Hero, nav, footer, OG, Yasmin favicon all reference `/assets/...`).

**Fix:** State explicitly:

> Delete root `assets/` only. **Never delete `public/assets/`** (or `public/CNAME` handling — CNAME is asserted in deploy from `out/`).

### 3.3 Stage A.1 wording (“leave legacy”)

**Issue:** “Pages source → GitHub Actions (leave `legacy` from `main /`)” is ambiguous (sounds like keep legacy).

**Fix:** “**Switch** GitHub Pages source from legacy (`main /`) to **GitHub Actions**.”

### 3.4 Pre-flight before merge

**Issue:** Ultimate cites “189 tests green” from earlier audits; parent did not re-run Vitest in every pass.

**Fix:** Add one pre-Stage-A (or pre-merge) line:

> On `v2`: `npm test` + `npm run build` must pass before merge to `main`.

### 3.5 Trust unhide — product soft-check

**Issue:** Ultimate treats unhiding Trust (TEDx / Leaders of Arabia / testimonials) as a Stage D homepage must. Trust is hardcoded `hidden` today — may be intentional (content not ready).

**Fix:** Keep Trust modernization as a Phase 7 goal; add:

> Confirm with Yasmin before shipping Trust visible (content may have been hidden on purpose).

### 3.6 Adopt strategy in the living plan

**Issue:** Ultimate §11 has a decision-log line to paste; it is not yet in `docs/platform-plan.md`. Phase 7 surface list in the plan lists shared nav/footer/booking **last**; ultimate correctly puts chrome/tokens **first**.

**Fix when adopting:**

1. Paste the §11 decision-log line into `platform-plan.md`.  
2. Note Phase 7 implement order: **tokens + shared chrome before homepage** (plan surface checkboxes can stay; execution order follows ultimate Stage D).

---

## 4. Optional / non-blocking (leave or trim later)

| Item | Note |
|------|------|
| Scoring table (all01–03) | Audit trail; does not affect execution |
| Source map | Fine as appendix |
| Yasmin `N` shortcut | Stage D acceptance criterion, not Stage A work |
| Dual hero CTAs (hiring vs explore roles) | Stage D copy/IA; not cutover |
| Lighthouse ≥95 | Stretch optional gate; fine as written |
| Zod + RHF | Correctly Stage E optional |

---

## 5. Cutover reality check (corroborated)

| Fact | Status |
|------|--------|
| Phase 6 | In progress |
| Pages | Still `build_type: legacy` from `main /` |
| Live | Vanilla on `mohnoor94.github.io/hire-found/` |
| Apex | `hirefound.com` → Squarespace parking until DNS + Actions |
| Deploy workflow on `v2` | Builds Next, uploads `out/`, asserts `out/CNAME` = `hirefound.com` |
| Firestore rules | Deployed; allowlist sync Cursor done; `agy` deferred |
| Smokes | Not started (after merge) |
| Root `assets/` vs `public/assets/` | Duplicates; Next uses `public/` |

No contradiction with ultimate’s Stage A–B intent once §3 clarifications are applied.

---

## 6. Recommended start sequence (unchanged spine)

1. Patch §3 clarifications into `ultimate.md` (or treat this rev as the errata sheet).  
2. Paste decision-log into `platform-plan.md`; note chrome-before-homepage for Phase 7.  
3. Preflight: `npm test` + `npm run build` on `v2`.  
4. **Stage A:** switch Pages → Actions → DNS → merge → smoke.  
5. Close Phase 6 gate with deferred `agy` (can overlap after merge).  
6. **Stage B:** delete vanilla (+ root `assets/` only); grep-zero CDN pins.  
7. Only then Stage C–D redesign.

**Do not** start homepage/token redesign, slug routes, or vanilla deletion while dual deploy truth still exists.

---

## 7. Bottom line

| Question | Answer |
|----------|--------|
| Is ultimate the right strategy? | **Yes** |
| Need a new strategy doc? | **No** |
| Need edits before start? | **Yes — clarifications in §3 only** |
| Blockers to Stage A? | **No** — clarifications can land as you start |

**Ship Stage A. Everything else waits.**
