# Tauri + Vanilla

This template should help get you started developing with Tauri in vanilla HTML, CSS and Javascript.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
npm run tauri dev

Developer notes:

- Run Rust lint & tests locally:
  - cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings
  - cargo test --manifest-path src-tauri/Cargo.toml

- Run frontend CSS build (Windows):
  - npm run css:build

- Tests use a temporary app dir when QUICKPASTE_APP_DIR is set. Example:
  - QUICKPASTE_APP_DIR=./tmp cargo test --manifest-path src-tauri/Cargo.toml

CI: .github/workflows/ci.yml runs clippy and tests on push/PR for linux/windows and builds frontend CSS on Windows.

Reproduction & verification

- Missing tray/menu icon panic
  - Reproduce: remove or rename src-tauri/icons/icon.* then run `npm run tauri dev`. Previously the app could panic due to unwrap on tray/menu icon creation; now setup logs an error and returns gracefully.
  - Verify: watch stdout for lines starting with `[QuickPaste] Failed to create tray menu item` or `[QuickPaste] No default window icon available for tray` and confirm no application panic.

- Clipboard write failures
  - Reproduce: hold the clipboard open in another app or simulate clipboard errors, then trigger copy via UI or `copy_only` / `copy_and_paste` IPC.
  - Verify: look for logs `[QuickPaste] Clipboard set_text failed (attempt N)` and either a success message or a final failure message showing attempts.

- Keyboard hook / input injection
  - Reproduce: define a snippet with a trigger and type it into a text editor. Previously SendInput/backspace injection could fail silently or cause issues.
  - Verify: check logs for SendInput/backspace injection errors such as `[QuickPaste] send_ctrl_v: SendInput failed` or `[QuickPaste] send_backspaces: SendInput failed`.

- Run tests & lint locally
  - cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings
  - cargo test --manifest-path src-tauri/Cargo.toml

- Run tests with a temporary app dir
  - QUICKPASTE_APP_DIR=./tmp cargo test --manifest-path src-tauri/Cargo.toml

Change summary

- Fixed clippy warnings and hardened Mutex handling to avoid unwrap poison panics
- Protected tray/menu creation from panics and handled missing icons gracefully
- Added clipboard retry with exponential backoff and detailed logging
- Improved keyboard hook robustness; added SendInput error logging
- Added CI workflow (.github/workflows/ci.yml) to run clippy/tests and build frontend CSS on Windows


