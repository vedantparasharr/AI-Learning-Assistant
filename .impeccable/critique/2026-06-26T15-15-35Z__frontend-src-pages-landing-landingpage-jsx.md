---
target: landing page
total_score: 36
p0_count: 0
p1_count: 2
timestamp: 2026-06-26T15-15-35Z
slug: frontend-src-pages-landing-landingpage-jsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Scroll-reveals give good feedback, but no active states on nav links. |
| 2 | Match System / Real World | 4 | Excellent use of study-specific terminology (spaced repetition, syllabus). |
| 3 | User Control and Freedom | 4 | Easy scroll navigation and prominent CTAs. |
| 4 | Consistency and Standards | 3 | Mostly adheres, but violates DESIGN.md fixed-scale rule. |
| 5 | Error Prevention | 4 | N/A for a static landing page. |
| 6 | Recognition Rather Than Recall | 4 | Clear iconography and numbered sequences. |
| 7 | Flexibility and Efficiency | 3 | N/A |
| 8 | Aesthetic and Minimalist Design | 3 | Clean mosaic grid, but some hardcoded colors deviate from the strict system. |
| 9 | Error Recovery | 4 | N/A |
| 10 | Help and Documentation | 4 | Features clearly explained inline. |
| **Total** | | **36/40** | **Excellent** |

#### Anti-Patterns Verdict

**LLM assessment**: The page avoids major AI slop tropes. The mosaic grid for features is a sophisticated touch compared to floating cards. The 3-step sequence earns its numbers. However, the heavy reliance on fluid `clamp()` typography and hardcoded hex colors breaks the "Scholar's Workbench" strict utility aesthetic established in `DESIGN.md`.

**Deterministic scan**: The CLI detector found 0 issues (clean pass).

**Visual overlays**: No reliable user-visible overlay is available (run sequentially without browser automation).

#### Overall Impression
A highly focused, professional landing page that successfully communicates the "serious study" brand. The copy is tight and the layout is clean. The biggest opportunity is fixing the mobile navigation and aligning the typography/color implementations with the strict design system rules.

#### What's Working
- **Mosaic Feature Grid**: Using a 1px gap grid with a colored background is a clean, modern alternative to repetitive card dropshadows.
- **Meaningful Sequences**: The 1-2-3 "How it works" section describes a real sequential flow, earning its numbered badges rather than using them as decorative eyebrows.
- **Reduced Motion Support**: The scroll-reveal CSS specifically includes a `@media (prefers-reduced-motion: reduce)` block to disable animations for accessibility.

#### Priority Issues

- **[P1] Hidden Mobile Navigation**
  - **Why it matters**: The `hidden sm:flex` class completely removes the nav links and the "Sign in" button on mobile screens. Mobile users have no way to log into their existing accounts.
  - **Fix**: Add a hamburger menu/drawer for mobile, or at minimum, keep the "Sign in" link visible alongside the primary CTA.
  - **Suggested command**: `$impeccable adapt`

- **[P1] Missing Keyboard Focus States**
  - **Why it matters**: The primary buttons in the Hero and Final CTA lack explicit `focus-visible` utilities. Since Tailwind resets browser outlines, keyboard-only users will not know which button they are focused on.
  - **Fix**: Apply `focus-visible:ring-2 focus-visible:ring-primary/20` (as used in the Nav) to all interactive elements in the Hero and CTA.
  - **Suggested command**: `$impeccable audit`

- **[P2] Fluid Typography Violation**
  - **Why it matters**: `DESIGN.md` explicitly states: "Fluid clamp scaling is prohibited in the interface to maintain text block density." The landing page uses dozens of inline `clamp()` styles for font sizes and padding, breaking the strict "Scholar's Workbench" utility feel.
  - **Fix**: Replace inline `clamp()` styles with standard Tailwind breakpoint utilities (e.g., `text-4xl md:text-5xl`) aligned to the design system's fixed scale.
  - **Suggested command**: `$impeccable typeset`

- **[P3] Hardcoded Semantic Colors**
  - **Why it matters**: The Footer and CTA use hardcoded hex values (`#9c9af4`, `#e2dfff`) instead of semantic Tailwind tokens. This breaks theming and makes future color updates fragile.
  - **Fix**: Map these colors to existing design system tokens (like `text-primary-container` or `bg-surface-variant`).
  - **Suggested command**: `$impeccable harden`

#### Persona Red Flags

**Casey (Distracted Mobile User)**:
- Cannot sign in. The "Sign in" button disappears completely on mobile viewports due to `hidden sm:flex` on the navigation block, leaving them stranded.

**Sam (Accessibility-Dependent User)**:
- Will lose track of their position on the page when tabbing through the Hero section and Final CTA, as the buttons have no visible focus rings to overcome Tailwind's default outline reset.

#### Minor Observations
- The hero image uses `loading="eager" decoding="async"`, which is excellent for LCP performance.
- The scroll-reveal delay math in lists works well, but ensure it doesn't cause frustrating delays if a user scrolls quickly.

#### Questions to Consider
- Does a strict, utility-focused product like this need marketing-style scroll reveals at all, or would a fast, instant-load presentation better match the "no bloat" brand promise?
