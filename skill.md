---
name: design-system-solare-nikolas-type
description: >
  Apply the Solare — Nikolas Type design system when building or updating UI.
  Use when creating components, choosing colors or typography,
  or reviewing designs for marketing interfaces.
---

# Solare — Nikolas Type — Design System Skill

## When to Use

- Building new UI components for Solare — Nikolas Type.
- Reviewing or updating existing component styles.
- Choosing colors, typography, or spacing for marketing pages.
- Checking designs against the extracted token set.

## Context

- **Product:** Solare — Nikolas Type — https://casadisolare.com/
- **Surface:** marketing
- **Audience:** Business decision-makers and potential customers
- **Character:** Conversion-focused marketing presence with a balanced color system and a complementary two-font typographic system.

## Tokens

### Colors

| Token | Value | Role |
|-------|-------|------|
| color-5 | `#FFFFFF` | Background |
| color-4 | `#ECE4D5` | Surface |
| color-1 | `#000000` | Text Primary |
| color-2 | `#563E3B` | Text Primary |
| color-3 | `#FFAF37` | Accent |

### Typography

**Font stack:** solare, helvetica-neue

| Level | Size | Usage |
|-------|------|-------|
| text-xs | 5px | Captions, metadata |
| text-sm | 9px | Labels, secondary text |
| text-base | 10px | Body text (default) |
| text-lg | 12px | Subheadings, emphasis |
| text-xl | 15px | Section headings |
| text-2xl | 91px | Section headings |
| text-3xl | 98px | Section headings |

**Weight scale:** 400 · 650 · 700
**Line heights:** 97.6153px · 14.3854px · 20.0368px · 12.9469px · 82.3051px · 12.2019px · 9.24777px · 7.70647px

### Spacing

**Base unit:** 4px

`space-1: 6px` · `space-2: 10px` · `space-3: 11px` · `space-4: 13px` · `space-5: 15px` · `space-6: 21px` · `space-7: 32px` · `space-8: 64px` · `space-9: 103px` · `space-10: 321px` · `space-11: 385px` · `space-12: 962px`

### Shapes

**Border radius:** `radius-full: 9999px`

### Elevation

_None detected._

### Motion

- **duration-fast:** `all`
- **duration-fast:** `none`
- **duration-slow:** `opacity 0.5s ease-out, color 0.5s ease-out`
- **duration-slow:** `stroke 0.5s ease-out`
- **duration-slow:** `opacity 0.5s ease-out, fill 0.5s ease-out`
- **duration-slow:** `transform 0.75s cubic-bezier(0.19, 1, 0.22, 1)`
- **duration-slow:** `clip-path 0.75s cubic-bezier(0.19, 1, 0.22, 1), -webkit-clip-path 0.75s cubic-bezier(0.19, 1, 0.22, 1)`
- **duration-slow:** `clip-path 0.75s cubic-bezier(0.19, 1, 0.22, 1), transform 0.75s cubic-bezier(0.19, 1, 0.22, 1), -webkit-clip-path 0.75s cubic-bezier(0.19, 1, 0.22, 1)`
- **duration-slow:** `transform 0.75s cubic-bezier(0.19, 1, 0.22, 1) 0.1s`

## Component Inventory

- **Buttons:** 9 detected
- **Links:** 16 detected
- **Inputs:** 6 detected
- **Navigation:** 2 elements
- **Lists:** 4 detected
- **Forms:** 1 detected
- **Images:** 52 detected

## Constraints

### Always

- Use tokens from the tables above — do not introduce new values.
- Include hover, focus-visible, and disabled states for interactive elements.
- Follow the 4px spacing grid.
- Meet WCAG 2.2 AA contrast minimums.

### Never

- Do not introduce colors outside the extracted palette.
- Do not use arbitrary spacing values — stick to the scale.
- Do not mix border-radius values. Pin to the detected set (9999px).
- Do not use full-uppercase text for body or paragraph content.
- Do not nest interactive elements (e.g. buttons inside links).
- Do not ship components without defining hover, focus-visible, and disabled states.

## Tone

Concise, confident, implementation-focused. Avoid filler preambles.

## Authoring Workflow

When creating or documenting a component for this system:

1. State intent — one sentence on purpose.
2. Map tokens — list every token the component uses.
3. Define anatomy — named parts with token assignments.
4. Specify states — default, hover, focus-visible, active, disabled, loading, error, empty.
5. Describe interactions — keyboard, pointer, touch, edge cases.
6. Add a11y criteria — testable pass/fail checks.
7. List anti-patterns — concrete misuse examples.
8. Close with the Definition of Done checklist.

## Output Structure

Component guidelines must contain, in order:

1. Overview (purpose, when to use, when not to use)
2. Tokens and foundations
3. Anatomy, variants, responsive behavior
4. States and interactions
5. Accessibility (ARIA, contrast, focus, screen reader)
6. Content guidelines (copy rules, tone)
7. Anti-patterns with reasoning

## Component Requirements

- Reference only tokens from the tables above.
- Define all states: default, hover, focus-visible, active, disabled, loading, error.
- Handle edge cases: empty, overflow, truncation, max content.
- Include keyboard navigation behavior.
- Document ARIA roles and labels.

## Definition of Done

- Default state renders (smoke test).
- All states visually verified.
- Zero hardcoded visual values — tokens only.
- Keyboard navigation works without pointer.
- No critical a11y violations.
- Tested at min and max breakpoint.
- At least one anti-pattern documented.
- Purpose, usage, and limitations documented.
