---
target: frontend/src/pages/Auth
total_score: 30
p0_count: 0
p1_count: 1
timestamp: 2026-06-24T05-57-49Z
slug: frontend-src-pages-auth
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Good submit loading states; lacks inline field validation feedback. |
| 2 | Match System / Real World | 4 | Clean, standard terminology. |
| 3 | User Control and Freedom | 3 | Missing an easy way to edit email if mistyped on the Verify Email screen. |
| 4 | Consistency and Standards | 4 | Strong consistency using custom Input and PrimaryButton components. |
| 5 | Error Prevention | 2 | No dynamic password validation or strength meter on Register. |
| 6 | Recognition Rather Than Recall | 3 | Clear labels and placeholders. |
| 7 | Flexibility and Efficiency | 3 | OTP paste works well, but lacks SSO accelerators. |
| 8 | Aesthetic and Minimalist Design | 3 | Clean but slightly bland; lacks the intended "Scholarly Workbench" character. |
| 9 | Error Recovery | 2 | Errors rely on global toasts rather than inline field-level guidance. |
| 10 | Help and Documentation | 3 | Standard help links present. |
| **Total** | | **30/40** | **[Good]** |

#### Anti-Patterns Verdict

**LLM assessment**: The layout feels very safe and generic. The centered card with a border on a gray background is a standard default pattern. The Verify Email page relies on a large circular Material Symbol (`mark_email_read`) as a filler illustration, which is a common "AI slop" or generic template trope when custom assets are missing. The design lacks the confident "Restrained utility" of the DistillLearn brand described in `DESIGN.md`.

**Deterministic scan**: Clean. The CLI detector found zero known anti-patterns or slop class names in the codebase.

#### Overall Impression
The authentication flow is functionally robust and well-structured, but visually it feels like a standard boilerplate rather than the gateway to a "Scholarly Workbench". The biggest opportunity is to inject the brand's quiet, disciplined personality and improve inline error handling.

#### What's Working
- **OTP Input UX**: The 6-digit input on `VerifyEmailPage` handles focus management and paste events beautifully, greatly reducing friction.
- **Consistent Component Usage**: Forms rely entirely on the design system (`Input`, `PrimaryButton`, `Checkbox`), keeping the code clean.
- **Clear Hierarchy**: The typography scale clearly separates the brand name, page intent, and form fields.

#### Priority Issues
- **[P1] Form Error Recovery**: Relying solely on `toast` for authentication errors (wrong password, taken email) forces the user's eyes away from the form.
  - **Why it matters**: Users miss the context of the error when it's disconnected from the field they just typed in.
  - **Fix**: Implement inline error states for the `Input` component to display validation and API errors directly beneath the relevant field.
  - **Suggested command**: `$impeccable clarify`
- **[P2] Visual Character & Filler UI**: The Verify Email page uses a large circled material icon as a hero graphic, which feels like a generic template placeholder. The overall centered cards are safe but lack the "Scholarly" identity.
  - **Why it matters**: Authentication is the first impression. A generic login page sets a low expectation for the product.
  - **Fix**: Remove the oversized icon. Redesign the layout to be more editorial or asymmetrical, utilizing the deep indigo brand color to create a more grounded, premium feel.
  - **Suggested command**: `$impeccable delight`
- **[P2] Missing Error Prevention on Register**: Password rules ("Must be at least 8 characters long") are static text.
  - **Why it matters**: Users don't know if they've met the criteria until they hit submit and potentially face an error.
  - **Fix**: Add a dynamic checklist or strength meter that updates in real-time as the user types.
  - **Suggested command**: `$impeccable shape`

#### Persona Red Flags
**Alex (Power User)**:
- No keyboard shortcut (like `Enter`) explicitly highlighted for form submission, though native form behavior might handle it.
- No SSO (Google/GitHub) options; forced to use email/password for every login.

**Jordan (First-Timer)**:
- If an email is mistyped during registration, they arrive at the Verify Email page with no obvious way to go back and fix the typo other than the "Back to Login" link, which feels like starting over.
- Password requirements aren't validated visually while typing.

#### Minor Observations
- The "Remember me" checkbox on the login page lacks surrounding padding to make the hit area more comfortable.
- The `returnTo` logic is sound, but passing it through the URL on every step (`/register`, `/verify-email`) can get messy if the user shares the link.

#### Questions to Consider
- "What if the authentication flow wasn't just a centered card, but a split-screen design featuring the deep scholarly indigo on one side?"
- "Could we handle errors more elegantly than a generic toast notification?"
