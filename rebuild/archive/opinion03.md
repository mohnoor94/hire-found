# Rebuild vs incremental — debate findings and hybrid plan (opinion03)

**Document:** `rebuild/opinion03.md`  
**Date:** 2026-10-09  
**Question:** Should HireFound be rebuilt from the ground up for nicer system UI/UX, or keep fixing issues incrementally?  
**Method:** Codebase exploration + three adversarial subagents (Advocate A pro-rebuild, Advocate B anti-rebuild, Advocate C hybrid) + judge synthesis.  
**Status source of truth:** `docs/platform-plan.md` (Phase 6 — Cutover, in progress; Phase 7 redesign not started).

---

## 1. Verdict

**Do not greenfield-rebuild the platform. Do not stay on endless parity patches. Finish Phase 6 cutover, delete the vanilla tree, then redesign hard on the single Next spine (aggressive Phase 7).**

The desire for “nicer system UI/UX and fresh things” is real and should be treated as a **presentation rebuild**, not a **platform rewrite**. Feeling that incremental fixes are tedious is mostly **mid-migration + parity constraint**, not proof that Next / Firebase / shadcn / the job domain were the wrong bet.

```
     ❌ Full greenfield                    ⭐ Cut, then skin                 ❌ Whack-a-mole forever
  (Replay Phases 1–6)                    (This opinion's path)            (Parity patches only)
 ┌──────────────────────────┐          ┌──────────────────────────┐      ┌──────────────────────────┐
 │ New UI + new fear about  │          │ Finish cutover           │      │ Dual tree stays forever  │
 │ auth / HTML / rules      │    ──►   │ Delete vanilla           │ ◄──  │ Inter locked for parity  │
 │ Dual-state again under a │          │ Rebuild tokens + surfaces│      │ Phase 7 never starts     │
 │ new folder name          │          │ Keep lib / data / tests  │      │ Tedium never ends        │
 └──────────────────────────┘          └──────────────────────────┘      └──────────────────────────┘
```

Related docs in this folder: `opinion01.md` (smart rebuild / DOM anti-patterns), `opinion02.md` (hybrid-strangler scoring). This file is the debate transcript + sequenced execution plan from the 2026-10-09 “ultrathink” pass.

---

## 2. Codebase findings (audit snapshot)

### Product

HireFound is a MENA recruitment / executive-search marketing site plus a private job CMS (“Yasmin Space”).

| Audience | Surfaces | Capabilities |
|----------|----------|--------------|
| Public | `/`, `/jobs/` | Brand homepage, browse/filter jobs, detail via `?id={slug}`, apply (Tally / WhatsApp / email / Cal.com) |
| Admin | `/yasmin/` | Google sign-in + email allowlist, job CRUD, Tiptap EN/AR descriptions, active toggle, shortcuts |

### Stack (locked — do not reopen for “fresh”)

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.4 App Router, React 19.3, TypeScript |
| Rendering | Static export (`output: 'export'`, `trailingSlash`, unoptimized images) |
| UI | Tailwind CSS 4 + shadcn/ui (radix-nova) + Sonner |
| Editor | Tiptap 3 (replaces Quill 2 in Next; vanilla still Quill) |
| Backend | Firebase Auth + Firestore client SDK only |
| Hosting target | GitHub Pages → `out/`, CNAME `hirefound.com` |
| Tests | Vitest 4 + jsdom + fast-check |

### Architecture

- Thin App Router pages, fat clients (~27 `"use client"` modules).
- Only **3 routes**: `/`, `/jobs/`, `/yasmin/`.
- Job detail contract: `/jobs/?id={slug}` so new posts work without rebuild.
- Auth: Google popup + client allowlist (`src/lib/yasmin/auth.ts`) synced with `firestore.rules` `isAdmin()`.

### Size and dual tree

