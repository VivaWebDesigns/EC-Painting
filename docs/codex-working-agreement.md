# Codex Working Agreement

Codex should never leave this repository with uncommitted work unless explicitly told to do so.

## Default End-Of-Task Checklist

1. Run `git status --short`.
2. Verify the change with the relevant command:
   - `npm run check` for TypeScript changes.
   - `npm run build` for frontend, routing, renderer, seed, or production-impacting changes.
3. Stage intended changes.
4. Commit with a clear message.
5. Confirm `npm run git:ensure-clean` passes.
6. Push the current branch.
7. Confirm `git status --short` is empty.

## Exceptions

Only skip commit or push if the user explicitly says not to commit, not to push, or to leave the worktree as-is.

If unrelated work is present, Codex should inspect it and avoid overwriting it. The preferred outcome is still a clean worktree, using separate commits if needed.

## Guardrail

Run this once in each clone:

```sh
npm run git:install-hooks
```

The pre-push hook blocks pushes when the working tree has staged, unstaged, or untracked changes.
