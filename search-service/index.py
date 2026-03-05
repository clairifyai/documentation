from qdrant_client.models import Distance, VectorParams
from qdrant_client import QdrantClient
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from dotenv import load_dotenv
from pathlib import Path
import os

"""
Indexing script — reads docs/**/*.md, embeds, upserts to Qdrant.
Run manually: python index.py
Re-run whenever doc content changes.
"""


load_dotenv(override=True)

QDRANT_URL = os.environ["QDRANT_URL"]
QDRANT_API_KEY = os.environ["QDRANT_API_KEY"]
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
COLLECTION = os.environ.get("QDRANT_COLLECTION", "clairify_docs")
DOCS_DIR = Path(__file__).parent.parent / "docs"

EMBED_MODEL = OpenAIEmbedding(model="text-embedding-3-small")
EMBED_DIM = 1536


def ensure_collection(client: QdrantClient) -> None:
    existing = [c.name for c in client.get_collections().collections]
    if COLLECTION not in existing:
        client.create_collection(
            collection_name=COLLECTION,
            vectors_config=VectorParams(
                size=EMBED_DIM, distance=Distance.COSINE),
        )
        print(f"Created collection: {COLLECTION}")
    else:
        print(f"Collection already exists: {COLLECTION}")


def main() -> None:
    print(f"Reading docs from: {DOCS_DIR}")
    reader = SimpleDirectoryReader(
        input_dir=str(DOCS_DIR),
        recursive=True,
        required_exts=[".md"],
    )
    documents = reader.load_data()
    print(f"Loaded {len(documents)} documents")

    splitter = SentenceSplitter(chunk_size=512, chunk_overlap=50)
    nodes = splitter.get_nodes_from_documents(documents)
    print(f"Split into {len(nodes)} chunks")

    client = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
    ensure_collection(client)

    vector_store = QdrantVectorStore(client=client, collection_name=COLLECTION)

    print("Embedding and upserting chunks…")
    VectorStoreIndex(
        nodes,
        embed_model=EMBED_MODEL,
        vector_store=vector_store,
    )

    print("Indexing complete.")


if __name__ == "__main__":
    main()