---
name: DistillLearn
description: A high-performance learning environment for serious study.
colors:
  primary: "#1a146b"
  primary-container: "#312e81"
  secondary: "#006a61"
  secondary-container: "#86f2e4"
  neutral-bg: "#f8f9ff"
  neutral-text: "#0d1c2e"
  surface: "#ffffff"
  border: "#e2e8f0"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
rounded:
  sm: "2px"
  md: "4px"
  lg: "8px"
  xl: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-container}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
---

# Design System: DistillLearn

## 1. Overview

**Creative North Star: "The Scholar's Workbench"**

DistillLearn's visual identity is built to replicate the clean, quiet concentration of a scholar's physical workstation. It is a highly focused, professional environment where design is secondary to the study tasks at hand. Layouts are flat and structured, information density is balanced, and visual styling is kept understated to ensure zero distractions and low cognitive overhead during long recall/review sessions.

**Key Characteristics:**
- **Restrained utility**: Elements are functional, clear, and uniform, avoiding decorative widgets.
- **High-contrast readability**: Crisp type pairing and strict compliance with WCAG AA contrast rules ensure readable material under any lighting conditions.
- **Zero-distraction workspace**: No neon gradients, no rounded cartoon bubbles, and no unnecessary animations that interrupt the student's flow.

## 2. Colors

The color palette is quiet and structured, utilizing dark scholarly indigos for branding and primary actions, balanced by cool alabaster backgrounds and muted teal accents.

### Primary
- **Deep Scholarly Indigo** (#1a146b): Used for key brand moments, headers, and active state highlights.
- **Midnight Indigo** (#312e81): Used for primary action buttons, focused selectors, and high-priority containers.

### Secondary
- **Deep Muted Teal** (#006a61): Used for progress indicators, secondary action buttons, and correct/success elements.
- **Light Mint** (#86f2e4): Used for success and completed badge containers.

### Neutral
- **Cool Alabaster** (#f8f9ff): The base background color for the application. Low-fatigue slate-white.
- **Midnight Navy** (#0d1c2e): The main ink color for body text, headings, and labels.
- **Border Gray** (#e2e8f0): Used for flat panels, dividing rules, and subtle structural grids.

### Named Rules
**The Rarity of Accent Rule.** The primary accent is used for active state indications, focus highlights, and main call-to-actions only. It must cover less than 10% of any given screen layout.
**The Text Contrast Rule.** Muted text and placeholder labels must achieve a contrast ratio of at least 4.5:1 against the background (do not fade labels into light gray).

## 3. Typography

DistillLearn relies on a single typeface family (Inter) to maintain consistency and a clean tool-like layout.

**Display Font:** Inter, sans-serif
**Body Font:** Inter, sans-serif

**Character:** Standardized sans-serif hierarchy that prioritizes clear horizontal lines, structured text blocks, and legible numerals for review statistics.

### Hierarchy
- **Display** (700, 48px, 1.1): Hero titles and large workspace headings.
- **Headline** (600, 36px, 1.2): Section headings and layout titles.
- **Title** (600, 24px, 1.4): Card titles, modal headers, and topic names.
- **Body** (400, 16px, 1.6): Standard study contents, study guides, and explanations (max line length 65–75ch).
- **Label** (600, 12px, 0.05em, uppercase): Button labels, badges, headers, and small metadata.

### Named Rules
**The Fixed Scale Rule.** Typography sizes are fixed, relying on structural columns to reflow content. Fluid clamp scaling is prohibited in the interface to maintain text block density.
**The Line-Length Rule.** Any block of study text or prose description must be capped at 65–75ch for optimal reading and scanning speed.

## 4. Elevation

The system is flat by default. Depth is communicated via clean borders and tonal container layering (white panels on cool alabaster backgrounds) rather than floating layers and shadows. Shadows are strictly reserved for transient UI elements like active popovers or menus.

### Named Rules
**The Flat-by-Default Rule.** Surfaces and cards are flat at rest, with a border width of exactly 1px. Shadows appear only on transient containers (dropdowns, dialogs) or as a response to interactive hover/focus states.

## 5. Components

All interactive components must have defined hover, active, and focus states.

### Buttons
- **Shape:** Rounded-lg (8px) for standard UI buttons.
- **Primary:** Dark Scholarly Indigo background (#1a146b), white text, padding 10px 16px.
- **Hover / Focus:** Transition to Midnight Indigo (#312e81) background with a subtle border ring outline.
- **Secondary:** Flat container, white background, Border Gray outline (#e2e8f0), padding 10px 16px.

### Cards / Containers
- **Corner Style:** Rounded-xl (12px) for inner containers and small widgets; Rounded-3xl (24px) for page section panels.
- **Background:** White background (#ffffff) resting on Cool Alabaster (#f8f9ff).
- **Border:** 1px solid Border Gray (#e2e8f0).
- **Shadow Strategy:** Subtle outline shadow on hover (max 8px blur, low opacity).

### Inputs / Fields
- **Style:** 1px Border Gray outline (#e2e8f0), white background, 8px radius.
- **Focus:** 1px solid Midnight Indigo border with a subtle focus glow.

### Navigation (Sidebar)
- **Style:** Left-aligned sidebar with a white background, 1px right border, and active links highlighted with a flat background tint (indigo-50).

## 6. Do's and Don'ts

### Do:
- **Do** ensure all text hits a contrast ratio of at least 4.5:1 against its background.
- **Do** maintain a strict 1px border grid to define layout boundaries.
- **Do** use skeleton loading states instead of blocking spinners.
- **Do** respect the 65–75ch readability rule for study content.

### Don't:
- **Don't** use side-stripe borders (e.g. `border-left` or `border-right` greater than 1px) to accent active nav items or cards.
- **Don't** use gradient text overlays or glassmorphic blur panels.
- **Don't** use warm beige/cream colors for the background.
- **Don't** use display fonts for buttons, forms, or metadata labels.
