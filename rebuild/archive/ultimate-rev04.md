# HireFound Ultimate Strategy (Revision 04) — The Unified Production Masterpiece

**Document:** `rebuild/ultimate-rev04.md`  
**Date:** October 9, 2026  
**Status:** Canonical, Fully Reconciled & Execution-Ready  
**Synthesizes:** `ultimate.md`, `ultimate-rev.01.md`, `ultimate-rev-02.md`, and `ultimate-rev-03.md`  
**Living Plan Source of Truth:** `docs/platform-plan.md`  
**Supersedes:** All previous strategy, opinion, and revision documents  

---

## The Tattoo Verdict

**Ship the cutover, delete the dual world, then redesign the skin hard — never the engine, never mid-migration.**

```
                                    THE DEFINITIVE REBUILD SPINE
                                    
     ❌ Naive Full Greenfield              ⭐ THE UNIFIED REV-04 PATH             ❌ Incremental Parity
  (Replaying Phases 1–5 from scratch)         (Consensus Across All Revs)        (Whack-a-mole on dual trees)
 ┌────────────────────────────────┐        ┌────────────────────────────────┐    ┌────────────────────────────────┐
 │ • Rewrites 189 passing tests   │        │ 1. Preflight on v2             │    │ • Keeps MutationObservers      │
 │ • Re-risks Firestore rules     │ ────►  │ 2. Safe merge to main & deploy │◄── │ • Keeps hirefound.css          │
 │ • Drops Quill HTML sanitizer   │        │ 3. Switch Pages to Actions     │    │ • Keeps fake WhatsApp hero     │
 │ • Recreates dual-state bugs    │        │ 4. Delete vanilla + root assets│    │ • Parity locks Inter & skins   │
 │ • Weeks of unnecessary delay   │        │ 5. Aggressive Phase 7 redesign │    │ • Tedium never ends            │
 └────────────────────────────────┘        └────────────────────────────────┘    └────────────────────────────────┘
```

---

## 1. What Revisions 01, 02, and 03 Unanimously Agree On

Across all three revision passes, there is **100% consensus** on the architecture, the targets, and the boundaries:

1. **The Strategy is Solid:** No greenfield platform rewrite. The Next 16.4 + React 19 + Firebase client SDK + Tiptap + Tailwind v4 + Vitest engine is fully paid for and verified.
2. **The "Rebuild" Means a Presentation Rebuild:** Rebuilding the design system tokens and the 5 visible surfaces, not the backend or data contract.
3. **The Corpses Must Die:** Eliminate the 4 imperative DOM side-effect bridge files (`hero-effects.tsx`, `micro-interactions.tsx`, `scroll-reveals.tsx`, `services-effects.tsx`), the custom cursor hack, the fake WhatsApp chat simulator, the 40x `setInterval` iframe polling in `booking-modal.tsx`, and the 1,500 lines of legacy CSS.
4. **The Safe Order of Operations:**
   - **Stage A:** Preflight → Merge `v2` to `main` → Green Actions build → Switch Pages source to Actions → DNS in parallel → Live smoke.
   - **Stage B:** Purge legacy vanilla tree (+ root `assets/` only, protecting `public/assets/`).
   - **Stage C:** Phase 7 kickoff (record brand direction in decision log).
   - **Stage D:** Redesign surfaces in order of highest impact: Tokens & Chrome → Homepage → Jobs Board → Yasmin CMS.
   - **Stage E:** Optional later items (pretty path slugs, SSR host, Zod+RHF) evaluated as separate decisions.

---

## 2. The 7 Critical Reconciliations Merged into Rev 04

