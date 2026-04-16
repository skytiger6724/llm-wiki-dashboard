# ---
tags: [Wiki, AI]
date: 2026-04-10
summary: "核心概念：增量更新 (Incremental Ingest)"
---

# 核心概念：增量更新 (Incremental Ingest)

## 🧩 核心定義
增量更新是 [[LLM_Wiki|LLM Wiki]] 的核心操作模式。不同於一次性的資料匯入，它是指當每一份新資料（文章、論文、對話錄）進入系統時，LLM 會主動識別並更新現有的 Wiki 結點，確保知識網絡始終處於最新狀態。

## ⚙️ 關鍵事實
- **觸發機制**：新資料存入 `02_Raw` 後立即觸發。
- **影響範圍**：LLM 通常會掃描並更新相關的 10-15 個 Wiki 頁面，而不是只建立一個獨立檔案。
- **消除冗餘**：透過增量更新，新的資訊會被整合進舊的結點，避免出現大量重複或破碎的筆記。

## 📚 參考來源
- [[Karpathy_Gist_Summary|摘要：Andrej Karpathy - [[LLM_Wiki|LLM Wiki]] 哲學]]
- [[LLM_Wiki|核心概念：LLM Wiki]]
