---
name: commit-msg
description: Generate a conventional commit message from staged changes and commit them. Use when the user says "write a commit message", "generate a commit", "commit my changes", or runs /commit-msg.
---

# commit-msg

Generate a conventional-commit message from the currently staged changes and create the commit.

## Workflow

1. **Check for staged changes.** Run `git diff --staged --stat`. If there is no staged output, STOP and tell the user to stage their changes first (e.g. `git add <files>`). Do not commit anything.

2. **Read the staged diff.** Run `git diff --staged` and analyze what actually changed.

3. **Generate the commit message** in exactly this format:

   ```
   type(scope): short subject

   - bullet of what changed
   - bullet of why
   ```

   - **type** must be one of: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`.
   - **scope** is a short area of the codebase (e.g. a directory, module, or feature). Omit the parentheses entirely if no clear scope applies: `type: short subject`.
   - **subject** must be under 60 characters, imperative mood, no trailing period.
   - **body bullets** are optional but encouraged: one bullet for *what* changed, one for *why*. Add more only if genuinely needed.

4. **Commit.** Run `git commit` with the generated message (use multiple `-m` flags or a here-doc to preserve the blank line and bullets).

## Rules

- NEVER include a `Co-Authored-By` trailer or any other trailer.
- Do not run `git add` — only commit what is already staged.
- Pick the `type` from the nature of the diff, not from the user's wording.
