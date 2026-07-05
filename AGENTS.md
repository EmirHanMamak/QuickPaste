# QuickPaste Agent Instructions

These instructions apply to the entire project.

QuickPaste is a Windows-style Tauri desktop application built with vanilla HTML, CSS, JavaScript, generated Tailwind utilities, and Rust/Tauri. Treat it as a compact desktop productivity tool, not a marketing website.

## Required Local Skills for UI Work

Always use these project-local skills for interface changes:

- `.codex/skills/desktop-ui-ux/SKILL.md`
- `.codex/skills/design-system-guardian/SKILL.md`
- `.codex/skills/visual-ui-review/SKILL.md`

Use `desktop-ui-ux` before designing or implementing UI behavior/layout.
Use `design-system-guardian` before adding or changing styles.
Use `visual-ui-review` after meaningful UI changes when tooling is available.

## Project Architecture

- Main application shell: `src/index.html`
- Main UI behavior: `src/main.js`
- Shared UI/theme helpers: `src/features.js`
- Text Expansion UI: `src/text-expansion-panel.js`
- Welcome window: `src/welcome.html`, `src/welcome.js`
- Suggestions popup: `src/suggestions.html`, `src/suggestions.js`
- Generated Tailwind CSS: `src/assets/tailwind.css`
- Tailwind config: `tailwind.config.js`
- Tauri config and Rust backend: `src-tauri/`
- Screen/component inventory: `tasarim.md`

## General Rules

- Preserve existing functionality and application architecture unless explicitly asked to change it.
- Before implementing, inspect existing components, styles, tokens, and nearby patterns.
- Reuse existing patterns before creating new ones.
- Keep the interface desktop-app focused, fast, readable, compact, and keyboard-friendly.
- Avoid unnecessary dependencies and heavy UI libraries unless they provide a clear architectural benefit.
- Keep CSS maintainable and component-scoped where appropriate.
- Prefer semantic HTML and accessible labels.
- Do not break global shortcuts, paste behavior, text expansion behavior, window focus behavior, or Tauri window behavior during UI work.

## Design System Rules

- Prefer existing `--qp-*` theme tokens and the `applyTheme()` path in `src/features.js`.
- Do not add random hex colors for new UI.
- Do not add arbitrary spacing, border radius, shadow, or z-index values without checking existing patterns.
- Extend the centralized token system when a new reusable visual value is needed.
- Keep dark mode and light mode behavior consistent.
- Test accent color behavior when changing primary/selected/focus UI.
- Prefer reusable classes/components over page-specific duplicated CSS.

If a broad token cleanup is requested, migrate gradually toward:

- `--color-*`
- `--space-*`
- `--radius-*`
- `--shadow-*`
- `--font-*`
- `--z-*`
- `--transition-*`

Preserve existing `--qp-*` compatibility while migrating.

## Interactive Component Requirements

For every new interactive component, include relevant behavior for:

- Hover
- Focus-visible
- Active/pressed
- Disabled
- Loading
- Empty
- Error
- Selected/current

Inputs must have labels or accessible labels. Icon-only buttons must have `title` and/or `aria-label`.

## Responsive Rules

- The main window defaults to `500x800` and can shrink to about `370x480`; layouts must remain usable there.
- Avoid horizontal overflow in normal app screens.
- Split layouts must collapse before content clips.
- Dialogs, popups, context menus, and command palettes must stay inside the viewport.
- Test both narrow and wider window sizes for changed screens.

## Visual Review Rules

After every meaningful UI change:

- Run the app or inspect the affected HTML visually when possible.
- Check for overflow, clipped text, poor spacing, alignment issues, low contrast, inconsistent typography, missing states, and broken dark/light theme behavior.
- Make at least one refinement pass after visual inspection if an issue is found.
- Do not claim UI work is complete until visual review has been done when tooling is available.
- If tooling is unavailable, state that clearly and list the remaining manual checks.

## Verification Guidance

- For JavaScript changes, run `node --check` on changed JS files when useful.
- If Tailwind input/config changes, run `npm run css:build`.
- If Tauri/Rust code changes, run `cargo check --manifest-path src-tauri/Cargo.toml`.
- For UI-only documentation or skill changes, no application build is required unless behavior files were changed.

