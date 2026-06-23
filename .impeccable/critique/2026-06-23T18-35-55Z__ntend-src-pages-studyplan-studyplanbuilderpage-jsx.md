---
target: new plan page
total_score: 29
p0_count: 0
p1_count: 1
timestamp: 2026-06-23T18-35-55Z
slug: ntend-src-pages-studyplan-studyplanbuilderpage-jsx
---
#### Design Health Score
> *Based on Nielsen's 10 Heuristics*

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Good use of loading states and toasts, but lacks skeleton loaders for the topic list. |
| 2 | Match System / Real World | 4 | Clear modes (PDF, Paste, Goal) match mental models. |
| 3 | User Control and Freedom | 3 | Easy to switch modes without losing data; "Back" button present in step 2. |
| 4 | Consistency and Standards | 3 | Consistent visual vocabulary (flat containers, standard borders). |
| 5 | Error Prevention | 2 | Subject name is required in Step 1 but not validated until submit. |
| 6 | Recognition Rather Than Recall | 3 | Helper text effectively explains each mode's purpose. |
| 7 | Flexibility and Efficiency | 2 | Editing 20+ topics in Step 2 requires massive scrolling (low density). |
| 8 | Aesthetic and Minimalist Design | 3 | Clean, focused layout; avoids decorative slop. |
| 9 | Error Recovery | 3 | Generation errors offer clear next steps (Try again, Switch mode). |
| 10| Help and Documentation | 3 | Inline helpers and Help Center link present on failure. |
| **Total** | | **29/40** | **Good** |

#### Anti-Patterns Verdict

**LLM assessment**: Clean and restrained. This doesn't look like typical AI slop. It correctly uses a product-appropriate layout (flat panels, 1px borders, subtle interactive states) without resorting to gradient text or glassmorphism. However, the structure of the topic list in Step 2 is too bulky for data entry, prioritizing component aesthetics over data density. 

**Deterministic scan**: The CLI detector found 0 issues (`[]`). The markup is clean of banned utility classes and codex tells.

**Visual overlays**: *Browser overlay injection skipped. No reliable user-visible overlay is available (automated browser overlay mutation not available in this environment).*

#### Overall Impression
A solid, highly functional foundation that nails the "scholar's workbench" aesthetic. The primary weakness is data density in Step 2: making users edit dozens of generated topics using large, padded card components will quickly become tedious. 

#### What's Working
- **State Preservation**: Switching between "Paste syllabus" and "Upload PDF" doesn't wipe the user's input.
- **Clear Error Recovery**: The error block for a failed generation gives the user immediate, actionable escape hatches (Try again, Switch mode, Help Center) instead of a dead end.
- **Visual Restraint**: The UI relies on subtle background shifts (`bg-surface-container-low` vs `lowest`) and borders, completely avoiding distracting shadows or heavy colors.

#### Priority Issues

- **[P1] Subject Name validation is reactive, not proactive**
  - **Why it matters**: Users can fill out a long syllabus, click Generate, and get blocked by a red error asking for a subject name. 
  - **Fix**: Disable the "Generate topics" button until the subject name is filled, or move the subject name requirement to Step 2 so it doesn't block the AI generation step.
  - **Suggested command**: `$impeccable harden`

- **[P2] Low data density in Step 2 Topic List**
  - **Why it matters**: Each topic is a large card. Editing a 20-topic study plan will require endless scrolling.
  - **Fix**: Convert the topic list into a compact, high-density table or a tight list of inline inputs (`py-sm` instead of `p-md`).
  - **Suggested command**: `$impeccable layout`

- **[P3] Vague "Hours" label**
  - **Why it matters**: "Hours" defaults to 1, but it's unclear if this means total hours for the topic, hours per week, or hours per day.
  - **Fix**: Update the label to "Total Hours" or add a small tooltip/helper text.
  - **Suggested command**: `$impeccable clarify`

#### Persona Red Flags

**Alex (Power User)**: 
- Gets annoyed by the bulky layout in Step 2. Wants to tab quickly through a dense list of inputs to adjust estimates without scrolling past huge padding blocks.

**Jordan (First-Timer)**: 
- Might hesitate at the "Hours" input in Step 2, unsure what scope of time the estimate covers.
- The "What happens next" checks in Step 1 are helpful, but might get visually lost next to the primary CTA.

#### Minor Observations
- The max PDF size is hardcoded to 10MB in the error message, but it would be nice to visually state this constraint next to the upload button before the user drags a file.
- The drag-and-drop zone changes color (`bg-primary-fixed`) on drag over, which is great for feedback.

#### Questions to Consider
- Does the backend actually require the `subjectName` to generate the topics, or only to save the final plan? If it's just for saving, moving it to Step 2 removes friction.
- Could the topic editing step resemble a spreadsheet interface for faster data entry?
