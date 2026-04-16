# ---
tags: [Wiki, AI]
date: 2026-04-08
summary: "實體：[[LLM_Wiki|LLM Wiki]] Compiler (llm-wiki-compiler)"
---

# 實體：[[LLM_Wiki|LLM Wiki]] Compiler (llm-wiki-compiler)

## 基本資訊
- **類型**：自動化技能 / Agent
- **版本**：v1.1
- **位置**：`/Users/dwaynejohnson/.qwen/skills/llm-wiki-compiler`

## 描述
自研的自動化知識編譯技能，基於 Karpathy Wiki 哲學設計。負責將 Raw 原始資料自動檢測、摘要、編譯成結構化知識。

## 核心能力
1. **偵測新檔案 (Check)**：執行 `check_new_files.py` 掃描新進檔案
2. **知識編譯 (Compile Cycle)**：
   - Ingest：登記來源至 Index.md
   - Summarize：建立結構化摘要
   - Compile：更新 Entities 與 Concepts
   - Log：記錄操作至 Log.md
3. **狀態同步 (Finalize)**：執行 `update_state.py` 更新本地快取

## 技術特點
- 雙重過濾機制（排除 node_modules、.git、__pycache__、.lock、.log）
- 增量編譯（避免重複處理已編譯文件）
- 支援 `.md`、`.txt`、`.pdf`（需 OCR）

## 相關連結
- *Karpathy Wiki Pattern*
- [[LLM_Wiki_Dashboard|實體：[[LLM_Wiki]] Dashboard]]
- [[知識複利系統_Knowledge_Compounding|概念：知識複利系統]]

---
- **創建時間**：2026-04-08 03:00 (UTC+8)
- **最後更新**：2026-04-08 03:00
