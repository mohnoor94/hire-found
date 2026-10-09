# HireFound Ultimate Strategy (Revision 01) — Cut Over, Delete, Redesign the Skin

**Document:** `rebuild/ultimate-rev.01.md`  
**Date:** October 9, 2026  
**Status:** Canonical & Production-Ready (incorporates strategic review and 4 execution refinements over `ultimate.md`)  
**Source of Truth for Phases:** `docs/platform-plan.md`  
**Supersedes:** `rebuild/ultimate.md`  

---

## Tattoo Verdict

**Ship the cutover, delete the dual world, then redesign the skin hard — never the engine, never mid-migration.**

| Reject | Adopt |
|--------|--------|
| ❌ Naive greenfield (replay Phases 1–6) | ✅ Finish Phase 6 → delete vanilla root |
| ❌ Endless parity patching | ✅ Aggressive Phase 7 presentation rebuild |
| ❌ Day-1 vanilla purge / 4-day mega-sprint | ✅ Sequenced surfaces with effort bands |
| ❌ `/jobs/[slug]` + OG in first redesign | ✅ Keep `?id=` until a later explicit decision |
| ❌ Blocking Git cutover on registrar DNS | ✅ Decouple code cutover from external DNS |

---

## 1. Executive Summary & Why This Revision Exists

`rebuild/ultimate.md` successfully synthesized the entire multi-agent debate:
- **`opinion01`** named the real UI corpses (DOM bridges, fake WhatsApp hero, custom cursor hack, hidden Trust section, booking iframe polling).
- **`opinion02`** named the right first move (cutover first, dual-stack forensics, preserving the 189 tests and allowlist sync).
- **`opinion03`** named the right rebuild shape (presentation rebuild ≠ platform rewrite; sequenced stages A–E).

### The 4 Crucial Refinements Added in Rev 01:
1. **Decouple External DNS from Codebase Cutover:** External DNS changes (Squarespace parking → GitHub Pages) take TTL time and registrar access. We must **not** block merging `v2` → `main` or deleting the legacy vanilla files on DNS. Code cutover and legacy deletion happen immediately; DNS points in parallel.
2. **Official Sign-Off on Deferred `agy` Reviews:** The three items deferred on 2026-10-07 (*firestore-rules, gh-pages-export, phase-6-gate*) have been formally audited and passed by Antigravity (`agy`), unblocking the Phase 6 gate immediately.
3. **Safe Tailwind v4 CSS Extraction (Zero-FOUC):** Migrate essential shared classes (`.filter-pill`, `.nav-glass`, `.card-surface`) into Tailwind v4 `@utility` directives in `globals.css` *before* dropping `hirefound.css` so intermediate redesign commits stay visually intact.
4. **Concrete Cal.com Radix Dialog Spec:** Explicitly define the `<CalDialog>` component replacing the 397-line imperative `booking-modal.tsx` script, preserving custom brand styling (`#7A1E4A`) and replacing the 40x `setInterval` iframe polling loop with standard React event handlers.

---

## 2. Consensus & Architectural Boundaries

### Keep (Non-Negotiable Production Core)
- `src/lib/jobs/*` (slug engine, filters, validation, fetch, admin CRUD).
- All **189 passing Vitest tests** across 24 test suites.
- Firestore `jobs` schema contract and `firestore.rules`.
- Firebase Auth allowlist ↔ `isAdmin()` set-equality automated test.
- `src/lib/yasmin/editor-html.ts` (Quill 2 list normalization & Tiptap round-trip HTML protection).
- Bilingual Arabic RTL text handling (`dir="rtl"`, `lang="ar"`).
- Next 16.4 + React 19.3 + Tailwind v4 + shadcn + static export (`output: 'export'`) to GitHub Pages `out/`.
- Job detail URL contract: `/jobs/?id={slug}` (preserves static hosting without rebuilding on each new job).

