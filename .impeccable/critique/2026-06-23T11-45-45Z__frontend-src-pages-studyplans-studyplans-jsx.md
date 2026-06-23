---
target: studyplan.jsx
total_score: 28
p0_count: 1
p1_count: 1
timestamp: 2026-06-23T11-45-45Z
slug: frontend-src-pages-studyplans-studyplans-jsx
---
# Design Critique: StudyPlans.jsx

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Delete loading spinner has no ARIA live announcement. |
| 2 | Match System / Real World | 3 | Source badges ("Prompt", "Document") are jargon-y without definitions. |
| 3 | User Control and Freedom | 3 | Destructive delete action has confirmation but no undo option. |
| 4 | Consistency and Standards | 3 | Spacing and visual tokens are consistent with other pages. |
| 5 | Error Prevention | 3 | Confirmation modals prevent accidental deletes. |
| 6 | Recognition Rather Than Recall | 3 | Search terms filter list but aren't highlighted as badges. |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts or batch actions for list management. |
| 8 | Aesthetic and Minimalist Design | 3 | Clean horizontal list layout; subtle progress and details. |
| 9 | Error Recovery | 3 | Error state offers clear options to retry or create a new plan. |
| 10 | Help and Documentation | 2 | Help center link is present, but no inline glossary for terms. |
| **Total** | | **28/40** | **Good** |

## Anti-Patterns Verdict
**PASS**. The interface layout is mostly clean, conforming to standard horizontal list structures and proper color token application.
- **LLM assessment**: Visual layout is clear and structured. Contrast between text and background is solid. Visual weight is properly balanced across items.
- **Deterministic scan**: Automated detector scan found 0 styling anti-pattern warnings.
- **Visual overlays**: Skipped (no active browser subagent session / manual target review).

## Overall Impression
The Study Plans list page is a functional, solid listing dashboard that represents the plans clearly. The biggest opportunity is in polishing keyboard access and ensuring touch responsiveness on mobile.

## What's Working
1. **Diverse States Representation**: Clean, dedicated layout renders for loading, error, empty, and populated views.
2. **Contextual Action Modals**: Uses a robust confirmation modal before destructive deletions to prevent user error.

## Priority Issues
- **[P0] Responsive Layout Breakdown on Mobile**
  - **Why it matters**: Sidebar overlaps the viewport on screens under 1024px due to hardcoded layout widths.
  - **Fix**: Re-design the app sidebar and main container layout to be fully responsive using tailwind media queries.
  - **Suggested command**: `$impeccable adapt`
- **[P1] Lack of Keyboard Focus and Action on Plan Cards**
  - **Why it matters**: Interactive list rows are structured as `<article>` elements without `tabIndex` or keyboard event listeners, preventing keyboard-only users from entering plans.
  - **Fix**: Add `tabIndex={0}`, `role="link"`, and a keypress handler for Enter/Space keys to trigger the navigation.
  - **Suggested command**: `$impeccable harden`
- **[P2] Sub-44px Touch Targets**
  - **Why it matters**: Delete plan buttons (`h-9 w-9`) and filter dropdowns (`min-h-10`) do not meet the 44px touch target guidelines, increasing tap error rates on mobile.
  - **Fix**: Pad the click targets to ensure a minimum size of 44x44px.
  - **Suggested command**: `$impeccable adapt`

## Persona Red Flags

- **Sam (Accessibility-Dependent)**: Cannot focus the study plan rows using the keyboard. The delete action loading state is not announced by screen readers, leading to temporary silence/confusion.
- **Casey (Distracted Mobile User)**: Due to the fixed 256px sidebar overlapping the narrow viewport, Casey cannot see or interact with the plans correctly. The tiny `36px` delete button is extremely difficult to tap reliably one-handed.

## Minor Observations
- Icons on rows (`menu_book`) do not have `aria-hidden="true"`, causing screen readers to read their visual names aloud.
- The search term is not displayed as a dismissible query badge.
