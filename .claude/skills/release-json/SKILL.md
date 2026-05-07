---
name: release-json
description: Generates a structured JSON file from Clairify release notes
---

The user wants to generate a JSON version of release notes. The version number is: $ARGUMENTS

Follow these steps:

1. Read the release notes file at `docs/release-notes/rn-$ARGUMENTS.md` (remove dots from the version number, e.g. 3.2.0 → rn-320.md).

2. Parse each section into the following schema:

   ```json
   {
     "version": "x.x.x",
     "title": "Short summary of the release theme",
     "type": "release",
     "date": "YYYY-MM-DD",
     "description": "One-sentence overview of what this release covers.",
     "items": {
       "features": [
         {
           "name": "Feature name",
           "details": "Feature description"
         }
       ],
       "fixes": [
         {
           "name": "Fix name",
           "details": "Fix description"
         }
       ],
       "links": [
         {
           "Release Note": "https://docs.clairify.ai/release-notes/rn-XXX/"
         }
       ]
     }
   }
   ```

   Rules:
   - Items prefaced with "Fixed" go in `items.fixes`
   - Everything else goes in `items.features`
   - `date` is the current date
   - `title` should be a short phrase summarizing the release theme
   - `description` should be a one-sentence overview
   - `links` should include the docs.clairify.ai URL for this release
   - Omit `fixes` array if there are no fixes

3. Write the JSON to `docs/release-notes/rn-json/rn-$ARGUMENTS.json` (remove dots from the version number, e.g. 3.2.0 → rn-320.json). Create the `rn-json` directory if it doesn't exist.

4. Show the user the generated JSON and the file path.