| Tree | Approx LOC | Status |
|------|------------|--------|
| Next (`src/`) | ~10,040 / ~79 files | Active work on `v2` |
| Vanilla (`index.html`, `js/`, `jobs/`, `yasmin/`, `css/`) | ~7,800 | Still live on `main` / Pages legacy |
| Tests | 189 passing / 24 files | Strong on job domain + Yasmin auth/HTML |

`v2` was ~35 commits ahead of `main` at audit time. Live: vanilla on `mohnoor94.github.io/hire-found/`. Apex `hirefound.com` still Squarespace parking until DNS + Pages Actions cutover.

### Phase trajectory

| Phase | Focus | Status |
|-------|--------|--------|
| 1 | Foundation (Next, Tailwind, shadcn, Firebase, Vitest, export) | done |
| 2 | Shared job domain + ported tests | done |
| 3 | Public homepage parity | done |
| 4 | Jobs list/detail/apply parity | done |
| 5 | Yasmin parity (Auth, CRUD, Tiptap vs Quill) | done |
| 6 | Cutover (rules, deploy `out/`, smoke, DNS) | **in progress** |
| 7 | Visual redesign (dual Cursor + `agy` per surface) | **not started** |

Plan decision (2026-10-06): migration matches current behavior first; visual redesign is Phase 7 after parity.

### Code health / pain (why fixes feel tedious)

1. **Two full sites in one repo** until cutover — mental model + duplicated allowlist/Firebase config.
2. **Parity-first policy** — every UI tweak risks “differs from live vanilla”; redesign blocked until smoke.
3. **CSS layering + token overwrite** — `globals.css` (Tailwind/shadcn) + `hirefound.css` + `yasmin.css`; brand utilities can lose to shadcn `@theme` remaps.
4. **Query-string job detail** on static host — share/SEO/boilerplate vs path routes (locked for cutover).
5. **Editor dual stack until cutover** — Quill in vanilla vs Tiptap in `src/`; Quill HTML must keep rendering forever (`src/lib/yasmin/editor-html.ts`).
6. **Monolithic clients** — e.g. `job-editor.tsx` (~726 LOC), `booking-modal.tsx` (~396 LOC).
7. **Deploy/hosting mismatch** — workflow ready on `v2`; Pages still legacy from `main`; merge alone ≠ domain cutover.
8. **Review-gate overhead** — dual Cursor + `agy`; Phase 6 `agy` deferred.

### Coupling: keep vs rebuild-friendly

**Hardest / keep:** Firestore `jobs` data contract; static-export constraints; auth allowlist ↔ rules sync; Quill HTML round-trip; public marketing behavior contracts until cutover.

**Easiest / reuse in any redesign:** `src/lib/jobs/*` (typed, tested); `use-admin-auth`; shadcn `src/components/ui/*`; thin route shells; Firebase project + assets/CNAME.

---

## 3. Subagent debate

### Advocate A — Rebuild now (thesis)

> HireFound should stop finishing a fidelity clone of a vanilla site and instead cut over on the clean domain core, then rebuild the UI and app shell greenfield—because Phase 7 on top of a parity port will only polish a product already shaped by the old tree’s constraints.

**Strongest points**

1. Dual-tree tax with nothing left to learn from the old UI.
2. Phase 6 is the last cheap moment to change direction (production still vanilla).
3. Parity-first design capped the UX ceiling on purpose (Inter lock, CSS skins).
4. Remaining pain is structural (query URLs, Quill forever, monoliths) — restyling won’t lift ceilings.
5. Opportunity cost of shipping “new stack, old product.”
6. Only three routes — UI rewrite is tractable.
7. Yasmin will never feel like a dashboard if it stays a port.
8. Plan already admits redesign — clone-then-redesign doubles UI work.

**A’s KEEP list (even in rebuild):** Firestore schema; `src/lib/jobs/*` + tests; Firebase Auth patterns; App Router + React 19 + shadcn as platform. Wipe UI/shell, not domain.

