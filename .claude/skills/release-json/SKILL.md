---
name: release-json
description: Generates a structured JSON file from Clairify release notes
---

The user wants to generate a JSON version of release notes. The version number is: $ARGUMENTS

Follow these steps:

1. Read the release notes file at `docs/release-notes/rn-$ARGUMENTS.md` (remove dots from the version number, e.g. 3.2.0 → rn-320.md).

2. Parse each section into a JSON entry with the following schema:

   ```json
   {
     "version": "x.x.x",
     "release_notes": [
       {
         "type": "feature | fix",
         "title": "Section heading",
         "description": "Section body text"
       }
     ]
   }
   ```

   Rules for `type`:
   - If the entry is prefaced with "Fixed" (e.g., in a bug fixes list), set type to `"fix"`
   - Everything else is `"feature"`

3. Write the JSON to `docs/release-notes/rn-json/rn-$ARGUMENTS.json` (remove dots from the version number, e.g. 3.2.0 → rn-320.json). Create the `rn-json` directory if it doesn't exist.

4. Show the user the generated JSON and the file path.
