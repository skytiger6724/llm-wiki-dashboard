import sys
import os

# 將 graphify 路徑加入 sys.path
sys.path.append('/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app/graphify')

try:
    from graphify.extract import extract_llm
    print("✅ Graphify LLM Extractor 導入成功！")
except ImportError as e:
    print(f"❌ 導入失敗: {e}")
except Exception as e:
    print(f"💥 發生錯誤: {e}")