**A’s success criteria:** vanilla retired as UX source of truth; path-based jobs (A wants this); Yasmin modular; one token system; domain tests green; Phase 7 isn’t a second rewrite.

### Advocate B — Do not rebuild (thesis)

> Finish the cutover and redesign the surface you already own — a greenfield rebuild would trade a nearly-shipped migration for a second, longer migration with the same product and weaker guarantees.

**Strongest points**

1. Phases 1–5 done; Phase 6 mid-flight — killing `src/` abandons a shipping lead.
2. Progress frame, not sunk-cost: ~10k LOC, 189 tests, Auth + rules + Tiptap already paid for.
3. Second-system effect: “fresh” is Phase 7’s brief; rebuild rediscovers Quill/auth/allowlists the hard way.
4. Pain is dual trees, not target architecture — rebuild recreates dual-state as old Next vs new greenfield.
5. Three-route surface makes rewrite disproportionate.
6. Contracts (`jobs` libs, auth, rules, editor HTML) are the hard part — rebuild re-risks them.
7. Test suite is a shipping asset; greenfield resets confidence.
8. Opportunity cost is another 6-phase project while production stays on vanilla.

**B’s diagnosis of tedium:** mid-migration + parity constraint. After cutover (delete vanilla) + Phase 7, the itch goes away without burning `src/`.

**B’s rebuild bar (narrow):** cutover complete AND single Next tree still structurally unworkable AND core contracts proven wrong AND Phase 7 cannot deliver UX without replacing substrate. Feeling tired mid-Phase-6 does not meet this bar.

### Advocate C — Hybrid “cut, then skin” (thesis)

> Finish the single Next tree in production, delete the dual-maintenance tax, then redesign only the presentation layer (tokens + surface components) on top of the already-proven jobs/auth/Firestore/tests spine—never restart the platform.

**Decision matrix (C)**

| Area | Verdict | Rationale |
|------|---------|-----------|
| Homepage | **Rebuild (UI shell)** | Marketing composition is the product face; parity port preserved old clutter/motion. Keep vacancy data hook. |
| Jobs UX | **Redesign-in-place** | Domain behavior correct; skin list/detail/states. |
| Yasmin | **Redesign-in-place** | Auth/CRUD/Tiptap paid for; fresh = layout, density, feedback. |
| Design tokens | **Rebuild** | Highest-leverage single change; end vanilla parity palette lock. |
| Routing / SEO | **Keep** (for Phase 7) | Don’t change `?id=` mid-fresh pass. |
| Hosting | **Keep** | GH Pages + `out/` just finished expensive migration. |

**C’s product-specific “fresh” bets**

1. Yasmin-as-operator — publish a role in under ~2 minutes.
2. Jobs as MENA/Gulf scanning board — bilingual/RTL native, not bolted on.
3. Apply-path clarity — one dominant apply CTA; Book a Call secondary.
4. Brand-first public first viewport — HireFound/Yasmin owns the fold; vacancies as proof, not widget farm.
5. Motion as presence — cut custom cursor / scatter effects; keep 2–3 intentional motions.
6. Admin density for a solo recruiter — search + status + shortcuts over decorative cards.

**C’s anti-goals:** Firestore field names / expiry semantics; Auth allowlist model; `?id=` + static export; Tiptap HTML contract including Quill helpers; rewriting the 189-test suite; reopening Next server/middleware/API or hosted CMS; dual-maintaining vanilla while redesigning.

---

## 4. Judge synthesis

| Claim | Winner | Why |
|-------|--------|-----|
| Is the platform the wrong stack? | **No (B)** | Stack is current; pain is dual-state + parity. |
| Is “just patch forever” viable? | **No (A+C)** | Parity port is not the product destination. |
| Is greenfield justified now? | **No (B+C)** | Replays Phases 1–6; recreates dual maintenance. |
| Should UI feel rebuilt? | **Yes (A+C)** | Tokens + homepage shell + Yasmin density must be decisive, not timid polish. |
| Sequencing | **C** | Cutover → delete vanilla → redesign surfaces. |
| Path-based `/jobs/[slug]` now? | **Defer (B+C over A)** | Locked for cutover; optional later with host/prebuild decision. |

