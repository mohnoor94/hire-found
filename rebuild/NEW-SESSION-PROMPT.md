# New session prompt — HireFound cutover + Phase 7

Copy everything below the line into a **new Cursor agent chat**. Do not re-debate strategy.

---

You are executing HireFound cutover and Phase 7 redesign. Debate is over. Do not reopen greenfield vs incremental. Do not browse `rebuild/archive/` for decisions.

## Canonical docs (read these first)

1. `rebuild/ultimate-final.md` — **how** to execute (Stages A→E). Follow it.
2. `docs/platform-plan.md` — **living checklist** (tick boxes, decision log, Current phase / Next work / Last updated). Update it in the same change that does the work.
3. Review templates when stopping for reviews:
   - Phase 6 / engineering: `docs/phase-review-prompt.md`
   - Phase 7 UI: `docs/ui-ux-review-prompt.md`

## Hard locks (never violate)

- Keep: `src/lib/jobs/*`, Firestore contract, auth allowlist ↔ rules, `editor-html`, RTL, static export, `/jobs/?id=`, `public/assets/`, `public/CNAME`
- Never: greenfield rewrite, delete `public/assets`, invent Phase 6 `agy` PASS, flip Pages to Actions **before** merge+green Actions on `main` (dark site), pull `/jobs/[slug]` into Phase 7
- Stage A order: preflight → merge `v2`→`main` → green Actions → Pages→Actions → DNS parallel → smoke → **real** deferred `agy` to close gate
- After smoke: Stage B delete vanilla (root only) → Stage C direction line → Stage D (tokens/chrome → homepage → jobs → Yasmin)

## How to work

### Agents

Use **multiple subagents / Task tool** when useful, in parallel where independent:

- Explore: locate files, verify claims, grep safety (CDN, assets)
- General-purpose: implement a surface or Stage B deletion carefully
- Do **not** spawn “should we rebuild?” strategy agents — strategy is locked

Parent agent stays orchestrator: sequences stages, stops for reviews, commits.

### Cadence per task

1. Do the smallest coherent task for the current stage.
2. `npm test` and `npm run build` when the task touches code/config (skip only for pure DNS/Pages UI settings with no repo change).
3. Update `docs/platform-plan.md` statuses / decision log for that task.
4. **Commit + push** after each completed task (see commits below).
5. If a **review gate** is required → **STOP**, output the short review packet below, wait for user paste, then apply must-fixes, re-check, commit again, continue.

### When to STOP for reviews

| Gate | When | Cursor | `agy` |
|------|------|--------|-------|
| High-risk firestore-rules | Before marking Phase 6 high-risk done (if still deferred) | Already may be done — verify plan | **Ask user** if deferred |
| High-risk gh-pages-export | After Actions deploy path is real / before marking done | Verify plan | **Ask user** if deferred |
| Phase 6 gate | After smoke, before Stage B redesign work | **Ask user** | **Ask user** |
| Phase 7 each surface | After implementing that surface, before marking done | **Ask user** | **Ask user** |

Order always: implement → **Cursor review** (user runs / pastes) → must-fixes → **`agy` review** (user runs / pastes) → must-fixes → mark `done` in plan → commit → next.

Do **not** ask for reviews on ordinary small commits (typos, plan status-only, grep cleanup) unless they touch a named gate.

### Review stop format (use EXACTLY this when stopping)

Print nothing else actionable until the user returns feedback:

```text
## REVIEW GATE — stop

Gate: <phase-6-gate | high-risk:firestore-rules | high-risk:gh-pages-export | phase-7:<surface>>
Branch: <branch>
What shipped since last gate: <1–3 bullets + key paths>
Plan boxes to flip after pass: <paths in platform-plan.md>

### Cursor — paste this prompt into Cursor review (or run yourself)
You are reviewing HireFound. Critique only; do not rewrite code.
Scope: <SAME AS GATE>
Inspect: <file paths>
Use output format from docs/phase-review-prompt.md (Phase 6) OR docs/ui-ux-review-prompt.md (Phase 7).
Keep it focused: Verdict (pass | pass-with-fixes | fail); Must-fix (≤5, with paths); Nice-to-have (≤3); Do-not-change.

### agy — run after Cursor must-fixes are applied (or in parallel if Cursor already passed)
agy -p "$(sed 's/REPLACE_WITH_SCOPE/<scope>/' docs/phase-review-prompt.md)" --effort high
# Phase 7 instead:
agy -p "$(sed 's/REPLACE_WITH_ONE_OF/<surface>/' docs/ui-ux-review-prompt.md)" --effort high

Reply by pasting:
1) Cursor output
2) agy output (when ready)
I will apply must-fixes only, re-verify, commit, and continue.
```

