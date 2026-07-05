# Design System Guardian Skill

Use this skill before and during any UI implementation in this project. Its job is to keep the interface consistent, tokenized, maintainable, and scalable.

## Project Context

This is a vanilla HTML/CSS/JavaScript Tauri app. The current design system is partially centralized:

- Runtime theme tokens are generated in `src/features.js` through `applyTheme()` and `buildThemeTokens()`.
- The current token prefix is mostly `--qp-*`.
- `src/index.html` contains a large inline style block that bridges Tailwind utility classes such as `bg-d-card`, `text-d-text`, and `border-d-border` to `--qp-*` variables.
- `src/style.css` contains many component-level styles.
- `welcome.html` and `suggestions.html` currently define their own local `--qp-*` token subsets.
- Tailwind utilities are configured in `tailwind.config.js` and generated into `src/assets/tailwind.css`.

Before adding UI, inspect the relevant files and existing patterns.

## Required Pre-Implementation Audit

Before changing or adding UI, inspect:

- Existing CSS variables and theme token generation in `src/features.js`.
- Existing inline style bridge in `src/index.html`.
- Existing component styles in `src/style.css`.
- Existing Tailwind token names in `tailwind.config.js`.
- The affected screen/component in `tasarim.md`.
- Nearby component markup and class naming.

Do not add a new visual pattern until you confirm an existing pattern cannot be reused.

## Token Rules

Prefer the existing project tokens first:

- `--qp-bg`
- `--qp-window-bg`
- `--qp-surface`
- `--qp-surface-2`
- `--qp-surface-3`
- `--qp-input-bg`
- `--qp-border`
- `--qp-border-strong`
- `--qp-text`
- `--qp-muted`
- `--qp-muted-soft`
- `--qp-outline`
- `--qp-outline-variant`
- `--qp-shadow`
- `--qp-overlay`
- `--qp-primary`
- `--qp-primary-container`
- `--qp-primary-contrast`
- `--qp-primary-soft`
- `--qp-primary-selected`
- `--qp-focus-ring`
- `--qp-success`
- `--qp-warning`
- `--qp-danger`
- `--qp-info`

If the current token set is insufficient, extend it centrally instead of adding one-off values.

## Preferred Future Token Structure

If a broader token cleanup is requested, migrate gradually toward this scalable structure while preserving existing `--qp-*` aliases:

- `--color-*`
- `--space-*`
- `--radius-*`
- `--shadow-*`
- `--font-*`
- `--z-*`
- `--transition-*`

Suggested mapping direction:

- `--color-bg`
- `--color-surface`
- `--color-surface-raised`
- `--color-surface-input`
- `--color-border`
- `--color-border-strong`
- `--color-text`
- `--color-text-muted`
- `--color-primary`
- `--color-primary-contrast`
- `--color-success`
- `--color-warning`
- `--color-danger`
- `--color-info`
- `--space-1` through `--space-8`
- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-pill`
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-overlay`
- `--font-sans`, `--font-mono`
- `--z-dropdown`, `--z-overlay`, `--z-modal`, `--z-toast`
- `--transition-fast`, `--transition-normal`

Do not perform a broad migration unless the user asks for it. For normal feature work, use current `--qp-*` tokens.

## Hard Rules

- Do not add random hex colors in new UI.
- Do not add arbitrary shadows such as new untracked `box-shadow` values unless tokenized.
- Do not add arbitrary border radii when an existing radius pattern works.
- Do not duplicate button, card, input, dialog, toast, or menu styles.
- Do not scatter theme logic across multiple JavaScript files when it belongs in `src/features.js`.
- Do not make welcome/suggestions/main windows visually diverge unless the difference is intentional and tokenized.
- Do not add page-specific CSS that should be a reusable component class.

## CSS Placement Rules

Use this order of preference:

1. Existing reusable classes or Tailwind utilities already used nearby.
2. Existing component classes in `src/style.css`.
3. Small, targeted additions to the relevant local style block only when the style is truly local.
4. Central token extension in `src/features.js` and style bridge updates when adding theme-wide behavior.

Avoid inline `style` attributes except for dynamic values that are already data-driven, such as chart height or user-selected color preview.

## Naming Rules

- Keep names clear and component-oriented.
- Use existing project naming where possible: `qp-*`, `snippet-*`, `textExpansion*`, `palette-*`, `quick-look-*`.
- Do not mix multiple naming conventions in the same component.
- Prefer names that describe role rather than appearance, for example `settings-card` over `blue-card`.

## Typography Rules

- Use Inter for UI text.
- Use JetBrains Mono for code, triggers, shortcuts, and technical snippets.
- Keep desktop UI text compact.
- Avoid introducing unrelated fonts.
- Do not create giant display headings for app screens.

## Spacing and Density Rules

- Use compact but readable spacing.
- Prefer existing scale patterns: small controls around `px-2`, `px-3`, `py-1`, `py-1.5`, `py-2`; cards around `p-3` or `p-4`.
- Use consistent gaps inside the same component family.
- Avoid arbitrary one-off values unless needed to fix a specific layout edge case.

## Review Checklist

Before finishing UI work, verify:

- All new colors come from tokens or existing utilities bridged to tokens.
- Light and dark mode are considered.
- Focus-visible and disabled states exist where relevant.
- New component styles are reusable or intentionally local.
- No duplicate component pattern was introduced.
- No existing Tauri/window behavior was changed unintentionally.