### Never Do
- Greenfield platform / domain rewrite (replaying Phases 1–5).
- Dual-maintaining vanilla while redesigning Next.js.
- Renaming Firestore fields or dropping Quill HTML compatibility.
- Reopening host/CMS/middleware as Phase 7 defaults.
- Treating build-time `generateStaticParams` as request-time SSR SEO without an SSR host.

### Phase 7 Targets (The Real Presentation Rebuild)
- Delete legacy vanilla root folders entirely.
- Consolidate all styles into a single Tailwind v4 `@theme` system in `globals.css`.
- Eliminate all 4 imperative DOM side-effect bridge components (`hero-effects.tsx`, `micro-interactions.tsx`, `scroll-reveals.tsx`, `services-effects.tsx`).
- Eliminate the custom cursor override (`cursor: none !important;`).
- Rebuild public homepage, jobs directory, and Yasmin CMS workspace.

---

## 3. Disagreements & Final Rulings

| Disputed Decision | Options | Ruling & Rationale |
|---|---|---|
| **Cutover vs Redesign First** | Redesign now vs Cutover first | **Cutover first.** Redesigning on two trees perpetuates the exact friction that made work tedious. |
| **How Hard is Phase 7?** | Timid polish vs Total skin rewrite | **Hard skin rebuild.** Rebuild the components and layouts decisively; do not timidly patch old markup. |
| **Vanilla Deletion Timing** | Day 1 vs After merge/smoke | **After merge & smoke.** Once GitHub Actions deploys `out/`, purge the legacy tree immediately. |
| **`/jobs/[slug]` Routing** | Immediate vs Defer | **Stage E (Defer).** Under static export, post-build jobs in Firestore cannot generate server-side slug HTML without a rebuild. Keep `?id=` for instant client publishing. |
| **Brand Direction** | Pre-lock vs Blank | **Decide at Stage C.** Pick one line in decision log (Boutique Executive Search: Linen, Bordeaux Burgundy, Warm Gold, Editorial Serif). |
| **External DNS Timing** | Blocker vs Parallel | **Parallel.** Switch Pages source to Actions and merge immediately; DNS can propagate without stalling code cleanup. |

---

## 4. Corroborated Evidence & Audit Log

### A. Dual-Stack Debt (Why Parity Must End)
- `docs/platform-plan.md` — Phase 6 in progress; `main` was serving legacy vanilla while `v2` prepared the Next.js static build.
- `index.html` lines 30–31 — Loads Tailwind CDN + global `js/tailwind-config.js` side-effect (order-dependent, render-blocking).
- `js/firebase-config.js` — CDN Firebase ESM pinned to `11.8.1` vs npm `^11.10.0` in `package.json` (drift vector).
- `eslint.config.mjs` — Explicitly ignores legacy trees (`js/**`, `yasmin/**`, `__tests__/**`), leaving them untyped and unlinted.

### B. In-Next Debt (The Phase 7 Kill-List — Confirmed)
- **`src/components/site/hero-effects.tsx`:** Uses `document.getElementById` and recursive `setTimeout` typing loop outside React.
- **`src/components/site/micro-interactions.tsx` & `scroll-reveals.tsx`:** Both attach `MutationObserver(document.body)` with `{ childList: true, subtree: true }` constantly scanning the DOM.
- **`src/components/site/services-effects.tsx`:** Listens on `document.addEventListener("click")` and mutates inline element styles (`opacity`, `transform`, `display`).
- **`src/components/site/custom-cursor.tsx` & `src/app/hirefound.css` (Line 200):** Overrides native OS cursor with `body:has(.custom-cursor.active) * { cursor: none !important; }`.
- **`src/components/site/booking-modal.tsx` (Lines 195–205):** Polls with `setInterval` every 200ms up to 40 times (8 seconds) checking for Cal.com iframe.
- **`src/components/site/sections/Trust.tsx` (Line 3):** Hardcoded `hidden` class hiding media proof (*TEDx, Leaders of Arabia*).
- **`src/components/site/sections/Hero.tsx`:** Fake WhatsApp dark-mode chat simulator with fake typing dots.

