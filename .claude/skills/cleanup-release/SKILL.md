---
name: cleanup-release
description: Cleans up local and remote release notes branches after deployment
disable-model-invocation: true
---

The user wants to clean up after a release. Follow these steps:

1. Run `git branch -a` to identify all local and remote branches matching the pattern `release-notes/*`.
2. Show the user the list of branches that will be deleted (both local and remote) and ask them to confirm before proceeding.
3. If the user confirms:
   a. Switch to main with `git checkout main`.
   b. Pull the latest changes with `git pull`.
   c. Delete each local release branch with `git branch -d`.
   d. Delete each remote release branch with `git push origin --delete`.
4. Confirm to the user that the branches have been deleted.
