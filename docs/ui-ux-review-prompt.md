# HireFound UI/UX review prompt

Use this with Cursor or Antigravity CLI (`agy`) for Phase 7 surface reviews. Fill in the **Surface** line before running.

You are reviewing HireFound UI/UX on branch `v2`. Be critical. Do not rewrite code unless asked. Produce a structured critique only.

## Context

- Product: HireFound — recruitment marketing site + Yasmin Space (admin CMS).
- Stack: Next.js App Router, React, Tailwind, shadcn/ui, Tiptap, Firebase Auth/Firestore, static export on GitHub Pages.
- Source of truth: `docs/platform-plan.md`.
- Visual direction: use the Phase 7 decision-log entry once it exists. If none exists yet, judge clarity, hierarchy, and craft without inventing a brand system.

## Surface

Surface under review: **REPLACE_WITH_ONE_OF**  
`homepage` | `jobs` | `yasmin-dashboard` | `yasmin-editor` | `shared-chrome` (nav, footer, booking modal)

Also note the paths / components you inspected.

## Review hard

1. Hierarchy — what wins the first glance? What fights it?
2. Density and clutter — cards, pills, stats, competing CTAs, dead space.
3. Brand and product feel — does this look like HireFound, or a generic template?
4. Motion — too much, too little, or pointless?
5. Forms and admin UX (if Yasmin) — labels, validation, focus, RTL Arabic, editor toolbar, confirmations, toasts.
6. Jobs UX (if jobs/homepage vacancies) — scanability, filters, empty/error states, apply path clarity.
7. Mobile — touch targets, wrapping, sticky chrome, modal/sheet behavior.
8. Accessibility — contrast, focus rings, keyboard, labels, live regions.
9. Consistency with the rest of the site and with shadcn patterns already in the repo.
10. Concrete fixes — ranked by impact. Prefer specific file/component names.

## Output format

```md
## Verdict
One blunt sentence.

## What works
- …

## Problems (ordered)
1. …
2. …

## Must-fix before done
- …

## Nice-to-have
- …

## Do not change
- …
```

Be opinionated. Prefer fewer, sharper findings over a long checklist of nits.
