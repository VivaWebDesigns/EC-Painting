# Codex Working Rules

These rules apply to every Codex session in this repository.

## Git Hygiene Is Mandatory

- Inspect the worktree before making changes with `git status --short`.
- Treat existing dirty work as important context. Do not overwrite or revert it unless the user explicitly asks.
- Before ending any task, inspect the worktree again.
- The worktree must not be left dirty. Stage, commit, and push all intended changes unless the user explicitly says not to commit or not to push.
- If unrelated dirty work is already present, identify it, preserve it, and ask or make a separate commit rather than leaving it uncommitted.
- Run `npm run git:ensure-clean` after committing to verify the tree is clean.

## Commit And Push Default

- Any time Codex changes tracked files or adds files, commit the work before ending the turn.
- Push the current branch after committing.
- If no branch exists for the work, create a `codex/` branch before committing.
- Only skip commit or push when the user explicitly instructs Codex not to do it.

## Verification

- For code changes, run the relevant checks before committing. At minimum, run `npm run check` when TypeScript code changes.
- For frontend or build-impacting changes, run `npm run build`.
- Report any verification command that could not be run.

## Local Guardrail

- This repo uses `.githooks/pre-push` to block pushes when the worktree is dirty.
- If hooks are not installed in a clone, run `npm run git:install-hooks`.
