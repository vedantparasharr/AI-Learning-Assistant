---
target: study plan builder page
total_score: 30
p0_count: 0
p1_count: 1
timestamp: 2026-06-25T13-08-20Z
slug: frontend-src-pages-studyplan-studyplanbuilderpage-jsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Good progress indicator, but dropzone active state could be clearer. |
| 2 | Match System / Real World | 4 | Clear terms (Upload PDF, Paste syllabus). |
| 3 | User Control and Freedom | 3 | Easy to switch tabs and clear files, but no overall "Cancel" or "Clear form" button. |
| 4 | Consistency and Standards | 3 | Standard components, but layout feels a bit disjointed from the rest of the app. |
| 5 | Error Prevention | 3 | Validates PDF and disables button if empty, but form fields could validate inline on blur. |
| 6 | Recognition Rather Than Recall | 4 | Good helper texts below the tabs. |
| 7 | Flexibility and Efficiency | 2 | Drag & drop works, but the form feels spread out over too many distinct boxes. |
| 8 | Aesthetic and Minimalist Design | 2 | Visual fragmentation. Too many nested gray borders make it feel like a wireframe rather than a premium product. |
| 9 | Error Recovery | 3 | Good error messages if generation fails. |
| 10 | Help and Documentation | 3 | Help center link is provided on error. |
| **Total** | | **30/40** | **Good** |

#### Anti-Patterns Verdict

**LLM assessment**: The layout looks functional but suffers from "boxy wireframe syndrome." There are too many visible borders and segmented gray backgrounds (the tabs are in a gray box, the dropzone is a dashed box, the sections are bordered boxes). To achieve the "minimal, premium, and professional" Scholar's Workbench feel you requested, we need to strip away these redundant borders, use whitespace for grouping instead of explicit lines, and elevate the typography.

**Deterministic scan**: The CLI scan returned 0 issues. The markup is structurally sound and free of the most egregious anti-patterns (like numbered eyebrows or side-stripes), but the visual execution is holding it back from feeling premium.

#### Overall Impression
The layout is logical and the progression is clear, but the visual execution feels like a generic SaaS template. The single biggest opportunity is to remove 80% of the borders and background tints, letting whitespace and typography do the work.

#### What's Working
- **The horizontal progress indicator** is clean and avoids the numbered-pill cliché.
- **The source selection tabs** are clearly labeled with helpful icons.
- **The "What happens next" hints** are nicely understated at the bottom.

#### Priority Issues

- **[P1] Visual fragmentation**: The page relies heavily on borders (`border-outline-variant`) and tinted backgrounds (`bg-surface-container-lowest`) to group content.
  - *Why it matters*: It creates visual noise and makes the interface feel disjointed and cheap instead of premium and minimal.
  - *Fix*: Remove most borders. Use a single continuous white surface with generous whitespace to group the source selection and plan details.
  - *Suggested command*: `$impeccable distill` or `$impeccable polish`

- **[P2] The Dropzone feels generic**: The dashed border and primary-colored icon feel like a default component library element.
  - *Why it matters*: It breaks the professional, scholarly immersion.
  - *Fix*: Make the dropzone a subtle, tinted area with no border at rest, only showing a refined dashed outline when actively dragging.
  - *Suggested command*: `$impeccable polish`

- **[P3] Form field integration**: The "Plan details" section feels tacked on as a separate block.
  - *Why it matters*: It interrupts the flow of creating a plan.
  - *Fix*: Integrate these fields more smoothly into the primary column without boxing them in.
  - *Suggested command*: `$impeccable layout`

#### Persona Red Flags

**Alex (Power User)**:
- No drag-and-drop affordance for the entire page (must hit the specific dropzone).
- Would prefer to hit `Enter` to generate topics once a file is dropped, but focus management might not support this.

**Jordan (First-Timer)**:
- The "Target date" field doesn't explain why it's needed or how it affects the plan.

#### Minor Observations
- The "PLAN DETAILS" uppercase label is a bit harsh; standard sentence case with a slightly larger font size might feel more editorial.
- The tab active state adds a shadow (`shadow-sm`), which violates the flat-by-default rule of the design system.

#### Questions to Consider
- Does the "Plan details" section even need to be visible before a source is provided? What if it faded in only after a file is uploaded or text is pasted?
- Could the page background just be pure white, removing the need for "card" containers entirely?
