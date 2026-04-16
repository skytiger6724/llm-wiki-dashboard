# ---
tags: [Wiki, AI, Finance]
date: 2026-04-09
summary: "核心概念：可信賴 AI 金融架構 (Trustworthy FSI AI Architecture)"
---

# 核心概念：可信賴 AI 金融架構 (Trustworthy FSI AI Architecture)

## 核心定義
這是一套專為金融產業（高監管、高敏感）設計的 AI 落地框架。其核心在於透過「防禦者優勢」與「嚴密治理」，確保 AI 的應用符合安全性、合規性與道德標準。

## 關鍵防禦策略 (Daniel Lu 模型)
- **算力自建**：核心業務優先選擇 [[NVIDIA]] DGX 等本地算力，實現數據主權受控。
- **AI 加持資安 (AI for Security)**：利用具備可解釋性的 AI 進行自動化漏洞掃描與模式分析。
- **DLP 三層過濾**：
    - **輸入端**：提示詞注入 (Injection) 防護。
    - **檢索端**：RAG 數據脫敏與權限校驗。
    - **輸出端**：安全審核與合規監測。

## 商業應用場景 (Eric Kang 模型)
- **智慧銀行**：個性化產品推薦、智慧客服 Agent。
- **量化交易**：市場情緒分析、實時趨勢總結。
- **合規維運**：利用 AI 進行複雜的法規比對與風險管理。

## 與 Wiki 的連結
- [[零信任架構實務_Zero_Trust_Practice]]：金融 AI 架構的底層安全模型。
- [[三式與時空決策模型_The_Three_Styles]]：為金融交易提供時空權重參考。

---
- **編譯時間：2026-04-09 07:20 (UTC+8)**
- **編譯員：[[LLM_Wiki|LLM Wiki]] Compiler**
