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
- Work directly on `main` unless the user explicitly says otherwise.
- Push `main` after committing.
- Do not create feature branches for normal Codex work in this repo.
- Only skip commit, push, or direct-to-`main` work when the user explicitly instructs Codex not to do it.

## Verification

- For code changes, run the relevant checks before committing. At minimum, run `npm run check` when TypeScript code changes.
- For frontend or build-impacting changes, run `npm run build`.
- Report any verification command that could not be run.

## Railway Database Commands

- For DB-backed scripts in this project, run the command inside the Railway service:
  `railway ssh --service EC-Painting -- <command>`.
- Do not use plain local commands for scripts that need `DATABASE_URL`; the local shell does not have it.
- Do not use `railway run` for local DB-backed scripts that connect to Postgres. It injects `DATABASE_URL`, but the value uses Railway's private `postgres.railway.internal` hostname, which only resolves inside Railway.

## Project Scope Notes

- Do not bring up domain-name routing, current-domain status, or temporary domain issues unless the user explicitly asks about them.
- The future production domain is `ecpaintingcharlotte.com`. Treat other domains as out of scope for normal project work.

## Local Guardrail

- This repo uses `.githooks/pre-push` to block pushes when the worktree is dirty.
- If hooks are not installed in a clone, run `npm run git:install-hooks`.
