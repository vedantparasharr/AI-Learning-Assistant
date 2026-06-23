---
target: syllabuspage.jsx
total_score: 24
p0_count: 0
p1_count: 3
timestamp: 2026-06-23T08-27-18Z
slug: frontend-src-pages-syllabus-syllabuspage-jsx
---
# Design Critique: Syllabus Page

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Toggling topic completion lacks loading states or immediate feedback. Progress bars inside cards are hidden when completed. |
| 2 | Match System / Real World | 3 | Uses natural academic terms (Curriculum Modules, Lessons). |
| 3 | User Control and Freedom | 2 | Users cannot mark a completed topic as pending or uncompleted from the list. |
| 4 | Consistency and Standards | 1 | Uses grid cards instead of list rows; progress bar colors (`secondary-fixed`) deviate from standard teal (`secondary`). Uses custom card accent stripes and translate animations. |
| 5 | Error Prevention | 3 | Direct navigation links prevent incorrect state triggers. |
| 6 | Recognition Rather Than Recall | 3 | Modules list lesson counts, stage badges, and numbers clearly. |
| 7 | Flexibility and Efficiency | 2 | No task-like checkboxes or bulk progress updates. |
| 8 | Aesthetic and Minimalist Design | 2 | Vertical grid layout creates uneven spaces. Cards use top-accent stripes and translate hover transitions, causing visual clutter. |
| 9 | Error Recovery | 3 | Handles plan-loading errors. |
| 10 | Help and Documentation | 3 | Clear breadcrumb navigation is present. |
| **Total** | | **24/40** | **Acceptable (Significant improvements needed)** |

## Anti-Patterns Verdict

**LLM assessment**: Yes. The page uses vertical grids, custom card animations, and top-stripe colors that diverge from the application's clean scholar workspace aesthetic. 

**Deterministic scan**: The CLI scan returned 0 findings.

**Visual overlays**: No user-visible overlays are available (authentication redirection degraded browser visualization).

## Overall Impression
The Syllabus Page is highly structured but visually noisy due to the multi-column card grid, colored border stripes, and hover translation offsets. Redesigning this view into horizontal card rows with built-in task checklists and unified progress colors will align it with the rest of the application and vastly improve the user experience.

## What's Working
- **Breadcrumb Navigation**: Excellent, clear path back to the parent Study Plans directory.
- **Detailed Lesson Ratio**: Explicitly showing "Lesson X of Y" makes it easy to understand modular scope.

## Priority Issues

### [P1] Grid vs Horizontal List Rows Mismatch
- **Why it matters**: Looks visual busy and inconsistent with the horizontal row aesthetic of the Study Plans list.
- **Fix**: Replace the three-column card grid with space-efficient horizontal card rows.
- **Suggested command**: `$impeccable layout`

### [P1] Missing Task Checkbox Control
- **Why it matters**: Forces users to dive into study paths to mark topics completed; no way to toggle them back.
- **Fix**: Place an interactive task checkbox on the left of each row. Checking it calls `topicService` to toggle completion status.
- **Suggested command**: `$impeccable craft`

### [P1] Color & Progress Token Drift
- **Why it matters**: Uses neon teals (`bg-secondary-fixed`) and purple-grays (`bg-tertiary-fixed`) inconsistent with standard teal and container tokens.
- **Fix**: Standardize progress bars to use `bg-secondary` (fill) and `bg-surface-container` (track).
- **Suggested command**: `$impeccable colorize`

### [P2] Visual Stripe Borders & Hover Offsets
- **Why it matters**: Uses decorative top-accent colored lines and translate offset animation hacks, violating design rules.
- **Fix**: Remove the `border-t-[3px]` stripe and translate hover offsets, keeping containers flat-by-default.
- **Suggested command**: `$impeccable quieter`

## Persona Red Flags

**Alex (Power User)**:
- Must click into each card to mark it completed; no quick checkbox toggling on the main page.
- Cannot bulk-complete modules.

**Jordan (First-Timer)**:
- Mismatched progress bar colors (neon teals) might look like warning/error indicators instead of standard progress.
- "Completed" cards hide progress bars entirely, which can make them feel like inactive widgets.

**Sam (Accessibility-Dependent User)**:
- Colored badges might not hit contrast thresholds; stage indication is heavily color-dependent.
