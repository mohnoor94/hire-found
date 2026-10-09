# HireFound ultimate strategy — cut over, delete, redesign the skin

**Document:** `rebuild/ultimate.md`  
**Date:** 2026-10-09  
**Status:** Canonical after comparing `opinion01–03` and meta-syntheses `all01–03`  
**Source of truth for phases:** `docs/platform-plan.md`  
**Supersedes for strategy:** use this file; keep prior opinions as audit trail

---

## Tattoo verdict

**Ship the cutover, delete the dual world, then redesign the skin hard — never the engine, never mid-migration.**

| Reject | Adopt |
|--------|--------|
| ❌ Naive greenfield (replay Phases 1–6) | ✅ Finish Phase 6 → delete vanilla |
| ❌ Endless parity patching | ✅ Aggressive Phase 7 presentation rebuild |
| ❌ Day-1 vanilla purge / 4-day mega-sprint | ✅ Sequenced surfaces with effort bands |
| ❌ `/jobs/[slug]` + OG in first redesign | ✅ Keep `?id=` until a later explicit decision |

---

## 1. Why this is the ultimate (judging all01 / all02 / all03)

| Criterion (1–10) | all01 | all02 | all03 |
|------------------|------:|------:|------:|
| Strategic correctness | 6 | 9 | **10** |
| Actionability | 7 | 9 | **9** |
| Evidence quality | 5 | **9** | **9** |
| Ambition fit (fresh UI, no second system) | 8 | 7 | **9** |
| Plan fidelity (Phase 6→7, export, `?id=`) | 4 | **10** | **10** |
| Completeness | 7 | 6 | **10** |
| Clarity / signal-to-noise | 5 | **9** | 8 |
| **Total / 70** | **42** | **59** | **65** |

**Winner among metas: `all03`.** Best overall spine, matrix, hazards, and Stage A–E plan.

**What this ultimate still takes from the others:**

| From | Absorb |
|------|--------|
| **all02** | Opening one-liner discipline; verified file refs; unresolved honesty; standing rule “no redesign on two trees” |
| **all01** | Surface acceptance criteria (hero CTA *behaviors*, Trust content, Yasmin `N` shortcut, booking Escape/focus); named CSS/file kill gates; a11y numeric checks |
| **all03** | Comparison rulings, product bets, anti-goals, efforted stages, greenfield reconsideration bar |

**What this ultimate still rejects from all01:** pre-locked linen/bordeaux/gold before cutover; “Next 15”; Zod+RHF as must; slug/SEO in first redesign; Day-1 vanilla delete; 4-day blitz.

---

## 2. Consensus — just do these

### Keep (non-negotiable)

- `src/lib/jobs/*`, slug engine, filters, validation, admin CRUD  
- 189 Vitest tests / domain suite  
- Firestore `jobs` contract + `firestore.rules`  
- Auth allowlist ↔ `isAdmin()` sync test  
- `src/lib/yasmin/editor-html.ts` (Quill → Tiptap forever)  
- Arabic RTL  
- Next 16 + React 19 + Tailwind v4 + shadcn + static export → GH Pages `out/`  
- Job detail URL: `/jobs/?id={slug}` until Stage E  

### Never

- Greenfield platform / domain rewrite  
- Dual-maintain vanilla while redesigning Next  
- Rename Firestore fields / drop Quill compat  
- Reopen host/CMS/middleware as Phase 7 defaults  
- Treat build-time `generateStaticParams` as full request-time SSR SEO  

### Eventually (after cutover)

- Delete vanilla tree  
- One token system; kill multi-CSS ownership  
- Kill imperative DOM bridges; rebuild homepage shell  
- Redesign jobs + Yasmin chrome  
- End parity-as-quality-bar  

---

## 3. Disagreements — final rulings

