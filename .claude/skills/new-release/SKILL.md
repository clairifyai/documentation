---
name: new-release
description: Creates release notes for a new version of Clairify
---

The user wants to create release notes for a new version. The version number is: $ARGUMENTS

Follow these steps ONE AT A TIME. STOP and wait for the user's reply at each checkpoint before proceeding.

**STEP 1 — Version number:**
If `$ARGUMENTS` is empty, ask the user: "What version number is this release?" STOP and wait.

**STEP 2 — Create branch:**
Create a new branch from main:
```bash
git checkout main && git pull && git checkout -b release-notes/$VERSION
```
All subsequent work must happen on this branch — never commit release notes directly to main.

**STEP 3 — List Trello boards:**
Fetch boards from the Clairify workspace:
```bash
curl -s "https://api.trello.com/1/members/me/boards?fields=name,id&key=$TRELLO_API_KEY&token=$TRELLO_TOKEN"
```
Display as a numbered list. Ask: "Which board would you like to use?"
STOP. Wait for the user to reply.

**STEP 4 — List columns:**
Fetch columns from the selected board:
```bash
curl -s "https://api.trello.com/1/boards/{boardId}/lists?fields=name,id&key=$TRELLO_API_KEY&token=$TRELLO_TOKEN"
```
Display as a numbered list. Ask: "Which column would you like to pull cards from?"
STOP. Wait for the user to reply.

**STEP 5 — Fetch cards and create release notes:**
Fetch cards from the selected column:
```bash
curl -s "https://api.trello.com/1/lists/{listId}/cards?fields=name,desc,url,labels&key=$TRELLO_API_KEY&token=$TRELLO_TOKEN"
```
Present the cards as a numbered list showing card name, description, and labels. Then:

a. Create `docs/release-notes/rn-$VERSION.md` (remove dots from version, e.g. 4.0.0 → rn-400.md) using the Trello cards as content, formatted to match the style of existing release notes in `docs/release-notes/rn-320.md`.
b. Update `mkdocs-base.yml` to add the new version at the top of the "Release Notes" nav section.
c. Stage both files with `git add` so the `git-revision-date-localized` plugin can read them.

**STEP 6 — Local preview:**
Restart the local dev server so nav changes are picked up (config changes are not hot-reloaded): kill any process on port 8000, then run `conda run --no-capture-output -n docs mkdocs serve` in the background. Wait for the "Serving on http://127.0.0.1:8000" line before proceeding.

Tell the user the site is ready to preview and ask if they'd like to make any changes. STOP. Wait for the user to confirm they are satisfied.

**STEP 7 — Generate JSON:**
Create `docs/release-notes/rn-json/rn-$VERSION.json` (remove dots from version, e.g. 4.0.0 → rn-400.json). Create the `rn-json` directory if it doesn't exist. Use the following schema:
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

**STEP 8 — Deploy:**
Ask the user: "Ready to deploy?" STOP. Wait for confirmation.
If yes, invoke the `/deploy-release` skill to commit, push, create a PR, merge, and deploy.
