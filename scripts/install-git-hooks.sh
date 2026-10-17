#!/bin/sh
# Points git at the version-controlled hooks in .githooks/. Run automatically by `pnpm install` (prepare).
# Worktrees share the main repo's config, so one install covers all checkouts.

set -e
cd "$(dirname "$0")/.."

# Not a git checkout (e.g. a deployed copy or a tarball): nothing to do.
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

current=$(git config core.hooksPath || true)
if [ "$current" != ".githooks" ]; then
  git config core.hooksPath .githooks
  echo "git hooks: core.hooksPath set to .githooks"
fi
chmod +x .githooks/* 2>/dev/null || true
