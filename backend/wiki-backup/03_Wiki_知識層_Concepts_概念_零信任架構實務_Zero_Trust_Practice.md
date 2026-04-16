# ---
tags: [Wiki, AI]
date: 2026-04-09
summary: "核心概念：零信任架構實務 ([[Zero Trust]] Practice)"
---

# 核心概念：零信任架構實務 ([[Zero Trust]] Practice)

## 核心定義
零信任架構實務是指在企業環境中落實「身分導向、最小權限、動態驗證」的安全防禦體系。它假設網路邊界已經消失，所有連線請求無論來源為何都必須經過嚴格檢查。

## 核心三要素
1. **身分導向 (Identity-Centric)**：流量的權限取決於「你是誰（標籤）」，而非「你在哪（IP）」。
2. **動態信任推斷**：結合時間、地理位置、設備狀態與使用者行為，即時計算信任分值。
3. **微分割 (Micro-segmentation)**：將網路劃分為極細小的安全單元，防止威脅橫向移動。

## AI 映射：權限敏感型 Agent
- **指令過濾 = 身分驗證**：確保只有具備權限的 Persona 才能調用特定的 Tool 或 Data Source。
- **行為審計 = 審計追蹤 (Audit Trail)**：Agent 的每一條路徑 (Step) 都必須可追蹤、可解釋。

## 與 Wiki 的連結
- [[統一標籤治理_Unified_Tag_Governance]]：零信任的實施基礎。
- [[企業級AI自律規範_Enterprise_AI_Ethics]]：零信任是 AI 規範得以執行的技術保障。

---
- **編譯時間：2026-04-09 06:20 (UTC+8)**
- **編譯員：[[LLM_Wiki|LLM Wiki]] Compiler**
