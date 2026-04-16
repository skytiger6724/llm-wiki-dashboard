# ---
title: 企業 AI 治理框架 (Enterprise [[AI Governance]])
type: concept
tags: [AI治理, Gemini Enterprise, DLP, 數據脫敏, RTCO框架, 雲地混合]
created: 2026-04-09
updated: 2026-04-09
sources: [12_工作_Dynasafe/Gemini_Enterprise_自律規範草案/]
---

# 概念：企業 AI 治理框架 (Enterprise [[AI Governance]])

## 核心定義
企業導入生成式 AI 時的治理框架，平衡「開放創新」與「合規安全」。涵蓋數據防洩漏 (DLP)、雲地混合部署決策、Prompt 安全模板、人類在環審核機制。

## 關鍵事實
- **雲地部署三維度決策**: 數據敏感度 (50%) + 技術效能 (30%) + 經濟成本 (20%)
- **三層 DLP 防護**: 提示詞層級過濾 → RAG 權限審核 → 輸出層級審查
- **RTCO Prompt 框架**: Role (角色) → Task (任務) → Constraint (約束) → Output (輸出)
- **情境判定矩陣**: 綠燈 (會議記錄) / 黃燈 (程式碼、法律摘要) / 紅燈 (客戶投訴、核心專利)
- **安全脫敏規則**: 人物→職稱、數據→百分比/趨勢、地點→區域代稱、代碼→專案代稱
- **核准平台清單**: Gemini Enterprise (雲) + Gemini CLI/Claude (混合) + sLLM (地端)
- **AI 幻覺防範**: Human-in-the-Loop 強制審核，禁止直出對外發布

## 參考來源
- [[Dynasafe工作文件核心摘要|摘要：[[Dynasafe]] 工作文件]]
- [Gemini Enterprise 自律規範草案.md](12_工作_Dynasafe/06_技術中心/.../Gemini_Enterprise_自律規範草案/)

## 關聯概念
- [[企業級AI自律規範_Enterprise_AI_Ethics]]
- [[混合雲AI採用框架_Hybrid_Cloud_AI_Adoption]]
