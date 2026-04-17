import chromadb
import ollama
import os
import glob

# 使用絕對路徑
ABS_PATH = os.path.dirname(os.path.abspath(__file__))
WIKI_DIR = "/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/21_LLM_Wiki_核心知識庫"
KM_DIR = "/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/00_KM_核心知識庫"
PERSIST_DIR = os.path.join(ABS_PATH, "chroma_db")

client = chromadb.PersistentClient(path=PERSIST_DIR)
collection = client.get_or_create_collection(name="llm_wiki_vector_v1")

def get_embedding(text):
    try:
        response = ollama.embeddings(model="nomic-embed-text", prompt=text)
        return response["embedding"]
    except:
        return None

def index_dir(base_dir):
    print(f"📂 Scanning: {base_dir}")
    files = glob.glob(f"{base_dir}/**/*.md", recursive=True)
    for i, fp in enumerate(files):
        name = os.path.basename(fp).replace(".md", "")
        if "Conversation_" in name: continue
        
        try:
            with open(fp, 'r', encoding='utf-8') as f:
                txt = f.read(5000) # 取前 5000 字
            
            if not txt.strip(): continue
            
            emb = get_embedding(txt)
            if emb:
                collection.upsert(
                    ids=[name],
                    embeddings=[emb],
                    metadatas=[{"path": fp}],
                    documents=[txt[:1000]] # 僅儲存摘要
                )
            if i % 100 == 0: print(f"✅ Indexed {i}/{len(files)} in {os.path.basename(base_dir)}")
        except: pass

if __name__ == "__main__":
    index_dir(WIKI_DIR)
    index_dir(KM_DIR)
    print(f"🏁 Final DB Count: {collection.count()}")
