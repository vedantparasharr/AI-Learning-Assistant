---
target: new plan page
total_score: 21
p0_count: 0
p1_count: 3
timestamp: 2026-06-23T06-48-54Z
slug: ntend-src-pages-studyplan-studyplanbuilderpage-jsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Buttons switch to Processing/Creating and toasts fire, but there is no persistent step indicator, field-level validation, or durable generation error state. |
| 2 | Match System / Real World | 3 | The source modes map well to learner inputs, though "AI Prompt" and "roadmap" language is less precise than the study-plan workflow. |
| 3 | User Control and Freedom | 2 | Users can go back from Review Topics, but there is no cancel/exit path, draft preservation, or confirmation when leaving after entering material. |
| 4 | Consistency and Standards | 2 | The page uses project tokens, but mixes click-only divs, faux buttons, thick accent borders, shadows, and inconsistent button color hierarchy. |
| 5 | Error Prevention | 2 | Required subject, input presence, file type via accept, file size, and date min exist, but blank generated/manual topics can remain and invalid states are handled late. |
| 6 | Recognition Rather Than Recall | 3 | Mode tabs, Plan Details, and What Happens Next help users understand the flow, but the user must remember source requirements after switching modes. |
| 7 | Flexibility and Efficiency | 2 | Three input modes support different workflows, but there is no drag-and-drop implementation despite the copy, no keyboard-friendly upload surface, and no draft autosave. |
| 8 | Aesthetic and Minimalist Design | 2 | The screen is readable, but the right-side card, accent borders, icon badge, and panel shadows create a generic wizard-template feel. |
| 9 | Error Recovery | 1 | Errors are toast-only, generic "Failed" fallbacks appear, failed generation has no recovery path, and the empty generated-topic state is not actionable. |
| 10 | Help and Documentation | 2 | Inline hints exist, but there is no contextual help for PDF limits until after failure, generation failures, or what makes a good prompt/source. |
| **Total** | | **21/40** | **Acceptable: useful foundation, but significant improvements needed before the flow feels dependable.** |

#### Anti-Patterns Verdict

**LLM assessment**: The page has a functional product shape: step 1 gathers source material, step 2 reviews generated topics. It does not scream AI-generated, but it does carry product slop: thick top accent borders on rounded panels, soft shadows on persistent cards, an icon-led upload dropzone that claims drag-and-drop without implementing it, and a sidebar-like Plan Details card that competes with the source input. The core idea is good; the execution needs to become more precise and less template-like.

**Deterministic scan**: The detector found 2 warnings in `frontend/src/pages/StudyPlan/StudyPlanBuilderPage.jsx`: `border-accent-on-rounded` at lines 216 and 338. These are the `border-t-2` accent borders on rounded containers. I agree with both findings. They conflict with the flat 1px-border design system and are a visible repeated pattern.

**Visual overlays**: Browser overlay evidence was not available in this session. The fallback signal is source review plus deterministic CLI detection.

#### Overall Impression

The new plan page has the right ambition: let a learner bring raw material, let AI structure it, then make the learner review before committing. The biggest opportunity is trust. Users need clearer validation, a real upload affordance, recoverable error states, and a more guided step model so the AI handoff feels controlled rather than fragile.

#### What's Working

- The two-step flow is conceptually sound. "Source Material" followed by "Review Topics" matches how serious learners want to verify AI output before creating a plan.
- The three input modes support real use cases: PDF upload, syllabus paste, and prompt-based plan generation.
- The review step lets users edit topic names and estimated hours before saving, which is the right moment for learner control.

#### Priority Issues

**[P1] Upload affordance is click-only and misleading**

**Why it matters**: The dropzone says "Drag and drop your PDF file here," but the implementation is a clickable `div` that calls `document.getElementById("fileUpload").click()`. There are no drag/drop handlers, no keyboard role, and the visible "Select PDF File" is also a `div`, not a button. Keyboard and assistive tech users get a worse path, and mouse users are promised behavior that may not exist.

**Fix**: Make the upload control a real labeled input/button pattern or implement an accessible dropzone with `onDragOver`, `onDrop`, keyboard activation, visible focus, and explicit selected-file feedback. Replace DOM lookup with a ref or label/input association.

