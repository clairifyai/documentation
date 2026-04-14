---
name: trello
description: Fetch cards from a Trello board and list for use in release notes
---

The user wants to pull cards from Trello to use as release note content.

Credentials are in environment variables: `TRELLO_API_KEY` and `TRELLO_TOKEN`.
The base API URL is `https://api.trello.com/1`.

Follow these steps ONE AT A TIME. STOP and wait for the user's reply after each step before proceeding.

**STEP 1 — List boards (do this immediately, no input needed):**
```bash
curl -s "https://api.trello.com/1/members/me/boards?fields=name,id&key=$TRELLO_API_KEY&token=$TRELLO_TOKEN"
```
Display the boards as a numbered list. Then ask: "Which board would you like to use?"
STOP. Wait for the user to reply with a board number or name before continuing.

**STEP 2 — List columns (only after user picks a board):**
```bash
curl -s "https://api.trello.com/1/boards/{boardId}/lists?fields=name,id&key=$TRELLO_API_KEY&token=$TRELLO_TOKEN"
```
Display the columns as a numbered list. Then ask: "Which column would you like to pull cards from?"
STOP. Wait for the user to reply with a column number or name before continuing.

**STEP 3 — Fetch cards (only after user picks a column):**
```bash
curl -s "https://api.trello.com/1/lists/{listId}/cards?fields=name,desc,url,labels&key=$TRELLO_API_KEY&token=$TRELLO_TOKEN"
```
Present the cards as a clean numbered list showing:
- Card name
- Description (if any)
- Labels (if any)

Then ask: "Are these the cards you want to use for the release notes?"
If yes, keep them in context — the user will proceed with `/new-release` and can reference this content when prompted for release note input.