| Fight | Ruling |
|-------|--------|
| Cutover vs redesign first | **Cutover first.** Dual-tree redesign recreates the tedium. |
| How hard is Phase 7? | **Hard skin rebuild** (01 ambition + 03 framing), not timid polish. |
| Delete vanilla when? | **After smoke only.** |
| Timeline | Cutover ~2–4 calendar days; redesign ~2–4 weeks — not 4 days end-to-end. |
| `/jobs/[slug]` + OG + JSON-LD | **Stage E.** Static export: new jobs need rebuild for new slug HTML. |
| Brand lock | **One decision-log line at Stage C** — soft candidates OK, no pre-lock. |
| Zod + RHF editor | **Optional Stage E**, not a Phase 7 must. |

**One-line from the opinions:**  
**01 named the UI corpses. 02 named the first move. 03 named the rebuild shape.**

---

## 4. Verified evidence (2026-10-09)

### Platform / dual-stack (locks cutover-first)

- `docs/platform-plan.md` — Phase 6 in progress; `main` serves vanilla; Phase 7 after parity  
- `package.json` — next 16.4.0, react 19.3.0, firebase ^11.10, Tiptap 3, Tailwind 4, Vitest 4  
- `index.html` + `js/tailwind-config.js` — CDN Tailwind + global `tailwind.config` side effect  
- `js/firebase-config.js` — CDN Firebase 11.8.1 vs npm ^11.10 drift  
- `eslint.config.mjs` — legacy trees ignored by lint  
- `next.config.ts` — `output: 'export'` (no request-time RSC Firestore)  
- `firestore.rules` — `isAdmin()` allowlist (keep in sync with UI)  
- Plan lock: `?id=` so new jobs work without rebuild  

### In-Next debt (Phase 7 kill-list — confirmed)

| Corpse | Where |
|--------|--------|
| `getElementById` + `setTimeout` typing | `src/components/site/hero-effects.tsx` |
| `MutationObserver(document.body)` | `micro-interactions.tsx`, `scroll-reveals.tsx` |
| Document click DOM mutation | `services-effects.tsx` |
| `cursor: none !important` | `hirefound.css` + `custom-cursor.tsx` |
| `setInterval` iframe poll | `booking-modal.tsx` |
| Trust section `hidden` | `sections/Trust.tsx` |
| Fake WhatsApp hero | `Hero.tsx` (`wa-chat-window`, typing dots) |
| Radix Dialog already installed | `src/components/ui/dialog.tsx` |

### Why fixes feel tedious (merged)

Dual tree + parity bar + DOM bridges + CSS token collisions + deploy mismatch (Next ready, live still vanilla) + monoliths (`job-editor` ~726, `booking-modal` ~396).  
**Not** “wrong stack.”

### Path economics

| Path | Cost to DONE | Risk | UX | Maintain | Morale |
|------|--------------|------|----|----------|--------|
| Scratch rebuild | Highest | Highest | Late | OK later | Demoralizing |
| Incremental vanilla | Cheap today / expensive forever | Drift | ~None | Worst | Grinding |
| **Cutover + Phase 7 skin** | **Best** | **Lowest net** | **Full after D** | **Best** | **Shipping** |

---

## 5. Rebuild / Redesign / Keep

| Area | Verdict | Notes |
|------|---------|-------|
| Design tokens / CSS ownership | **Rebuild** | One `@theme`; end `hirefound.css` / `yasmin.css` as owners |
| Homepage composition | **Rebuild shell** | Brand-first fold; kill WhatsApp/effects/cursor; unhide Trust |
| Nav / footer / booking | **Rebuild** | Booking → existing Radix Dialog; no iframe poll |
| Jobs list/detail | **Redesign-in-place** | Scan/filter/detail; one apply CTA; keep `?id=` + `src/lib/jobs` |
| Yasmin dashboard + editor chrome | **Redesign-in-place** | Density; ~2 min publish; keep auth + Tiptap + `editor-html` |
| Routing / SEO / hosting | **Keep** | Until Stage E decision |
| Domain / Firestore / tests | **Keep** | Non-negotiable |

