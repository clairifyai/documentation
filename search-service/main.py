"""
FastAPI search service — POST /api/search
Run: uvicorn main:app --port 8082
"""

import os
import re
from contextlib import asynccontextmanager
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from llama_index.core import VectorStoreIndex
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.anthropic import Anthropic
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient

load_dotenv(override=True)

QDRANT_URL = os.environ["QDRANT_URL"]
QDRANT_API_KEY = os.environ["QDRANT_API_KEY"]
COLLECTION = os.environ.get("QDRANT_COLLECTION", "clairify_docs")

RAG_PROMPT = """\
You are a helpful documentation assistant for Clairify.
Answer the user's question using ONLY the documentation excerpts provided below.
If the answer is not covered in the docs, say: "I couldn't find that in the Clairify docs."
Be concise and direct. Do not mention the word "excerpt" or "context" — just answer naturally.

Documentation excerpts:
{context}

Question: {query}
"""

# ---------------------------------------------------------------------------
# Startup / shutdown
# ---------------------------------------------------------------------------

_index: VectorStoreIndex | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):  # type: ignore[type-arg]
    global _index
    client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
    vector_store = QdrantVectorStore(client=client, collection_name=COLLECTION)
    _index = VectorStoreIndex.from_vector_store(
        vector_store=vector_store,
        embed_model=OpenAIEmbedding(model="text-embedding-3-small"),
    )
    print("Search index ready.")
    yield
    _index = None


app = FastAPI(title="Clairify Search Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------


class SearchRequest(BaseModel):
    query: str


class Source(BaseModel):
    title: str
    url: str
    excerpt: str


class SearchResponse(BaseModel):
    answer: str
    sources: list[Source]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _file_name_to_url(file_name: str) -> str:
    """Convert a docs-relative file path to a site URL slug.

    e.g. "docs/getting-started/overview.md" → "/getting-started/overview/"
    """
    path = re.sub(r"^.*?docs/", "", file_name)  # strip prefix up to docs/
    path = re.sub(r"\.md$", "/", path)
    if not path.startswith("/"):
        path = "/" + path
    return path


def _page_title(node: Any) -> str:
    meta = node.metadata or {}
    # LlamaIndex may store title in metadata or we derive from file name
    if "file_name" in meta:
        name = meta["file_name"].rsplit("/", 1)[-1]
        name = re.sub(r"\.md$", "", name)
        name = name.replace("-", " ").replace("_", " ").title()
        return name
    return "Documentation"


# ---------------------------------------------------------------------------
# Route
# ---------------------------------------------------------------------------


@app.post("/api/search", response_model=SearchResponse)
async def search(body: SearchRequest) -> SearchResponse:
    if not body.query.strip():
        raise HTTPException(status_code=422, detail="query must not be empty")

    if _index is None:
        raise HTTPException(status_code=503, detail="Index not ready")

    retriever = _index.as_retriever(similarity_top_k=5)
    nodes = retriever.retrieve(body.query)

    if not nodes:
        return SearchResponse(
            answer="I couldn't find that in the Clairify docs.",
            sources=[],
        )

    # Build context string
    context_parts = []
    for n in nodes:
        context_parts.append(n.node.get_content())
    context = "\n\n---\n\n".join(context_parts)

    # Synthesise answer with Claude
    llm = Anthropic(model="claude-sonnet-4-6")
    prompt = RAG_PROMPT.format(context=context, query=body.query)
    response = llm.complete(prompt)
    answer = str(response).strip()

    # Deduplicate sources by URL
    seen_urls: set[str] = set()
    sources: list[Source] = []
    for n in nodes:
        meta = n.node.metadata or {}
        file_name = meta.get("file_path", meta.get("file_name", ""))
        url = _file_name_to_url(file_name) if file_name else "#"
        if url in seen_urls:
            continue
        seen_urls.add(url)
        sources.append(
            Source(
                title=_page_title(n.node),
                url=url,
                excerpt=n.node.get_content()[:200].strip() + "…",
            )
        )

    return SearchResponse(answer=answer, sources=sources)


# ---------------------------------------------------------------------------
# Dev entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8082, reload=True)