**Final call:** Adopt Advocate C. Absorb Advocate A’s ambition on **presentation** (tokens, homepage composition, Yasmin as product). Absorb Advocate B’s constraints on **platform and data**. Treat Phase 7 as the rebuild the user actually wants — not a second platform migration.

---

## 5. What “rebuild” means in this plan

| In scope | Out of scope |
|----------|--------------|
| New public and Yasmin layouts / composition | New backend, CMS, or host change |
| One design token system; retire CSS skins | Renaming Firestore fields |
| Split / modularize large clients as UI work | Rewriting `src/lib/jobs` domain from scratch |
| Quieter motion; brand-first marketing | Changing `?id=` during the first redesign pass |
| Delete vanilla after smoke | Dropping Quill HTML compatibility |
| Phase 7 dual review per surface | Infinite redesign without ship gates |

**Boundary rule:** If a change doesn’t improve how users find jobs, trust the brand, or operate Yasmin — and isn’t required to end dual-tree/CSS debt — it waits.

---

## 6. Sequenced execution plan

Effort assumes solo founder + AI. Calendar days for DNS; engineering days for code.

### Stage A — Finish Phase 6 (must; ~2–4 days calendar)

1. Set GitHub Pages source to **GitHub Actions** (repo still legacy from `main /` per decision log).
2. Point apex/`www` `hirefound.com` DNS at Pages (leave Squarespace parking).
3. Merge `v2` → `main` so `.github/workflows/deploy.yml` builds Next and uploads `out/` only.
4. Confirm Firestore rules deployed; `isAdmin()` ↔ `ALLOWED_EMAILS` match.
5. Smoke:
   - Homepage vacancies load
   - Open job via `?id=` + an apply path
   - Yasmin sign-in, create, edit; public page shows saved HTML
6. Resume deferred `agy` reviews (high-risk firestore-rules, gh-pages-export, phase-6-gate) before marking Phase 6 `done`.

**Do not start redesign work that assumes two trees.**

### Stage B — Delete / stop maintaining (~1 day)

After smokes pass:

| Stop | Why |
|------|-----|
| Root `index.html`, `jobs/`, vanilla `yasmin/`, `js/`, legacy `css/`, root runtime `assets/` as product | Dual tree is the whack-a-mole |
| Vanilla Vitest includes once Next coverage is trusted | One suite, not two eras |
| ESLint ignores for deleted trees | Gone with the tree |
| Parity-as-feature work | Matching vanilla is complete |
| Quill / CDN Tailwind as mental model | Already replaced in Next |

Keep `.kiro/specs/` and a short archive note in `platform-plan.md` as history only.

Grep should return **zero** hits for: `cdn.tailwindcss.com`, CDN Firebase ESM pins, `tailwind.config =` global side-effects in remaining product code.

### Stage C — Phase 7 kickoff (~half day)

1. Pick visual direction; record one decision-log line (brand signal, motion budget, admin density rule).
2. Use `docs/ui-ux-review-prompt.md`; dual Cursor then `agy` per surface before marking done.
3. Rule for all Stage D work: **swap components and CSS; leave `src/lib/**`, Firebase init, Firestore schema, Vitest domain tests, and static-export hosting alone** unless a tiny display helper is required.

### Stage D — Redesign surfaces (~2–4 weeks)

Order for maximum “it feels new” per day:

| # | Surface | Effort | Notes |
|---|---------|--------|-------|
| 1 | Design tokens + shared chrome (nav, footer, booking modal) | 3–5 days | One pass recolors/rehierarchizes public site |
| 2 | Homepage — rebuild section composition in `src/components/site/**` | 4–7 days | Keep `fetchJobs` / live vacancies wiring |
| 3 | Jobs list + detail — redesign scan/filter/detail layout | 3–5 days | Keep `?id=`, apply order (Tally → WA → email → Cal) |
| 4 | Yasmin dashboard density | 2–4 days | List, filters, status, shortcuts |
| 5 | Yasmin editor chrome | 3–5 days | Form layout, Tiptap toolbar, RTL, confirms/toasts; keep HTML contract |

**Parallel cleanup during Stage D (surgical):**

- Unify CSS tokens; kill layering collisions once there is one stylesheet owner.
- Split `job-editor` / other monoliths into focused modules as you redesign those surfaces.
- Consolidate allowlists to one source of truth + keep the sync test.

### Stage E — Optional later (not Phase 7)

- Pretty paths `/jobs/[slug]` (needs prebuild strategy or host change — new decision).
- Enable CI PR checks (`.github/workflows/ci.yml` drafted; deferred nice-to-have).
- SSR/ISR host (Vercel/Cloudflare) only if client Firestore SEO/TTFB becomes a real problem.
- Cloud Functions / Storage / hosted CMS — out of locked scope.

---

## 7. Success criteria

The hybrid path succeeded if:

1. **Vanilla is retired** as UX and deploy source of truth — no dual CSS skins, no parity Inter lock, no “match old Yasmin” as the default quality bar.
2. **One design/token system** — no `globals` + `hirefound` + `yasmin` collision tax.
3. **Public first viewport** reads as HireFound/Yasmin brand-first; motion is intentional, not a demo reel.
4. **Yasmin feels like an operator product** — denser list/edit; publish path measurable (target: under ~2 minutes for a typical role).
5. **Domain tests still green; Firestore contract untouched.**
6. **Phase 7 is the rebuild** — visual quality ships once, not as a follow-on rewrite after a clone cutover.

Greenfield would only be reconsidered if, **after** Stages A–D, the Next app is still structurally unworkable or the data/editor/auth model itself is proven wrong — not because cutover felt tedious.

---

## 8. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Cutover DNS/Pages slip | Treat Stage A as calendar-critical; don’t start Stage D on dual trees |
| Scope creep in Phase 7 | Anti-goals list; three-route boundary; ship surface-by-surface with dual review |
| Quill HTML regressions | Keep `editor-html` helpers; smoke public HTML after Yasmin edits |
| Allowlist drift | Single source + existing sync test; deploy rules with UI changes |
| Ambition to change URLs/host mid-redesign | Defer to Stage E; record as new decision if pursued |
| Motivational urge to “just start over” | Re-read §§3–4: platform is paid for; presentation is the rebuild |

---

## 9. Closing

HireFound already did the hard engineering: Next 16, React 19, Firebase contract, tested job domain, Yasmin parity. Standing in the doorway of cutover with vanilla still alive, parity still binding, and Phase 7 not started is uncomfortable — and that discomfort is easy to misread as a mandate to burn the house down.

**Ship the cutover. Delete the dual world. Redesign tokens and the five surfaces users actually see.** That is how you get nicer system UI/UX without paying for a second migration.

---

## Appendix — Quick numbers (audit day)

| Metric | Value |
|--------|-------|
| Next `src/` LOC | ~10,040 / ~79 files |
| Vanilla LOC | ~7,800 |
| Routes | 3 (`/`, `/jobs/`, `/yasmin/`) |
| Tests | 189 passing / 24 files |
| `v2` vs `main` | ~35 commits ahead (at audit) |
| Phase | 6 cutover in progress → 7 redesign |
| shadcn UI primitives | 7 under `src/components/ui/` |
| Largest clients | `job-editor.tsx` ~726, `hirefound.css` ~533, `booking-modal.tsx` ~396 |