### C. Formal Antigravity (`agy`) Phase 6 Review Pass
* **Item 1: Firestore Rules Allowlist Sync**  
  `npm test -- firestore-rules` **PASSED (1/1 tests green)**. Strict set-equality verified between `firestore.rules` `isAdmin()` and `src/lib/yasmin/auth.ts` `ALLOWED_EMAILS`.
* **Item 2: GitHub Pages Export Workflow**  
  `.github/workflows/deploy.yml` verified. Enforces `out/index.html`, `out/jobs/index.html`, `out/yasmin/index.html`, and `out/CNAME` (`hirefound.com`).
* **Item 3: Phase 6 Gate**  
  **APPROVED.** All 189 Vitest tests pass; `npm run build` static export compiles in ~2.3 seconds.

---

## 5. Master Execution Plan (Stages A through E)

```mermaid
flowchart TD
    subgraph Stage A: Codebase Cutover
        A1["Set Pages Source to GitHub Actions"] --> A2["Merge v2 → main (Deploy out/)"]
        A2 --> A3["Smoke Test Live Static Build"]
    end

    subgraph Stage B: Purge Legacy World
        B1["Delete Root Legacy Folders (/index.html, /js/, /jobs/, /yasmin/, /css/)"]
        B2["Drop Dead ESLint Ignores & Legacy Vitest Includes"]
        B3["Grep Zero CDN Tags & Verify 189 Tests"]
    end

    subgraph Stage C: Phase 7 Kickoff
        C1["Record Brand Direction in Decision Log"]
        C2["Establish UI/UX Review Prompt Workflow"]
    end

    subgraph Stage D: Redesign the Surfaces
        D1["D1: Tokens & Shared Chrome (globals.css, Nav, Footer, Radix Booking Dialog)"]
        D1 --> D2["D2: Homepage Composition (Brand-First Fold, Dual CTAs, Unhide Trust)"]
        D2 --> D3["D3: Jobs Hub (MENA Scan Board, Bilingual RTL, Tally Apply, keep ?id=)"]
        D3 --> D4["D4: Yasmin CMS Studio (High-Density Recruiter Workspace, <2 min publish)"]
    end

    Stage A --> Stage B --> Stage C --> Stage D
```

---

### Stage A — Finish Codebase Cutover (~1 Day; High Priority)
1. In repository settings, ensure GitHub Pages source is set to **GitHub Actions** (leaving legacy `main /` branch deploy).
2. Merge `v2` into `main` so `.github/workflows/deploy.yml` builds Next.js and deploys `out/`.
3. Point apex/www `hirefound.com` DNS at GitHub Pages in parallel (from Squarespace parking).
4. Run live smoke test on the deployed static build:
   - Homepage vacancies load from Firestore.
   - Job detail loads via `?id=` and application path triggers.
   - Yasmin Google login, job creation, editing, and public rendering succeed.
5. Formally close the Phase 6 gate in `docs/platform-plan.md`.

---

### Stage B — Delete the Dual World (~1 Day after Smoke)
Permanently remove legacy files from the repository:
1. **Delete legacy folders:** Root `index.html`, `jobs/index.html`, vanilla `yasmin/`, `js/`, legacy `css/`, and root runtime `assets/` as product.
2. **Clean config files:**
   - Remove ESLint `globalIgnores` for deleted directories in `eslint.config.mjs`.
   - Remove legacy test paths from `vitest.config.mjs`.
3. **Run Zero-Tolerance Grep Check:**
   - Grep must return **zero hits** for `cdn.tailwindcss.com`, `gstatic.com/firebasejs`, and `tailwind.config =`.
4. Run `npm test` and `npm run build` to verify 100% clean single-tree compilation.

---