**Suggested command**: `$impeccable audit new plan page`

**[P1] Validation and recovery are toast-only**

**Why it matters**: Required subject, missing source, oversized PDF, generation failure, and creation failure all rely on transient toast messages. Users who miss the toast have no durable explanation near the failing field, and the generic "Failed" message gives no recovery path.

**Fix**: Add inline field errors for Subject Name, source input, PDF size/type, and topic review. Add a persistent generation error panel with "Try again," "Switch source mode," and "Open Help Center" actions. Preserve entered material after failure.

**Suggested command**: `$impeccable harden new plan page`

**[P1] Review Topics can accept bad generated or edited output**

**Why it matters**: If AI returns zero topics, the flow advances to a mostly empty state. If generated topics contain blank names, or a user deletes a topic name manually, `Create Study Plan` is only disabled when the array length is zero. That can lead to weak or invalid plans.

**Fix**: Do not advance to Review Topics when normalized topics are empty. Show an actionable empty-generation recovery state. In Review Topics, flag blank topic names inline and disable create until every topic has a valid name and positive hours.

**Suggested command**: `$impeccable harden new plan page`

**[P2] Step 1 asks users to solve too many things at once**

**Why it matters**: The user must choose a source mode, provide source material, understand "Plan Details," optionally choose a target date, read "What Happens Next," and find the final Generate button. That is moderate cognitive load for a task that already has intrinsic complexity.

**Fix**: Turn the flow into a clearer vertical sequence: source mode and source input first, plan details second, generate action third. Add a compact step/progress indicator and keep the primary button visually tied to the current step rather than isolated in the right column.

**Suggested command**: `$impeccable shape new plan page`

**[P2] Visual treatment drifts from the design system**

**Why it matters**: The detector-hit top borders, rounded card accents, soft shadows, and the secondary-colored primary CTA create a more generic wizard/card interface than DistillLearn's flat, precise "scholar's workbench" direction.

**Fix**: Remove `border-t-2`, use flat 1px bordered panels, reduce persistent shadows, reserve secondary/teal for progress or success, and make "Generate Topics" use the primary action vocabulary.

**Suggested command**: `$impeccable layout new plan page`

#### Persona Red Flags

**Jordan (First-Timer)**: Jordan sees three source modes, Plan Details, "What Happens Next," and a separate Generate button. They can understand the pieces, but they may not know whether subject name should be filled before or after selecting material, and toast-only errors disappear too quickly.

**Sam (Accessibility-Dependent User)**: Sam cannot reliably operate the upload area because the main surface is a clickable `div`, the visible select control is not a button, and the remove-file icon has no accessible label. Toast-only validation also may not be announced in a useful field context.

**Casey (Distracted Mobile User)**: Casey has to scroll through mode selection, a large source panel, and a plan details panel before reaching the primary action. If interrupted mid-entry, there is no draft persistence and no warning before navigating away.

**Serious Learner: Maya**: Maya needs confidence that the AI output can be corrected before it becomes a study plan. The review step helps, but empty/weak output and blank topics need explicit guardrails so she does not start from a bad curriculum.

#### Minor Observations

- The component name `UploadMain` no longer matches the route-level purpose as well as `StudyPlanBuilderPage`.
- `inputMode` has an inline comment that could be replaced by clearer constants.
- "Subject Name" uses title case while surrounding prose mostly uses sentence-style product copy.
- The close/remove file icon needs an `aria-label`.
- Material Symbols used as decorative/status icons should generally be `aria-hidden`.
- "Best for" helper text is italic, which reduces the precise product feel; a quieter label/body pattern would fit better.
- `hover:bg-primary-dark` appears on the Create Study Plan button, but `primary-dark` is not defined in the shown Tailwind config.

#### Questions to Consider

- Should the first screen optimize for the most common path, likely PDF upload, or keep all three source modes equally prominent?
- Is "AI Prompt" meant for freeform roadmap creation, or should it be framed as "Describe a goal" to match learner language?
- What should happen when AI returns a low-quality topic list: retry generation, edit manually, or ask for more source detail?
