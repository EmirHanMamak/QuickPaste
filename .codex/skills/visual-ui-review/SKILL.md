# Visual UI Review Skill

Use this skill after every meaningful UI change in this project.

Do not claim UI work is complete until a visual review has been performed when tooling is available. If tooling is unavailable, state that clearly and list the manual checks that remain.

## Project Context

This is a Tauri desktop app with multiple windows:

- Main app: `src/index.html`
- Welcome window: `src/welcome.html`
- Suggestions popup: `src/suggestions.html`
- Launcher window: configured through Tauri and likely shares the main app shell in launcher mode.

The default main window is `500x800` with a minimum of `370x480`. UI review must pay special attention to compact desktop sizing, resize behavior, scroll containment, and clipped text.

## When to Run

Run visual review after changes to:

- Layout
- Header navigation
- Snippet cards/lists
- Forms
- Dialogs
- Text Expansion panel
- Dashboard
- Settings
- Welcome screen
- Suggestions popup
- Theme tokens
- Responsive CSS
- Any interactive component state

## Preferred Review Workflow

1. Run static checks appropriate to the files changed.
   - For JavaScript changes, use `node --check` on changed JS files when useful.
   - For CSS/Tailwind changes, run the CSS build if Tailwind input/config changed.
   - For Tauri/Rust changes, run `cargo check --manifest-path src-tauri/Cargo.toml` when backend or window wiring changed.
2. Start the app if possible.
   - Prefer `npm run tauri dev` or the repo's existing Tauri command.
   - If startup is too slow or blocked, inspect the HTML with available browser tooling where possible.
3. Capture or inspect the affected screen visually using available screenshot, browser, computer-use, or automation tools.
4. Check the visual review criteria below.
5. Make at least one refinement pass after inspection.
6. Re-check the affected area.

## Visual Review Criteria

Check for:

- Horizontal overflow
- Content clipped by panel edges
- Broken scroll containers
- Header/footer overlap
- Misaligned buttons or icons
- Bad spacing density
- Inconsistent card heights
- Inconsistent typography
- Text too small or too large for desktop use
- Low contrast text, borders, icons, and disabled states
- Missing hover states
- Missing focus-visible states
- Broken selected/current state
- Broken disabled/loading state
- Empty states that look abandoned
- Error states that are invisible or only toast-based
- Dark mode problems
- Light mode problems
- Accent color not propagating
- Dialogs that do not fit the viewport
- Context menus positioned off-screen
- Suggestions popup clipping or appearing too far from target
- Welcome screen controls that cannot be typed into
- Text Expansion form/list squeezing into each other
- Dashboard cards breaking on narrow widths

## Required Screen Sizes

For main app UI, review at minimum:

- Default: `500x800`
- Narrow/minimum-like: around `370x480`
- Wider desktop: around `900x700` if the layout supports it

For Welcome:

- Default: `1200x900`
- Minimum-like: around `900x700`

For Suggestions:

- Default: `420x280`
- Minimum-like: around `320x220`

## Interaction Review

For interactive changes, verify relevant interactions:

- Hover
- Focus-visible via keyboard
- Pressed/active state
- Disabled state
- Empty state
- Error state
- Loading/busy state
- Escape behavior for overlays
- Keyboard navigation in lists, menus, dialogs, and command palette

## Refinement Pass Requirement

After visual inspection, make at least one improvement pass when any issue is found. Examples:

- Adjust spacing
- Fix overflow
- Improve contrast
- Add focus-visible state
- Align icons/text
- Improve responsive collapse
- Replace hardcoded color with token
- Reduce visual noise

If no issue is found, state that no refinement was needed after inspection.

## Reporting

Final UI work reports should include:

- What was visually reviewed
- Which sizes/windows were checked
- Any refinements made after review
- Any remaining visual risks if tooling was unavailable

