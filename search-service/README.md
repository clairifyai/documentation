# Clairify Search Service

FastAPI backend that powers the AI search widget on [docs.clairify.ai](https://docs.clairify.ai). Accepts a natural-language query, retrieves relevant documentation chunks from Qdrant, and synthesises an answer using Claude.

## Stack

- **FastAPI** + Uvicorn
- **LlamaIndex** — RAG pipeline (retrieval + synthesis)
- **Qdrant Cloud** — vector store
- **OpenAI** `text-embedding-3-small` — embeddings
- **Anthropic** `claude-sonnet-4-6` — answer synthesis

## API

```
POST /api/search
Content-Type: application/json

{ "query": "How do I connect Slack?" }
```

```json
{
  "answer": "...",
  "sources": [
    { "title": "Slack Integration", "url": "/integrations/slack/", "excerpt": "..." }
  ]
}
```

## Environment Variables

Create a `.env` file (see `.env.example`):

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key (embeddings) |
| `ANTHROPIC_API_KEY` | Anthropic API key (LLM) |
| `QDRANT_URL` | Qdrant cluster URL |
| `QDRANT_API_KEY` | Qdrant JWT token |
| `QDRANT_COLLECTION` | Collection name (default: `clairify_docs`) |

## Local Development

```bash
pip install -r requirements.txt
cp .env.example .env  # fill in credentials
uvicorn main:app --reload --port 8082
```

The service runs at `http://localhost:8082`.

## Indexing

Run `index.py` once to embed and upsert all docs into Qdrant. Re-run whenever documentation content changes.

```bash
python index.py
```

## Deployment (Cloudflare Containers)

The service is containerised and deployed via [Cloudflare Containers](https://developers.cloudflare.com/containers).

**Prerequisites:** `wrangler` CLI installed and authenticated.

**1. Set secrets**

```bash
wrangler secret put OPENAI_API_KEY
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put QDRANT_URL
wrangler secret put QDRANT_API_KEY
wrangler secret put QDRANT_COLLECTION
```

**2. Deploy**

```bash
wrangler deploy
```

Wrangler builds the Docker image from `Dockerfile`, pushes it to Cloudflare's registry, and deploys the Worker. The live endpoint will be at `https://clairify-search.<your-subdomain>.workers.dev`.

**3. Update the frontend**

Set the search endpoint in `saas_theme/js/search.js` to the workers.dev URL.

## File Structure

```
search-service/
├── main.py            # FastAPI app — POST /api/search
├── index.py           # One-time indexing script
├── requirements.txt   # Python dependencies
├── Dockerfile         # Container image (port 8080)
├── .dockerignore
├── wrangler.toml      # Cloudflare Workers + Containers config
└── worker.js          # Thin Worker that proxies to the container
```
