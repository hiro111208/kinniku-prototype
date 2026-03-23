# Markdown content “disappears” on save (Cursor / VS Code)

Workspace settings in [`.vscode/settings.json`](../.vscode/settings.json) turn off format-on-save and common fix-on-save actions **for Markdown only**. If the problem continues, it is usually **user-level settings** or an **extension** that still runs on save.

## 1. Check **User** settings (not only Workspace)

Open **Settings (JSON)** (`Cmd+,` → open JSON icon, or “Preferences: Open User Settings (JSON)”).

Look for and temporarily disable:

- `"editor.formatOnSave": true` — set to `false` globally to test, or ensure nothing forces Markdown formatting.
- `"editor.codeActionsOnSave"` — if you have `"source.fixAll": true` or similar, it can run tools that mis-handle `.md`.

## 2. Find the default formatter for Markdown

With a `.md` file focused:

1. `Cmd+Shift+P` → **Format Document With…**
2. **Configure Default Formatter…**
3. If something other than “None” or Prettier is selected, pick **None** or turn off format on save for Markdown (already done in this repo’s workspace settings).

## 3. Extension isolation

Disable extensions that touch Markdown, one at a time (especially **Markdownlint**, **Prettier**, **ESLint** if it’s configured for MD, **Cursor**-related formatters):

- `Cmd+Shift+X` → disable an extension → reload window → save a `.md` file again.

## 4. Strong test: open `.md` as Plain Text

Add this to **User** or **Workspace** `settings.json` temporarily:

```json
"files.associations": {
  "*.md": "plaintext"
}
```

If saving is stable, a Markdown-specific extension or language feature was the cause. You can narrow down which extension by re-enabling associations to `"markdown"` and bisecting extensions.

## 5. Cursor-specific

- **Developer: Reload Window**
- Temporarily disable **Cursor Tab** / inline completions for the affected file type (Cursor settings).
- Confirm you are not using a shortcut that runs **Apply** or **AI edit** on the whole file instead of ordinary save.

## 6. Confirm what is on disk

After a “disappearing” save, run in a terminal:

```bash
wc -l sprints/sprint_01.md && head -5 sprints/sprint_01.md
```

If the file on disk is full but the editor shows one line, it is likely an **editor display / tab sync** bug—reload the window or close and reopen the file.
