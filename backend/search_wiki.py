import chromadb
import ollama
import os
import sys
import json

# 絕對路徑強制鎖定
ABS_PATH = os.path.dirname(os.path.abspath(__file__))
PERSIST_DIR = os.path.join(ABS_PATH, "chroma_db")

client = chromadb.PersistentClient(path=PERSIST_DIR)
collection = client.get_or_create_collection(name="llm_wiki_vector_v1")

def get_embedding(text):
    response = ollama.embeddings(model="nomic-embed-text", prompt=text)
    return response["embedding"]

def search(query, n_results=5):
    query_vec = get_embedding(query)
    results = collection.query(
        query_embeddings=[query_vec],
        n_results=n_results
    )
    
    # 轉化為標準數據結構
    output = []
    for i in range(len(results['ids'][0])):
        output.append({
            "title": results['ids'][0][i].replace('.md', ''),
            "path": results['metadatas'][0][i]['path'],
            "distance": float(results['distances'][0][i])
        })
    return output

if __name__ == "__main__":
    try:
        q = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else ""
        if not q:
            print(json.dumps([]))
        else:
            results = search(q)
            # 只輸出 JSON，不帶任何雜質
            print(json.dumps(results, ensure_ascii=False))
    except Exception as e:
        # 錯誤也以 JSON 格式返回
        print(json.dumps({"error": str(e)}))
