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

## AI Search

The docs site includes an AI-powered search feature (search icon in nav, or `Cmd+K`). It uses the following stack:

| Component | Role |
|-----------|------|
| **OpenAI** `text-embedding-3-small` | Converts doc chunks and search queries into vectors |
| **Qdrant Cloud** | Stores and retrieves vectors by semantic similarity |
| **LlamaIndex** | Orchestrates the pipeline — reading, chunking, embedding, and querying |
| **Claude** `claude-sonnet-4-6` | Synthesises a natural-language answer from the retrieved chunks |

### Setup

1. Copy and fill in credentials:
   ```
   cp search-service/.env.example search-service/.env
   ```
2. Install search service dependencies:
   ```
   pip install -r search-service/requirements.txt
   ```
3. Index the docs (re-run whenever content changes):
   ```
   cd search-service && python index.py
   ```
4. Start the search service (port 8082):
   ```
   cd search-service && uvicorn main:app --port 8082
   ```

The frontend (`saas_theme/js/search.js`) points to `http://localhost:8082` by default. Change the `const API` line at the top of that file for production.

### Re-indexing

Run `python search-service/index.py` any time doc content changes to keep the vector index in sync.

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