Scopes to use:

- Phase 6: `phase-6-gate` | `high-risk:firestore-rules` | `high-risk:gh-pages-export`
- Phase 7 surfaces: `shared-chrome` | `homepage` | `jobs` | `yasmin-dashboard` | `yasmin-editor`

### Commits & push

After **every** completed task (and after review must-fix rounds):

- Prefer branch that matches cutover state: stay on `v2` until Stage A merge; **after merge, work on `main`** (or the branch that deploys) for Stages B–D unless user says otherwise.
- Commit message: short, why-focused (e.g. `chore: Stage B delete vanilla root tree`, `feat: Phase 7 shared chrome + CalDialog`).
- Always `git push` after commit (`-u` if new branch).
- Never `--no-verify`, never force-push `main`, never amend unless user asks and amend rules allow.
- Do not commit secrets. Include `docs/platform-plan.md` updates in the same commit as the work when possible.

### Stage map (do in order — one stage at a time)

**Stage A — Cutover** (calendar / ops heavy)

1. Git hygiene: `git fetch origin main && git status` (clean tree)
2. Confirm recent preflight or re-run `npm test && npm run build` on `v2`
3. Merge `v2` → `main`; push; wait for Actions green (`out/` + CNAME assert)
4. User/ops: switch Pages source to GitHub Actions (guide them; you cannot always click Settings)
5. User/ops: DNS apex/www → Pages (parallel; don’t block forever)
6. Smoke checklist (record results in plan): `/`, `/jobs/?id=…` + apply, Yasmin CRUD → public HTML
7. **STOP** for deferred Phase 6 high-risk + phase-6-gate reviews as needed
8. Commit any plan updates; push

**Stage B — Delete dual world**

1. Delete root vanilla only; never `public/assets` / `public/CNAME`
2. Clean eslint + vitest; re-baseline Next-only test count in plan decision log
3. Grep-zero CDN Tailwind/Firebase/`tailwind.config =`
4. `npm test && npm run build`; commit; push

**Stage C — Phase 7 kickoff**

1. One decision-log visual direction line (candidates in ultimate-final; don’t invent a second brand system mid-flight)
2. Commit plan update; push

**Stage D — Surfaces (each: implement → review gate → next)**

1. `shared-chrome` (tokens, nav, footer, CalDialog) — review as `shared-chrome`
2. `homepage` — kill WhatsApp/effects/cursor; Trust soft-check with user/Yasmin before unhide
3. `jobs` — keep `?id=`
4. `yasmin-dashboard` then `yasmin-editor` (or one combined Yasmin pass if plan lists them separately — prefer separate gates as in platform-plan)

**Stage E — Do not start** unless user explicitly opens a new decision (slug routes, host change, Zod+RHF, CI).

### User interruptions

- If user pastes review feedback → apply **must-fixes only**, ignore scope creep, re-run tests/build if code changed, commit, then continue or request the next review (`agy` if Cursor just landed).
- If user says skip a review → refuse for Phase 6 gate / Phase 7 surfaces / named high-risk; remind them the plan requires dual review. Ordinary tasks can proceed.
- DNS / GitHub Pages Settings: give exact clicks/commands; wait for user confirmation before assuming live.

## First message actions (start now)

1. Read `rebuild/ultimate-final.md` §§1–5 and §9 checklist.
2. Read `docs/platform-plan.md` Status + Phase 6 section.
3. Run `git fetch origin main && git status && git branch -vv`.
4. Report: branch, dirty files, whether Stage A merge already happened, what’s next as **one** concrete task.
5. Begin that task. Commit + push when done. Stop at the first review gate.

Do not redesign before Stage A smoke + Stage B delete. Do not mark `agy` done without user-pasted `agy` output.