| # | Topic | What Rev 01/02/03 Caught | Rev 04 Unified Resolution |
|---|---|---|---|
| **1** | **Deployment Order** | `rev-02` caught that `.github/workflows/deploy.yml` triggers on push to `main` only. Flipping Pages to Actions *before* merging leaves Pages dark. | **Merge first:** 1. `npm test && npm run build` on `v2` → 2. Merge `v2` → `main` → 3. Watch Actions run go green → 4. Switch Pages source to Actions. |
| **2** | **Asset Protection** | `rev-02` & `rev-03` caught that Next.js serves `/assets/...` from `public/assets/`, while root `assets/` is a legacy duplicate. | **Scoped deletion:** Delete root `assets/` only. **Never delete `public/assets/`** or `public/CNAME`. |
| **3** | **Test Re-baseline** | `rev-02` caught that deleting vanilla in Stage B drops `__tests__` and `yasmin/__tests__`, lowering the total test count from 189. | Record pre-delete baseline, delete legacy suites, and **re-baseline the pure `src/` Vitest suite** as the permanent gate. |
| **4** | **Deferred `agy` Reviews** | `rev.01` & `rev-03` addressed the Phase 6 reviews deferred on 2026-10-07. | **Officially Approved by `agy`:** Firestore rules sync (**PASS**), Pages deploy workflow (**PASS**), Phase 6 gate (**APPROVED**). |
| **5** | **Zero-FOUC CSS Transition** | `rev.01` caught that deleting `hirefound.css` prematurely in Stage D breaks shared classes (`.filter-pill`, `.nav-glass`). | Extract core utilities into Tailwind v4 `@utility` directives in `globals.css` *before* dropping `hirefound.css`. |
| **6** | **Cal.com Radix Dialog Spec** | `rev.01` detailed the replacement for the 397-line `booking-modal.tsx`. | Replaced with clean `<CalDialog>`: Radix Dialog focus trap, brand color `#7A1E4A`, and native `onLoad` handling (zero `setInterval` polling). |
| **7** | **DNS & Trust Soft-Checks** | `rev.01` decoupled external DNS from code cleanup; `rev-03` noted checking Trust visibility with Yasmin. | DNS propagates in parallel without blocking development; Trust section modernized with a soft confirmation before unhiding. |

---

## 3. The Unbreakable Keep / Never / Kill Rules

### Keep (Non-Negotiable Production Core)
* `src/lib/jobs/*` (slug engine, filters, validation, fetch, admin CRUD).
* Firestore `jobs` schema contract and `firestore.rules`.
* Firebase Auth allowlist ↔ `isAdmin()` set-equality automated test.
* `src/lib/yasmin/editor-html.ts` (Quill 2 list normalization & Tiptap round-trip HTML protection).
* Bilingual Arabic RTL text handling (`dir="rtl"`, `lang="ar"`).
* Next 16.4 + React 19.3 + Tailwind v4 + shadcn + static export (`output: 'export'`) to GitHub Pages `out/`.
* `public/assets/` and `public/CNAME`.
* Job detail URL contract: `/jobs/?id={slug}` (preserves static hosting without rebuilds on new jobs).

### Never Do
* Greenfield platform / domain rewrite (replaying Phases 1–5).
* Dual-maintaining vanilla while redesigning Next.js.
* Deleting `public/assets/` when deleting root assets.
* Renaming Firestore fields or dropping Quill HTML compatibility.
* Reopening host/CMS/middleware as Phase 7 defaults.
* Treating build-time `generateStaticParams` as request-time SSR SEO without an SSR host.

### Kill-List (The Phase 7 Casualties — Confirmed in Code)
* `src/components/site/hero-effects.tsx` (`document.getElementById` & `setTimeout` typing loop).
* `src/components/site/micro-interactions.tsx` & `scroll-reveals.tsx` (`MutationObserver(document.body)`).
* `src/components/site/services-effects.tsx` (document click listeners & inline style mutations).
* `src/components/site/custom-cursor.tsx` & `hirefound.css` (`body:has(.custom-cursor.active) * { cursor: none !important; }`).
* `src/components/site/booking-modal.tsx` (40x `setInterval` iframe polling hack).
* `src/components/site/sections/Hero.tsx` (simulated WhatsApp chat window with fake typing dots).
* `src/app/hirefound.css` (534 lines) and `src/app/yasmin/yasmin.css` (239 lines).

---

## 4. Master Execution Roadmap (Stages A through E)

```mermaid
flowchart TD
    subgraph Stage A: Deployment-Safe Cutover
        A1["A1: Preflight on v2 (npm test && npm run build)"] --> A2["A2: Merge v2 → main"]
        A2 --> A3["A3: Confirm Actions Build Goes Green on main"]
        A3 --> A4["A4: Switch Pages Source to GitHub Actions"]
        A4 --> A5["A5: Live Smoke Test on Deployed Export"]
    end

    subgraph Stage B: Purge Legacy World
        B1["B1: Delete Root Legacy (/index.html, /js/, /jobs/, /yasmin/, /css/)"]
        B2["B2: Delete Root assets/ ONLY (Protect public/assets & CNAME)"]
        B3["B3: Drop Dead ESLint Ignores & Re-baseline Vitest Suite"]
    end

    subgraph Stage C: Phase 7 Kickoff
        C1["C1: Record Brand Direction in Decision Log"]
        C2["C2: Establish UI/UX Review Prompt Standard"]
    end

    subgraph Stage D: Redesign Surfaces
        D1["D1: Tokens & Chrome (globals.css, Nav, Footer, Radix CalDialog)"] --> D2["D2: Homepage Composition (Brand-First Fold, Dual CTAs, Modern Trust)"]
        D2 --> D3["D3: Jobs Hub (MENA Scan Board, Bilingual RTL, Tally Apply, keep ?id=)"]
        D3 --> D4["D4: Yasmin CMS Studio (High-Density Recruiter Workspace, <2 min publish)"]
    end

    Stage A --> Stage B --> Stage C --> Stage D
```

