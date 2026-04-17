import chromadb
import ollama
import os
import glob
from pathlib import Path

# Configuration
WIKI_DIR = "/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫"
KM_DIR = "/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/00_KM_核心知識庫"
PERSIST_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")

# Initialize Local Persistent Client
client = chromadb.PersistentClient(path=PERSIST_DIR)
collection = client.get_or_create_collection(name="llm_wiki_vector_v1")

def get_embedding(text):
    response = ollama.embeddings(model="nomic-embed-text", prompt=text)
    return response["embedding"]

def index_files():
    print(f"🚀 Starting Indexing process...")
    # Find all markdown files
    files = glob.glob(f"{WIKI_DIR}/**/*.md", recursive=True)
    print(f"📂 Found {len(files)} files to index.")

    for i, filepath in enumerate(files):
        filename = os.path.basename(filepath)
        if "Conversation_" in filename: continue # Skip logs
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Simple chunking logic (first 2000 chars for prototype)
            chunk = content[:2000]
            if not chunk.strip(): continue

            print(f"[{i+1}/{len(files)}] Indexing: {filename}")
            
            embedding = get_embedding(chunk)
            
            collection.add(
                ids=[filename],
                embeddings=[embedding],
                metadatas=[{"path": filepath, "source": "wiki"}],
                documents=[chunk]
            )
        except Exception as e:
            print(f"❌ Error indexing {filename}: {str(e)}")

if __name__ == "__main__":
    index_files()
    print("✅ Indexing Complete.")