---

## 6. What “fresh” means (product bets)

1. **Yasmin-as-operator** — typical role publishable in under ~2 minutes; shortcut `N` for new draft.  
2. **MENA/Gulf job board** — bilingual/RTL native.  
3. **One dominant apply CTA** — Book a Call secondary.  
4. **Brand-first first viewport** — HireFound/Yasmin owns the fold; vacancies as proof.  
5. **Motion as presence** — 2–3 intentional motions; no cursor/observer theater.  
6. **Admin density** — search + status + shortcuts over sparkles/cards.  
7. **Trust visible** — press/social proof unhidden and modernized.  
8. **Declarative React** — zero `getElementById` / `MutationObserver` / `cursor: none !important` in site effects.

### Soft brand candidates (pick at Stage C — do not pre-lock)

Warm linen / burgundy `#7A1E4A` / warm gold / editorial serif (DM Serif or Playfair) + clean sans + Noto Sans Arabic. Record one decision-log line: brand signal, motion budget, admin density rule.

### Anti-goals

No Firestore renames; no allowlist model rewrite; no `?id=` change in first Phase 7; no Quill-compat drop; no domain-suite rewrite; no dual vanilla; no full moodboard lock before cutover.

---

## 7. Execution plan (Stages A–E)

**Standing rule:** Do not start redesign work that assumes two trees.

### Stage A — Finish Phase 6 (~2–4 calendar days; must)

1. Pages source → **GitHub Actions** (leave `legacy` from `main /`).  
2. Apex/`www` `hirefound.com` DNS → Pages (leave Squarespace parking).  
3. Merge `v2` → `main`; deploy builds Next, uploads `out/` only.  
4. Confirm rules deployed; `isAdmin()` ↔ `ALLOWED_EMAILS`.  
5. Smoke: homepage vacancies; `/jobs/?id=` + one apply path; Yasmin login/CRUD → public HTML.  
6. Resume deferred `agy` (firestore-rules, gh-pages-export, phase-6-gate); mark Phase 6 done only after dual review.  

Optional: enable draft CI; allowlist single-source if non-blocking.

### Stage B — Delete vanilla (~1 day after smoke; must)

Delete as product: root `index.html`, `jobs/`, vanilla `yasmin/`, `js/`, legacy `css/`, root runtime assets.  
Drop dead eslint ignores + vanilla test includes once Next suite trusted.  
**Grep zero:** `cdn.tailwindcss.com`, CDN Firebase pins, `tailwind.config =`.  
Keep `.kiro/specs/` + short archive note in `platform-plan.md`.

### Stage C — Phase 7 kickoff (~half day)

1. One decision-log visual direction.  
2. Dual review per surface via `docs/ui-ux-review-prompt.md`.  
3. Working rule: swap components/CSS; leave `src/lib/**`, Firebase init, schema, domain tests, static export alone unless a tiny display helper is required.

### Stage D — Redesign surfaces (~2–4 weeks; highest “feels new” first)

| # | Surface | Effort | Must ship |
|---|---------|--------|-----------|
| 1 | Tokens + shared chrome | 3–5d | One token owner; booking → Radix Dialog (Escape, focus trap, no `setInterval`); delete cursor CSS ownership |
| 2 | Homepage composition | 4–7d | Dual CTAs: hiring consultation vs explore roles; kill WhatsApp hero + all four `*-effects` + `custom-cursor`; unhide Trust (TEDx / Leaders of Arabia / testimonials); 2–3 motions; delete `hirefound.css` as owner |
| 3 | Jobs list/detail | 3–5d | Category/location scan; bilingual cards; one dominant apply; **keep `?id=`** |
| 4 | Yasmin dashboard | 2–4d | Density; filters; status; `N` new draft; less sparkle |
| 5 | Yasmin editor chrome | 3–5d | Layout, Tiptap toolbar, RTL, toasts; keep `editor-html`; split ~726 LOC monolith as you go; delete `yasmin.css` as owner |

