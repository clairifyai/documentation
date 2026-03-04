# Clairify Documentation

## Local setup

1. Create and activate a virtual environment:
   ```
   conda create --name docs
   conda activate docs
   ```
2. Install dependencies:
   ```
   pip install mkdocs mkdocs-material mkdocs-git-revision-date-localized-plugin mkdocs-git-latest-changes-plugin mkdocs-caption mkdocs-exclude
   ```
3. Run the local dev server:
   ```
   mkdocs serve
   ```

## Themes

Two themes are available, controlled by which config file you pass to mkdocs.

| Theme    | Config                  | Command                              |
|----------|-------------------------|--------------------------------------|
| SaaS     | `mkdocs.yml` (default)  | `mkdocs serve`                       |
| Material | `mkdocs-material.yml`   | `mkdocs serve -f mkdocs-material.yml` |

Shared config (nav, plugins, extensions) lives in `mkdocs-base.yml` and is inherited by both.

## Committing changes

The git commit history is displayed publicly on the homepage as documentation release notes. **Commit each changed file separately** with a descriptive message — these messages are user-facing.

```
git commit -m 'Added a CNAME file to preserve the custom domain configuration.'
```

## Deploying

1. Merge your branch to `main` and push:
   ```
   git push origin main
   ```
2. Deploy to GitHub Pages:
   ```
   mkdocs gh-deploy                          # SaaS theme
   mkdocs gh-deploy -f mkdocs-material.yml   # Material theme
   ```
3. Changes will be live at [docs.clairify.ai](https://docs.clairify.ai).
