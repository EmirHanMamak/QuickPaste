# Desktop UI/UX Skill

Use this skill whenever you create, edit, review, or refactor UI for this project.

This project is a Windows-style Tauri desktop application built with vanilla HTML, CSS, JavaScript, generated Tailwind utilities, and Rust/Tauri commands. It is not a marketing website. UI work must feel like a polished desktop productivity tool: compact, fast, readable, keyboard-friendly, and consistent.

## Project Context

- Main app shell: `src/index.html`
- Main UI behavior: `src/main.js`
- Shared UI helpers and theme code: `src/features.js`
- Text Expansion panel: `src/text-expansion-panel.js`
- Welcome window: `src/welcome.html`, `src/welcome.js`
- Suggestions popup: `src/suggestions.html`, `src/suggestions.js`
- Theme utilities use `--qp-*` CSS variables and `applyTheme()`.
- Tailwind utilities are generated from `tailwind.config.js` into `src/assets/tailwind.css`.
- Existing documentation for screens and components: `tasarim.md`

## Desktop Product Principles

- Design for a compact desktop workflow, not a landing page.
- Prefer dense but breathable layouts: small controls, clear grouping, and enough whitespace to scan quickly.
- Keep primary actions visible but avoid giant cards, huge hero headings, oversized CTAs, and decorative noise.
- Preserve speed: avoid heavy animations, expensive layout effects, or large UI dependencies.
- Every screen should work well at the default `500x800` main window size and remain usable when resized down to the configured minimum.
- Prefer predictable Windows desktop patterns: title/header controls, list/detail layouts, settings cards, command palette, context menus, dialogs, toasts, and compact forms.

## Required Interaction States

For every new or changed interactive component, include relevant states:

- Default
- Hover
- Focus-visible
- Active/pressed
- Disabled
- Loading or busy
- Empty
- Error
- Selected/current

If a state does not apply, keep the implementation simple, but do not leave common controls without focus-visible or disabled behavior.

## Keyboard and Accessibility Rules

- Preserve keyboard navigation in lists, dialogs, command palettes, menus, forms, and settings.
- Use semantic HTML first: `button`, `input`, `select`, `textarea`, `label`, `section`, `header`, `footer`, `dialog`-like overlays where appropriate.
- Do not use clickable `div` elements when a `button` is correct.
- Every input must have a visible label or an accessible label.
- Icon-only buttons need `title` and/or `aria-label`.
- Focus-visible states must be obvious in both dark and light mode.
- Modal/overlay work should preserve Escape-to-close where already supported and avoid trapping users.
- Do not remove existing shortcut, hotkey, paste, expansion, or focus behavior while changing visuals.

## Layout Rules

- Use desktop-app layouts: toolbar, split panel, list/detail, cards, settings groups, compact tables/lists.
- Do not create marketing-style hero sections, oversized headings, huge gradients, or scroll-heavy landing-page sections.
- Keep headings modest. In this app, screen titles should usually be `text-lg` to `text-2xl`, not huge display typography.
- Avoid excessive glassmorphism. Subtle translucency is acceptable only where it already exists, such as overlays or transparent Tauri windows.
- Avoid excessive gradients. Use tokenized surfaces and borders as the base visual language.
- Always check the narrow window case. For split grids, collapse to one column before text clips or controls overflow.
- Avoid horizontal scrolling in normal app screens unless the component is explicitly a table or code preview.

## Component Guidance

### Header Navigation

- Keep page order aligned with product navigation: Main, Text Expansion, Dashboard, Settings.
- Keep window actions visually distinct from page navigation where possible.
- Active page buttons should have a clear selected state using theme tokens.

### Snippet Lists

- Cards should remain compact and scannable.
- Do not show too many badges with equal emphasis.
- Preserve copy, quick look, edit, drag, pin, shortcut, trigger, and selection behavior.
- Empty states should explain what happened and offer the next useful action.

### Forms and Dialogs

- Use aligned labels and compact inputs.
- Keep destructive actions visually separated.
- Keep dialog footers sticky or clearly visible when forms are long.
- Validate visually with inline error text, not only toast messages.

### Settings Pages

- Group settings into clear sections.
- Use compact cards with labels, descriptions, and controls aligned consistently.
- Toggles should always have explanatory text.

### Command Palette and Menus

- Keep them keyboard-first.
- Selection state must be visible.
- Keep descriptions short and readable.
- Context menus should be compact and positioned inside the viewport.

### Toasts

- Toasts should be short and non-blocking.
- Use success, info, warning, and error colors from tokens.
- Avoid using toasts as the only feedback for form validation when inline errors are better.

## Dark and Light Mode

- New UI must work in both dark and light mode when the app supports it.
- Do not hardcode dark-only colors.
- Use existing tokens and Tailwind theme bridge classes where possible.
- Verify contrast for text, icons, borders, disabled states, and focus rings.

## Implementation Workflow

1. Read `tasarim.md` for the affected screen/component.
2. Inspect existing HTML, CSS, and JS around the target area.
3. Reuse existing component patterns before inventing new ones.
4. Add semantic markup and tokenized styles.
5. Include interaction states.
6. Check default `500x800`, narrow, and wider layouts.
7. Run visual review when tooling is available.

## Avoid

- Generic SaaS landing page design.
- Huge headings and oversized cards.
- Random gradients.
- Excessive blur/glass effects.
- Random hex colors.
- Arbitrary one-off spacing values.
- Duplicate button/card/input styles.
- New UI libraries unless there is a clear architectural benefit.
- Breaking keyboard, paste, text expansion, or global hook behavior for visual changes.

