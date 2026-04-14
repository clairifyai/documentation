---
name: release-email
description: Generates a release announcement email for a Clairify version
---

The user wants to generate a release announcement email. The version number is: $ARGUMENTS

Follow these steps:

1. Read the release notes file at `docs/release-notes/rn-$ARGUMENTS.md` (remove dots from the version number, e.g. 3.2.0 → rn-320.md).

2. Write a release email in the following style:

   - Opening line: friendly 1-2 sentence intro mentioning the version and what kind of release it is (feature, design, performance, etc.)
   - One section per major feature/improvement — use a **bold heading** followed by 1-2 sentences in plain, friendly language written for executives (not engineers)
   - Close with a brief bug fix summary rolled into one sentence (don't list them individually)
   - Sign off: "As always, we'd love your feedback. Send questions, comments, and feature requests to support@clairify.ai.\n\nBest,\n\nThe Clairify Team"

3. Present the email as a plain text block (no markdown formatting in the output — bold headings are the only formatting used in the actual email).

Tone: warm, concise, non-technical. Written for busy executives who want to know what changed and why it matters to them.