---

### Stage A — Deployment-Safe Cutover (~1 Day; Calendar-Critical)

1. **Preflight Verification on `v2`:**
   - Run `npm test` and `npm run build`. Both must pass with zero errors.
2. **Deploy Firestore Rules:**
   - Execute `npm run firebase:deploy-rules` to ensure live rules match `ALLOWED_EMAILS`.
3. **Merge `v2` → `main`:**
   - Merge `v2` into `main`. This places `.github/workflows/deploy.yml` onto `main`.
4. **Watch GitHub Actions Deploy Workflow:**
   - Verify that the workflow runs and succeeds on `main` (compiles Next.js, validates `out/index.html`, `out/jobs/index.html`, `out/yasmin/index.html`, and `out/CNAME`).
5. **Switch GitHub Pages Source:**
   - In GitHub Repository Settings → Pages, switch source from **Deploy from a branch (`main /`)** to **GitHub Actions**.
6. **DNS in Parallel:**
   - Point apex and `www` `hirefound.com` DNS records at GitHub Pages (migrating off Squarespace parking). Does not block code steps.
7. **Live Smoke Tests:**
   - Verify homepage vacancies load from Firestore.
   - Verify job detail opens via `/jobs/?id=<slug>` and application pathways trigger.
   - Verify Yasmin Google sign-in, job creation, editing, and public rendering.
8. **Close Phase 6 Gate:**
   - Mark Phase 6 complete in `docs/platform-plan.md` with dual Cursor and `agy` sign-off.

---

### Stage B — Delete the Dual World (~1 Day after Smoke)

1. **Delete Root Vanilla Files:**
   - Delete `index.html`, `jobs/index.html`, vanilla `yasmin/`, `js/`, legacy `css/`.
2. **Delete Root Assets (Strictly Scoped):**
   - Delete root `assets/` only.
   - **CONFIRM PROTECTED:** Do not touch `public/assets/` or `public/CNAME`.
3. **Clean Configurations & Re-baseline Tests:**
   - Remove dead ESLint `globalIgnores` in `eslint.config.mjs`.
   - Remove legacy test includes in `vitest.config.mjs` (`__tests__/**`, `yasmin/__tests__/**`).
   - Run `npm test` and record the clean, pure `src/` Next.js test count as the new permanent gate.
4. **Zero-Tolerance Grep Check:**
   - Grep must return **zero hits** for `cdn.tailwindcss.com`, `gstatic.com/firebasejs`, and `tailwind.config =`.

---

### Stage C — Phase 7 Kickoff (~Half Day)

1. **Record Brand Direction in Decision Log (`docs/platform-plan.md`):**
   * *Aesthetic:* Boutique Executive Search & Career Advisory Firm (Monocle / Egon Zehnder editorial prestige).
   * *Palette:* Warm Linen (`#FCF9F5`), Deep Bordeaux Burgundy (`#7A1E4A`), Warm Gold (`#D4A574`), Crisp Card Surface (`#FFFFFF`), Charcoal Espresso (`#1F1D1B`).
   * *Typography:* Playfair Display / DM Serif Display for headlines; Inter / Geist for body; Noto Sans Arabic for bilingual harmony.
   * *Motion Budget:* 2–3 intentional physical spring transitions. Zero cursor overrides or decorative scatter effects.
