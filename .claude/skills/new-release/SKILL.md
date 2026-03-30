---
name: new-release
description: Creates release notes for a new version of Clairify
disable-model-invocation: true
---

The user wants to create release notes for a new version. The version number is: $ARGUMENTS

Follow these steps:

1. Ask the user to paste in the release note content.
2. Create a new branch named `release-notes/$ARGUMENTS`.
3. Create a new file at `docs/release-notes/rn-$ARGUMENTS.md` (remove dots from the version number, e.g. 4.0.0 → rn-400.md) using the content provided, formatted to match the style of `docs/release-notes/rn-300.md`.
4. Update `mkdocs-base.yml` to add the new release notes file at the top of the "Release Notes" nav section.
5. Stage both files with `git add` so the `git-revision-date-localized` plugin can read them (it requires files to be tracked by git, otherwise the build will fail).
6. Restart the local dev server so the nav changes are picked up (config changes are not hot-reloaded): kill any process on port 8000, then run `conda run --no-capture-output -n docs mkdocs serve` in the background. Wait for the "Serving on http://127.0.0.1:8000" line before proceeding.
7. Tell the user the site is ready to preview and ask if they'd like to make any changes.
