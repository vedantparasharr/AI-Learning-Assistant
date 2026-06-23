---
target: studyplans page
total_score: 24
p0_count: 0
p1_count: 3
timestamp: 2026-06-23T07-50-20Z
slug: frontend-src-pages-studyplans-studyplans-jsx
---
# Design Critique: Study Plans Page

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Delete action lacks standard feedback toasts or inline indicators. |
| 2 | Match System / Real World | 3 | Real-world terminology matches well. |
| 3 | User Control and Freedom | 2 | Destructive delete action uses native `window.confirm` instead of a custom UI/undo flow. |
| 4 | Consistency and Standards | 1 | Extensive use of hardcoded Tailwind colors, custom rounded corners (`rounded-3xl`), custom card shadows, and custom buttons bypassing the design system. |
| 5 | Error Prevention | 3 | Native confirmation dialog prevents accidental clicks. |
| 6 | Recognition Rather Than Recall | 3 | Active filter tags and search queries are clearly displayed. |
| 7 | Flexibility and Efficiency | 2 | No bulk actions, keyboard navigation accelerators, or advanced power-user controls. |
| 8 | Aesthetic and Minimalist Design | 2 | High visual noise caused by bubble-like rounding (`rounded-3xl`) and heavy, dark drop shadows that clash with the flat dashboard. |
| 9 | Error Recovery | 3 | Retry and error state component is integrated. |
| 10 | Help and Documentation | 3 | Explicit Help Center link is present. |
| **Total** | | **24/40** | **Acceptable (Significant improvements needed)** |

## Anti-Patterns Verdict

**LLM assessment**: Yes, this page shows clear signs of being styled independently as a one-off without adhering to the application's committed design system. The button styling, color palette (hardcoded slate grays instead of brand indigos/teals), extreme roundings (`rounded-3xl` cards, `rounded-2xl` selects/buttons), and heavy card shadows are all classic indicators of an unaligned component.

**Deterministic scan**: The CLI scan returned 0 slop detections, meaning there are no syntax/detector slop markers (such as side-stripe borders or gradient text), but the visual styling fails the consistency check.

**Visual overlays**: No user-visible overlays are available (authentication redirection degraded browser visualization).

## Overall Impression
The Study Plans page is highly functional but visually disconnected from the rest of the application. While the top-level stats use the shared component correctly, the filter bar and plan cards introduce completely different rounded corners, shadows, and button styles that bypass the design system. Replacing custom classes with system components will immediately resolve this inconsistency.

## What's Working
- **Shared Component Integration**: Correctly uses `PageShell`, `StatCard`, `LoadingState`, `ErrorState`, and `EmptyState` from `ui.jsx`, which keeps basic layout and fallback states consistent.
- **Clear Filtering Information**: Active search queries and filters are rendered as clear tags, ensuring users understand what they are looking at.

## Priority Issues

### [P1] Visual Token & Color Mismatch
- **Why it matters**: Creates a disjointed, unbranded feel that doesn't look like the same application.
- **Fix**: Replace all hardcoded Tailwind slate colors with the app's standard tailwind tokens (`bg-primary`, `bg-secondary`, `text-on-surface`, `text-on-surface-variant`).
- **Suggested command**: `$impeccable colorize`

### [P1] Button Inconsistency
- **Why it matters**: Breaks visual consistency. Buttons look different than on the Dashboard or in forms.
- **Fix**: Use `PrimaryButton` and `SecondaryButton` imported from `../../components/common/ui` instead of custom styled `<button>` tags.
- **Suggested command**: `$impeccable polish`

### [P1] Extreme Rounding & Heavy Shadows
- **Why it matters**: Looks visually loud and bubbly compared to the rest of the flat, scholarly workspace design.
- **Fix**: Replace custom rounded and shadow classes with the standard `rounded-xl` and standard shadow classes from the app's design system. Alternatively, wrap cards in the shared `SectionCard` component.
- **Suggested command**: `$impeccable layout`

### [P2] Progress Bar Styling Mismatch
- **Why it matters**: Progress indication should have a standard color meaning across the product.
- **Fix**: Change progress fill from `bg-slate-950` to `bg-secondary` (teal) and track from `bg-slate-200` to `bg-surface-container`.
- **Suggested command**: `$impeccable polish`

### [P2] Custom Inputs & Select Styling
- **Why it matters**: Mismatched form styles degrade professional tool feel.
- **Fix**: Standardize border radius (`rounded-lg` or `rounded-xl` according to the config) and use `border-outline-variant` instead of `border-slate-300`.
- **Suggested command**: `$impeccable polish`

## Persona Red Flags

**Alex (Power User)**:
- No keyboard shortcuts for navigation or filtering.
- One-by-one study plan deletion via blocking modal; no multi-select/batch actions.

**Jordan (First-Timer)**:
- Deleting a plan relies on native browser `confirm` which feels like a system crash rather than a guided product action.
- "Clear filters" is hidden unless filters are active, which can confuse users trying to figure out how to reset fields.

**Sam (Accessibility-Dependent User)**:
- Color contrast for minor texts (`text-slate-600` on white) may drop below WCAG AA thresholds.

## Minor Observations
- The page does not use `SectionCard` for its layout container, adding styling overhead directly inside the page.
- Native `select` boxes lack custom icons or arrow indicators, making them feel unpolished.

## Questions to Consider
- Should we wrap the filter section and study plan list cards inside the common `SectionCard` component to enforce visual standard?
- Would adding a progress tracker toast or overlay for async operations (like deletion) improve user feedback?
- Do we want to replace the browser-native `window.confirm` with a nice custom dialog or modal from the ui library?