Parallel: unify allowlists + sync test.

### Stage E — Optional later (new decisions)

- `/jobs/[slug]` via build-time `generateStaticParams` + rebuild-on-publish **or** host change  
- OG + `JobPosting` JSON-LD (tied to slug strategy)  
- Zod + React Hook Form  
- SSR/ISR host if SEO/TTFB proven  
- CI PR checks if not done in A  
- Functions / Storage / hosted CMS — out of locked scope  

---

## 8. Verification gates

### Every Stage D surface

- [ ] `npm test` green (domain suite)  
- [ ] `npm run build` → clean `out/`  
- [ ] Dual Cursor + `agy` recorded for that surface  

### End of Phase 7

- [ ] Quill HTML round-trip intact in Tiptap  
- [ ] Allowlist set-equality test passes  
- [ ] Zero `MutationObserver` / `document.getElementById` / iframe `setInterval` poll in site components  
- [ ] Native cursor restored; keyboard nav; ≥44×44 touch targets  
- [ ] Optional: Lighthouse ≥95 mobile/desktop once chrome is quiet  

---

## 9. Success criteria

1. Vanilla retired as UX + deploy truth; no parity lock.  
2. One token system; no stylesheet collision tax.  
3. First viewport brand-first; WhatsApp theater + custom cursor gone; Trust visible.  
4. Site UI is declarative React.  
5. Yasmin operator-grade (~2 min publish).  
6. Domain tests green; Firestore/auth/Quill contracts untouched.  
7. Phase 7 *is* the rebuild — no follow-on rewrite.

**Reconsider greenfield only if** after A–D the Next tree is still structurally unworkable or data/auth/editor is proven wrong — not because cutover felt tedious.

---

## 10. Risks

| Risk | Mitigation |
|------|------------|
| DNS/Pages slip | Stage A calendar-critical; no Stage D on dual trees |
| Phase 7 scope creep | Anti-goals; 3-route boundary; surface gates |
| Quill regressions | Keep `editor-html`; smoke public HTML after edits |
| Allowlist drift | Single source + sync test; deploy rules with UI changes |
| URL/host ambition mid-redesign | Stage E only |
| “Just start over” urge | Engine is paid for; skin is the rebuild |
| Timid Phase 7 | Kill-list in §4 must actually die |
| Overclaiming slug SEO | Export = build-time only |

---

## 11. Decision-log line (paste into `platform-plan.md` when adopted)

> **2026-10-09** — Canonical rebuild strategy (`rebuild/ultimate.md`): finish Phase 6 cutover and delete vanilla before redesign; Phase 7 is an aggressive presentation rebuild (tokens → homepage → jobs skin → Yasmin density) keeping domain/auth/Firestore/`?id=`/static export; defer `/jobs/[slug]` + OG/JSON-LD to a later explicit decision. Selected after scoring `all01`/`all02`/`all03` (winner spine: all03; absorb all02 evidence discipline + all01 surface kill criteria).

---

## 12. Source map

| File | Role |
|------|------|
| `opinion01.md` | UI/DOM corpses + brand fantasy |
| `opinion02.md` | Cutover-first scoring + dual-stack forensics |
| `opinion03.md` | Cut-then-skin debate + Stage A–E |
| `all01.md` | Ambitious blueprint; weak plan fidelity |
| `all02.md` | Lean correct spine; thin completeness |
| `all03.md` | Best meta-synthesis overall |
| **`ultimate.md`** | **This file — canonical** |
| `docs/platform-plan.md` | Living phase checklist |

---

## Closing

HireFound already bought the engine. The parking brake is vanilla + parity. Release it (cutover + delete), then replace the bodywork (tokens, homepage, jobs, Yasmin) with the kill-list from 01, the sequencing from 02, and the product bets from 03.

**Do Stage A next. Everything else waits.**
