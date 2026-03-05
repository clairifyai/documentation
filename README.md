# Clairify Documentation

This repo contains the documentation site for [Clairify](https://docs.clairify.ai), built with MkDocs and deployed to GitHub Pages. It includes a custom SaaS theme and an AI-powered search backend that lets users ask natural-language questions and get answers synthesised directly from the docs.

## Local setup

The project uses Conda for environment management. Dependencies aren't tracked in a lockfile, so install them manually the first time:

```
conda create --name docs
conda activate docs
pip install mkdocs mkdocs-material mkdocs-git-revision-date-localized-plugin mkdocs-git-latest-changes-plugin mkdocs-caption mkdocs-exclude
```

Once installed, start the local dev server:

```
mkdocs serve
```

MkDocs watches `docs/` and `mkdocs.yml` for changes and live-reloads automatically. Note that **theme files in `saas_theme/` are not watched** — if you edit the theme, restart the server manually to see changes.

## Themes

Two themes are available, each backed by its own config file. The SaaS theme is the production theme used on the live site; Material is kept around as a fallback and for comparison.

| Theme    | Config                  | Command                              |
|----------|-------------------------|--------------------------------------|
| SaaS     | `mkdocs.yml` (default)  | `mkdocs serve`                       |
| Material | `mkdocs-material.yml`   | `mkdocs serve -f mkdocs-material.yml` |

Both configs inherit from `mkdocs-base.yml`, which holds the shared nav structure, plugins, and Markdown extensions. If you need to change something that applies to both themes (e.g. adding a new nav section or enabling a plugin), edit `mkdocs-base.yml` rather than touching each config separately.

The `saas_theme/` directory is a local copy of the theme from the `mkdocs-saas-theme` project. Changes made here don't automatically sync back to that repo.

## AI Search

The docs site includes an AI-powered search feature accessible via the search icon in the nav or `Cmd+K`. Rather than keyword matching, it uses a RAG (Retrieval-Augmented Generation) pipeline: the user's question is converted to a vector, the most semantically relevant doc chunks are retrieved from Qdrant, and Claude synthesises a concise answer with source citations.

| Component | Role |
|-----------|------|
| **OpenAI** `text-embedding-3-small` | Converts doc chunks and search queries into vectors |
| **Qdrant Cloud** | Stores and retrieves vectors by semantic similarity |
| **LlamaIndex** | Orchestrates the pipeline — reading, chunking, embedding, and querying |
| **Claude** `claude-sonnet-4-6` | Synthesises a natural-language answer from the retrieved chunks |

The search backend lives in `search-service/` and runs as a standalone FastAPI service, completely separate from the static MkDocs site. The frontend (`saas_theme/js/search.js`) makes a `POST /api/search` request to wherever that service is hosted.

### Setup

Before running search locally, you need credentials for OpenAI, Anthropic, and Qdrant Cloud:

1. Copy and fill in credentials:
   ```
   cp search-service/.env.example search-service/.env
   ```
2. Install search service dependencies:
   ```
   pip install -r search-service/requirements.txt
   ```
3. Index the docs — this embeds all `.md` files and upserts them into Qdrant:
   ```
   cd search-service && python index.py
   ```
4. Start the search service on port 8082:
   ```
   cd search-service && uvicorn main:app --port 8082
   ```

The frontend automatically selects the right API endpoint based on where the page is loaded from — `http://localhost:8082` when running locally, and the production Cloudflare URL when served from `docs.clairify.ai`. No configuration needed.

### Re-indexing

The vector index in Qdrant is not updated automatically when doc content changes. Run `python search-service/index.py` any time you add, edit, or remove pages to keep search results accurate.

### How Wrangler and Docker fit together

**Wrangler** is Cloudflare's CLI — the primary way to interact with Cloudflare's developer platform from the terminal. It handles authentication, configuration, deployments, and secrets. It reads `wrangler.toml` to understand the project: the Worker name, bindings (Durable Objects, secrets, etc.), and which container to attach.

When you run `wrangler deploy`, it does two things in sequence:

1. Calls Docker on your machine to build the image from the `Dockerfile`, then pushes it to Cloudflare's internal container registry
2. Bundles and uploads `worker.js` to Cloudflare's edge network, wiring the Worker to the container via the Durable Object binding

At runtime, incoming requests hit the Worker first (the public-facing entry point on Cloudflare's global edge). The Worker wakes up a container instance and proxies the request to it on port 8080. The FastAPI app handles it and returns the response back through the Worker to the client. The container is never exposed directly — all traffic flows through the Worker.

### Production deployment

The static site and the search service are deployed independently — `mkdocs gh-deploy` has no knowledge of the search backend or its secrets.

The search service is containerised and deployed to **Cloudflare Containers**, which runs the Docker image alongside a thin Worker that proxies incoming requests. See [`search-service/README.md`](search-service/README.md) for the full deployment walkthrough. In summary:

1. Set secrets with `wrangler secret put` (OpenAI, Anthropic, Qdrant — see search-service README for the full list)
2. Run `wrangler deploy` from `search-service/` to build and push the Docker image to Cloudflare
3. Deploy the docs as normal with `mkdocs gh-deploy`

The frontend automatically points to the correct backend — `localhost:8082` during local development and the Cloudflare URL in production — so no manual URL changes are needed.

**Note:** The container cold starts on the first request after a period of inactivity (set to 2 minutes). Cold starts can take 10–20 seconds as the container boots, Python/uvicorn starts, and LlamaIndex initialises the Qdrant connection. Subsequent requests will be fast.

The static site makes HTTP requests to whatever `API` points to — the two remain fully decoupled.

## Committing changes

The git commit history is surfaced publicly on the docs homepage as release notes, powered by the `git-latest-changes` plugin. Because of this, **commit each changed file separately** and write the message as if it's a user-facing changelog entry — avoid vague messages like "updates" or "fix typo".

```
git commit -m 'Added a CNAME file to preserve the custom domain configuration.'
```

## Deploying

Deployment is manual. Once your changes are merged to `main`:

1. Push to remote:
   ```
   git push origin main
   ```
2. Deploy to GitHub Pages:
   ```
   mkdocs gh-deploy                          # SaaS theme (production)
   mkdocs gh-deploy -f mkdocs-material.yml   # Material theme
   ```
3. Changes will be live at [docs.clairify.ai](https://docs.clairify.ai) within a minute or two.
