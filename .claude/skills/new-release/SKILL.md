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
4. Update `mkdocs.yml` to add the new release notes file at the top of the "Release Notes" nav section.
5. Run `conda run -n docs mkdocs serve` in the background so the user can preview the changes at http://127.0.0.1:8000.
6. Tell the user the site is ready to preview and ask if they'd like to make any changes.