2. **Review Standard:** Use [`docs/ui-ux-review-prompt.md`](file:///Users/noor/Projects/hire-found/docs/ui-ux-review-prompt.md) for dual review on each surface before marking done.

---

### Stage D — Redesign the Surfaces (~2–3 Weeks; Highest Impact First)

#### Step D1: Tokens & Shared Chrome (3–5 days)
* Extract core layout classes (`.filter-pill`, `.glass-nav`, `.card-surface`) into Tailwind v4 `@utility` directives in `globals.css` *before* dropping `hirefound.css`.
* Delete `src/app/hirefound.css` and `src/components/site/custom-cursor.tsx`.
* Rebuild `SiteNav` and `SiteFooter` with clean responsive drawer and backdrop blur.
* Rebuild `BookingModal` using `@radix-ui/react-dialog`:
  - Create `<CalDialog>` component lazy-loading Cal embed (`cal.com/yasminblasi`) with brand color `#7A1E4A`.
  - Use native `onLoad` handler; eliminate the 40x `setInterval` iframe polling loop.

#### Step D2: Homepage Composition Rebuild (4–7 days)
* **Hero Section:**
  - Delete fake WhatsApp chat simulator and typing dots.
  - Implement an authoritative editorial fold: headline, Yasmin's executive portrait, and clear dual CTAs: **"I'm Hiring Executive Talent"** (triggers CalDialog) vs **"Explore Open Roles"** (scrolls to vacancies).
* **Purge DOM Effect Files:**
  - Delete `hero-effects.tsx`, `micro-interactions.tsx`, `scroll-reveals.tsx`, and `services-effects.tsx`.
* **Services Section:**
  - Rebuild using `@radix-ui/react-tabs` for Employer vs Candidate pathways.
* **Trust & Press Section:**
  - Modernize media features (*TEDx, Leaders of Arabia, Arab Icons*) and executive testimonial cards. Confirm copy with Yasmin before publishing.

#### Step D3: Jobs Board & Detail Redesign (3–5 days)
* High-scanability Gulf/MENA job board with fast category chips and search input.
* Redesign `JobCard` and `JobDetail` with clean typography and native bilingual Arabic RTL support.
* Unified application drawer prioritizing Tally embed (when `tallyFormId` exists) with clean fallbacks to direct WhatsApp, Email, and Book a Call.
* Keep `/jobs/?id={slug}` contract.

#### Step D4: Yasmin CMS Workspace (3–5 days)
* High-density recruiter command center designed for a solo operator (<2 minutes to publish a role).
* Fast search, category filters, and active/inactive toggle switches.
* Keyboard shortcut `N` to create a new job.
* Rebuild `JobEditor` layout: clean accordion, Zod-compatible validation, instant slug auto-generation.
* Polish Tiptap editor toolbar (Bold, Italic, Link, Lists) with verified Quill HTML normalization via `src/lib/yasmin/editor-html.ts`.
* Delete `src/app/yasmin/yasmin.css`.

---

### Stage E — Optional Later Capabilities (Explicit New Decisions)
- Transition to path-based dynamic routes (`/jobs/[slug]`) via `generateStaticParams` + rebuild webhook **or** migrate to SSR/ISR host (Cloudflare/Vercel).
- Add OpenGraph image generation and Google `JobPosting` JSON-LD schema (tied to slug strategy).
- Migrate `JobEditor` state to React Hook Form + Zod.
- Enable CI pull request testing workflow (`.github/workflows/ci.yml`).

---

## 5. Verification Gates

### Surface-Level Gates (During Stage D)
- [ ] `npm test` passes without regression on every commit.
- [ ] `npm run build` compiles clean static export in `out/`.
- [ ] Surface reviewed and approved via `docs/ui-ux-review-prompt.md`.

### End of Phase 7 Final Sign-Off
- [ ] **Zero Imperative Scripts:** Zero `MutationObserver`, `document.getElementById`, or `setInterval` calls in site components.
- [ ] **Data Safety:** Existing Quill 2 Firestore job posts load, edit, and save cleanly in Tiptap without formatting loss.
- [ ] **Security Sync:** `firestore.rules` and `ALLOWED_EMAILS` set-equality test passes.
- [ ] **Accessibility & Performance:** Native cursor restored; touch targets ≥ 44x44px; keyboard focus traps functional; Lighthouse score ≥ 95.

---

## 6. Living Plan Decision Log Entry (Paste into `docs/platform-plan.md`)

```markdown
- **2026-10-09** — Canonical rebuild strategy adopted (`rebuild/ultimate-rev04.md`): finish Phase 6 cutover (preflight → merge v2→main → green Actions run → Pages source to Actions) and delete vanilla root (+ root assets only; protect public/assets) before redesign. Phase 7 is an aggressive presentation rebuild (tokens & shared chrome → homepage → jobs skin → Yasmin density) keeping domain/auth/Firestore/?id=/static export. Defer /jobs/[slug] + OG/JSON-LD to an explicit Stage E decision.
```

---

## Bottom Line

The strategy is settled. The execution order is deployment-safe. The asset protections are locked.

**Execute Stage A. Everything else waits.**
