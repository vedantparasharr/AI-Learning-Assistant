---
target: study plans page
total_score: 18
p0_count: 0
p1_count: 4
timestamp: 2026-06-23T07-20-56Z
slug: frontend-src-pages-studyplans-studyplans-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Sorting and search state are mostly invisible; cards do not explain why they are ordered or when they were last active. |
| 2 | Match System / Real World | 3 | Most language is understandable, but phrases like "distilled learning paths" and "Compile a new curriculum" are less direct than the user task. |
| 3 | User Control and Freedom | 2 | The card menu only supports a destructive action and lacks clear dismiss / escape behavior beyond re-clicking. |
| 4 | Consistency and Standards | 1 | This page uses an older visual/component vocabulary instead of the shared `PageShell`, `EmptyState`, `LoadingState`, and newer button/card styles. |
| 5 | Error Prevention | 2 | Delete confirmation exists, but the page does little to prevent accidental menu interaction or clarify filter/search causes for empty results. |
| 6 | Recognition Rather Than Recall | 1 | Search comes from URL state outside the page, but the page does not show the active query or give a clear way to clear it. |
| 7 | Flexibility and Efficiency | 2 | Basic filter/sort exists, but there are no bulk actions, keyboard-friendly menus, quick actions, or visible recent metadata. |
| 8 | Aesthetic and Minimalist Design | 2 | The layout is clean, but it leans on a generic repeated-card grid and weak CTA hierarchy instead of a more intentional study workspace. |
| 9 | Error Recovery | 2 | Error copy is short and visible, but it does not offer recovery actions like retry, clear filters, or create a plan. |
| 10 | Help and Documentation | 1 | No contextual guidance exists on-page for first-time users or empty states. |
| **Total** | | **18/40** | **Poor** |

## Anti-Patterns Verdict

**LLM assessment**: This does not scream "AI-generated" in the loud beige-gradient sense, but it does read like a default implementation rather than a confident product surface. The biggest tells are the uniform card grid, the featured-via-top-border treatment, the dashed create card parked as one more tile, and the lack of a stronger opinion about first-run, sorting context, or study workflow. It feels serviceable, not trusted.

**Deterministic scan**: `detect.mjs` returned no findings for `frontend/src/pages/StudyPlans/StudyPlans.jsx`. That means the page avoided the tool's known anti-pattern checks, but it also means the main problems here are higher-order product UX issues: hidden search state, weak empty/loading/error states, and design-system drift. No false positives to report.

**Visual overlays**: No reliable user-visible overlay is available in this session because browser automation / mutable page injection was not available. Fallback signal used: source inspection plus CLI detector output.

## Overall Impression

The page is functional and readable, but it does not yet feel like the central workspace for ongoing study. The biggest opportunity is to stop treating study plans as a generic card gallery and make the page communicate status, recency, and next actions more explicitly.

## What's Working

- The filter and sort controls are placed in a familiar location and keep the surface immediately usable for returning users.
- Card content is concise. Subject, snippet, counts, and progress are enough to scan quickly without drowning the page in metadata.
- Destructive deletion has a confirmation step, which is an important safety baseline for a study artifact list.

## Priority Issues

**[P1] What**: The page hides critical state, especially active search
**Why it matters**: Users can land on this page through the global search query and see reduced or empty results without being told what is filtering the list. That creates confusion and false "no plans" moments.
**Fix**: Surface the active search query in the page header or as a dismissible filter chip, show result counts, and provide a visible "Clear search" action next to the subject filter.
**Suggested command**: `$impeccable clarify`

**[P1] What**: The screen does not handle first-run, loading, and empty states like a product workspace
**Why it matters**: A study plans page is a hub. Plain text like "Loading study plans..." and "No study plans match the selected filter" gives no guidance, no reassurance, and no productive next step.
**Fix**: Replace the text-only states with the shared `LoadingState` and `EmptyState` patterns, and tailor the empty-state copy/action for first plan creation versus filter mismatch.
**Suggested command**: `$impeccable onboard`

**[P1] What**: The visual hierarchy makes the create action feel secondary and the plan list feel generic
**Why it matters**: The main job of this page is either resume an existing plan or start a new one. The dashed "Create Plan" tile competes as just another card instead of acting like a clear next step.
**Fix**: Pull creation into the header as a primary action, keep the grid for plans only, and add stronger secondary metadata like last studied / due today so the list feels like active work, not storage.
**Suggested command**: `$impeccable layout`

**[P1] What**: This page drifts from the newer shared UI vocabulary used elsewhere
**Why it matters**: When one screen uses older radius, shadows, header structure, and inline states while other screens use `PageShell`, `SectionCard`, and shared state components, the product feels stitched together.
**Fix**: Rebuild the page with the shared primitives and one consistent component language for headings, buttons, containers, and system states.
**Suggested command**: `$impeccable polish`

**[P2] What**: The per-card overflow menu is underpowered and not accessibility-friendly
**Why it matters**: An unlabeled overflow pattern with a single destructive action adds interaction cost without much value, and the custom absolute menu likely under-serves keyboard and dismiss behaviors.
**Fix**: Either expose delete in a clearer secondary pattern or expand the menu into a proper action menu with outside-click/Escape handling, focus management, and non-destructive actions like share or duplicate if those matter.
**Suggested command**: `$impeccable harden`

## Persona Red Flags

**Alex (Power User)**: The page offers no fast path beyond basic sort/filter. There are no quick actions like continue latest, no visible last-activity data to validate the current sort, and the overflow menu costs a click for a single destructive option.

**Jordan (First-Timer)**: If there are zero plans or the global search narrows the list, the page does not explain what happened or what to do next. "Compile a new curriculum" is less direct than "Create your first study plan," and the page gives no inline guidance about what a plan contains.

**Sam (Accessibility-Dependent User)**: The custom overflow menu is not presented as a robust menu pattern, and the page relies on visual grouping without stronger state announcements. Loading and filter-result changes are not communicated in a structured, assistive-friendly way.

## Minor Observations

- The top-border "featured" treatment on the first card feels arbitrary because the page never explains why that plan is special.
- The card grid uses identical blocks for every plan, so scanning relies mostly on reading titles rather than stronger secondary structure.
- Two separate links inside each card split the clickable area in a way that is workable but not especially elegant.
- The page sorts by "Last Active" but does not expose any timestamp, which weakens trust in the ordering.

## Questions to Consider

- If this is the learner's home for ongoing work, why doesn't the page show which plan needs attention today?
- Should "Create Plan" be part of the workspace chrome instead of masquerading as another content card?
- What would make this page feel like a study command center rather than a storage shelf?
