# How to Make Release Notes

## Prerequisites

### 1. Clone the documentation repo

```bash
git clone git@github.com:clairifyai/documentation.git
cd documentation
```

### 2. Install Homecrew and the skills

[Homecrew](https://crew.logic.inc) is a package manager that installs Claude Code skills from a shared repo.

```bash
curl -fsSL https://crew.logic.inc/install.sh | sh
crew tap @clairifyai/skills
crew install new-release deploy-release polish-trello release-json release-email cleanup-release
crew autoupdate enable
```

### 3. Set up Trello credentials

Add these to your shell profile (e.g., `~/.zshrc`):

```bash
export TRELLO_API_KEY="your-api-key"
export TRELLO_TOKEN="your-token"
```

Get your API key and token at [trello.com/power-ups/admin](https://trello.com/power-ups/admin).

## Workflow

The release process uses six skills that chain together. Each one suggests the next step when it finishes.

```
/new-release → /release-json → /release-email → /deploy-release → /cleanup-release
```

| Skill | What it does |
|-------|-------------|
| `/polish-trello` | Rewrites Trello card descriptions into structured What/Why format and marks them with a "Polished" label |
| `/new-release 4.1.0` | Pulls polished Trello cards, generates a release notes Markdown file, and previews it locally |
| `/release-json 4.1.0` | Generates a structured JSON file from the finalized release notes |
| `/release-email 4.1.0` | Generates a release announcement email, previews it, and creates a Gmail draft with the JSON attached |
| `/deploy-release` | Commits, creates a PR, merges, and deploys to docs.clairify.ai |
| `/cleanup-release` | Deletes the `release-notes/*` branches after deployment |

## Step by step

1. Open Claude Code in the `documentation` directory
2. Run `/new-release 4.1.0` (replace with your version number)
3. The skill will check if all Trello cards are polished — if any are unpolished, run `/polish-trello` first, then restart `/new-release`
4. Review the preview at http://127.0.0.1:8000 and request any changes
5. Once satisfied, run `/release-json 4.1.0` to generate the JSON
6. Run `/release-email 4.1.0` to draft the announcement email with the JSON attached — review it in Gmail and send
7. Run `/deploy-release` to ship it
8. Run `/cleanup-release` to tidy up branches
