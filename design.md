# Solare — Nikolas Type

## Overview

**Product:** Solare — Nikolas Type
**URL:** https://casadisolare.com/
**Surface type:** marketing
**Audience:** Business decision-makers and potential customers
**Brand character:** Conversion-focused marketing presence with a balanced color system and a complementary two-font typographic system.

> **Note:** Surface detection confidence is low. Verify the inferred audience and brand context before relying on this file.

### Design Principles

- Consistency over novelty — reuse existing patterns before inventing new ones.
- Token-driven — every visual decision references a token, not a magic number.
- Accessible by default — compliance is a baseline, not a feature.

## Colors

| Token | Value | Role |
|-------|-------|------|
| color-5 | `#FFFFFF` | Background |
| color-4 | `#ECE4D5` | Surface |
| color-1 | `#000000` | Text Primary |
| color-2 | `#563E3B` | Text Primary |
| color-3 | `#FFAF37` | Accent |

## Typography

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

## Spacing

**Base unit:** 4px

`space-1: 6px` · `space-2: 10px` · `space-3: 11px` · `space-4: 13px` · `space-5: 15px` · `space-6: 21px` · `space-7: 32px` · `space-8: 64px` · `space-9: 103px` · `space-10: 321px` · `space-11: 385px` · `space-12: 962px`

## Shapes

**Border radius:** `radius-full: 9999px`

## Elevation

_None detected._

## Motion

- **duration-fast:** `all`
- **duration-fast:** `none`
- **duration-slow:** `opacity 0.5s ease-out, color 0.5s ease-out`
- **duration-slow:** `stroke 0.5s ease-out`
- **duration-slow:** `opacity 0.5s ease-out, fill 0.5s ease-out`
- **duration-slow:** `transform 0.75s cubic-bezier(0.19, 1, 0.22, 1)`
- **duration-slow:** `clip-path 0.75s cubic-bezier(0.19, 1, 0.22, 1), -webkit-clip-path 0.75s cubic-bezier(0.19, 1, 0.22, 1)`
- **duration-slow:** `clip-path 0.75s cubic-bezier(0.19, 1, 0.22, 1), transform 0.75s cubic-bezier(0.19, 1, 0.22, 1), -webkit-clip-path 0.75s cubic-bezier(0.19, 1, 0.22, 1)`
- **duration-slow:** `transform 0.75s cubic-bezier(0.19, 1, 0.22, 1) 0.1s`

## Components

- **Buttons:** 9 detected
- **Links:** 16 detected
- **Inputs:** 6 detected
- **Navigation:** 2 elements
- **Lists:** 4 detected
- **Forms:** 1 detected
- **Images:** 52 detected

## Do's and Don'ts

### Do

- Reference tokens by name, not raw values — agents and developers should use `color.text.primary`, not `#171717`.
- Define all interactive states: default, hover, focus-visible, active, disabled.
- Use the spacing scale for all padding, margin, and gap values.
- Write content in sentence case. Reserve ALL CAPS for acronyms only.
- Test every component at the smallest and largest breakpoint before shipping.

### Don't

- Do not introduce colors outside the extracted palette.
- Do not use arbitrary spacing values — stick to the scale.
- Do not mix border-radius values. Pin to the detected set (9999px).
- Do not use full-uppercase text for body or paragraph content.
- Do not nest interactive elements (e.g. buttons inside links).
- Do not ship components without defining hover, focus-visible, and disabled states.

## Writing Tone

Concise, confident, implementation-focused. Avoid filler preambles.

## Authoring Workflow

When creating or updating a component guideline for this system, follow this sequence:

1. **State the intent** — one sentence on what the component does and why it exists.
2. **Map tokens** — list every color, spacing, typography, and radius token the component uses. No raw values.
3. **Define anatomy** — break the component into named parts (container, label, icon, etc.) with their token assignments.
4. **Specify states** — document every state: default, hover, focus-visible, active, disabled, loading, error, empty.
5. **Describe interactions** — keyboard, pointer, and touch behavior, including edge cases (long content, overflow, truncation).
6. **Add accessibility criteria** — write testable pass/fail checks (e.g. "focus ring must be visible at 3:1 contrast").
7. **List anti-patterns** — concrete examples of misuse with a brief explanation of why each is wrong.
8. **Close with a QA checklist** — a mechanical list of verifiable items (see Definition of Done below).

## Required Output Structure

Every component guideline produced from this system must contain these sections, in order:

1. Overview — purpose, when to use, when not to use.
2. Tokens and foundations — all referenced tokens from the tables above.
3. Anatomy and variants — named parts, variant matrix, responsive behavior.
4. States and interactions — full state table, keyboard/pointer/touch behavior.
5. Accessibility — ARIA attributes, contrast requirements, focus management, screen reader behavior.
6. Content guidelines — copy length, tone, capitalisation, placeholder text rules.
7. Anti-patterns — explicit examples of what not to build, with reasoning.

## Component Requirements

Every component built against this system must:

- Reference only tokens defined in the tables above — no hardcoded hex, px, or font values.
- Define all interactive states: default, hover, focus-visible, active, disabled, loading, error.
- Specify responsive behavior at the smallest and largest supported breakpoint.
- Handle edge cases: empty state, overflow / truncation, maximum content length.
- Include keyboard navigation (Tab, Enter, Escape, Arrow keys where applicable).
- Document ARIA roles, labels, and live-region behavior where relevant.
- Include known page component density: - **Buttons:** 9 detected
- **Links:** 16 detected
- **Inputs:** 6 detected
- **Navigation:** 2 elements
- **Lists:** 4 detected
- **Forms:** 1 detected
- **Images:** 52 detected

## Definition of Done

A component is not complete until every item below is checked:

- Renders correctly in its default state (smoke test).
- All states documented and visually verified (hover, focus, disabled, loading, error, empty).
- All visual values use design tokens — zero hardcoded values.
- Keyboard navigation works without a pointer.
- No critical accessibility violations (contrast, ARIA, focus order).
- Tested at smallest and largest breakpoint.
- Anti-patterns section lists at least one concrete misuse example.
- Documentation covers purpose, usage, props/API, and limitations.
