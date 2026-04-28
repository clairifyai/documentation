---
name: deploy-release
description: Commits, pushes, merges, and deploys the current release notes branch
disable-model-invocation: true
---

The user wants to ship the current release notes. Follow these steps:

1. Run `git branch --show-current` to identify the current branch. Extract the version number from the branch name (e.g. `release-notes/4.0.0` → version `4.0.0`).
2. Show the user the current branch and version, and ask them to confirm they want to commit, push, create a PR, merge, and deploy.
3. If the user confirms:
   a. Commit all staged and unstaged changes with the message: "Added release notes for version X.X.X."
   b. Push the branch to origin.
   c. Create a PR using `gh pr create` with the title "Release notes for version X.X.X" and a summary of what was changed.
   d. Merge the PR using `gh pr merge` with the `--merge` flag.
   e. Switch to main and pull the latest changes.
   f. Deploy using `conda run -n docs mkdocs gh-deploy`.
4. Confirm to the user that the release is live at docs.clairify.ai.
5. Ask the user: "Would you like to clean up the release branches? Run `/cleanup-release` to delete them."