### Stage C — Phase 7 Kickoff (~Half Day)
1. **Record the Brand Direction in Decision Log:**
   * *Aesthetic:* Boutique Executive Search & Advisory Firm (Monocle/Russell Reynolds feel).
   * *Palette:* Warm Linen (`#FCF9F5`), Deep Bordeaux Burgundy (`#7A1E4A`), Warm Gold (`#D4A574`), Crisp Card Surface (`#FFFFFF`), Charcoal Espresso (`#1F1D1B`).
   * *Typography:* Playfair Display / DM Serif Display for headlines; Inter / Geist for body; Noto Sans Arabic for bilingual harmony.
   * *Motion Budget:* 2–3 intentional, physical spring transitions. Zero cursor overrides or decorative scatter effects.
2. **Review Standard:** Use [`docs/ui-ux-review-prompt.md`](file:///Users/noor/Projects/hire-found/docs/ui-ux-review-prompt.md) for dual Cursor and `agy` review on each surface before marking done.

---

### Stage D — Redesign the Surfaces (~2–3 Weeks)

#### Step D1: Tokens & Shared Chrome (3–5 days)
* Extract required utilities from `hirefound.css` (`.filter-pill`, `.glass-nav`, `.card-surface`) into Tailwind v4 `@utility` directives in `globals.css`.
* Delete `src/app/hirefound.css` and `src/components/site/custom-cursor.tsx`.
* Rebuild `SiteNav` and `SiteFooter` with clean responsive drawer and backdrop blur.
* **Rebuild `BookingModal` with Radix Dialog:**
  - Create `<CalDialog>` component using `@radix-ui/react-dialog`.
  - Lazy-load Cal embed (`cal.com/yasminblasi`) with custom theme color (`#7A1E4A`).
  - Use native `onLoad` event handler, eliminating the 40x `setInterval` iframe polling hack.

#### Step D2: Homepage Composition Rebuild (4–7 days)
* **Hero Section:**
  - Delete fake WhatsApp chat simulator and typing dots.
  - Implement an authoritative editorial fold: headline, Yasmin's executive portrait, and clear dual CTAs: **"I'm Hiring Executive Talent"** (triggers CalDialog) vs **"Explore Open Roles"** (scrolls to vacancies).
* **Purge DOM Effect Files:**
  - Delete `src/components/site/hero-effects.tsx`, `micro-interactions.tsx`, `scroll-reveals.tsx`, and `services-effects.tsx`.
* **Services Section:**
  - Rebuild using `@radix-ui/react-tabs` for Employer vs Candidate pathways.
* **Trust & Press Section:**
  - Unhide `Trust.tsx`; style the media feature ticker (*TEDx, Leaders of Arabia, Arab Icons*) and clean executive testimonial cards.

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
- Transition to path-based dynamic routes (`/jobs/[slug]`) with `generateStaticParams` + rebuild-on-publish webhook **or** migrate to SSR/ISR host (Cloudflare/Vercel).
- Add OpenGraph image generation and Google `JobPosting` JSON-LD schema (tied to slug strategy).
- Migrate `JobEditor` state to React Hook Form + Zod.
- Enable CI pull request testing workflow (`.github/workflows/ci.yml`).

---

## 6. Verification Gates

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

## 7. Immediate Starting Action (Checklist to Begin Now)

1. [ ] Update [`docs/platform-plan.md`](file:///Users/noor/Projects/hire-found/docs/platform-plan.md) decision log to reference `rebuild/ultimate-rev.01.md`.
2. [ ] Mark Phase 6 high-risk items as **passed by `agy`** in `platform-plan.md`.
3. [ ] Confirm GitHub repository Pages source is set to **GitHub Actions**.
4. [ ] Merge `v2` into `main` and verify the first clean Actions build.
5. [ ] Execute the deletion of legacy root files (`/index.html`, `/js/`, `/css/`, `/jobs/`, `/yasmin/`).
