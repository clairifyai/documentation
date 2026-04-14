---
name: release-markdown
description: Outputs the release notes for a Clairify version as a clean markdown block
---

The user wants the release notes in markdown format. The version number is: $ARGUMENTS

Follow these steps:

1. Read the release notes file at `docs/release-notes/rn-$ARGUMENTS.md` (remove dots from the version number, e.g. 3.2.0 → rn-320.md).

2. Output the file contents as a fenced markdown code block so the user can easily copy and paste it.
