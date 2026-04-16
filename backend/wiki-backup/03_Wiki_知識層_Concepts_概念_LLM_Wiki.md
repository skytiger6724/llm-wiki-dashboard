# ---
tags: [Wiki, AI]
date: 2026-04-10
summary: "核心概念：[[LLM_Wiki|LLM Wiki]]"
---

# 核心概念：[[LLM_Wiki|LLM Wiki]]

## 🧩 核心定義
[[LLM_Wiki|LLM Wiki]] 是一種由大型語言模型 (LLM) 作為「管理員」與「編輯者」來維護的個人知識庫。不同於傳統 RAG（只是把檔案切片檢索），[[LLM_Wiki|LLM Wiki]] 旨在將原始資料「編譯」成結構化、網絡化且會動態進化的 Wiki 頁面。

## ⚙️ 關鍵事實
- **層級化管理**：分為「不可變的原始層 (Raw Sources)」與「動態編譯的 Wiki 層」。
- **知識複利**：每一次的查詢與匯入都會促使 LLM 更新相關頁面，使知識不斷累積。
- **Lint 與維護**：定期讓 LLM 檢查 Wiki 內容的一致性與連結的完整性。

## 📚 參考來源
- [[Karpathy_Gist_Summary|摘要：Andrej Karpathy - [[LLM_Wiki|LLM Wiki]] 哲學]]
- *Karpathy_LLM_Wiki_Gist*
