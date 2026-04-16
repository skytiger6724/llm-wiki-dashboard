# ---
tags: [Wiki, AI]
date: 2026-04-09
summary: "核心概念：企業級 AI 自律規範 (Enterprise AI Ethics & Governance)"
---

# 核心概念：企業級 AI 自律規範 (Enterprise AI Ethics & Governance)

## 核心定義
企業級 AI 自律規範是組織在引入生成式 AI (GenAI) 技術時，為平衡效率、數據安全與合規性而設定的一套動態治理框架。

## 治理核心原則
1. **身分即防線 (Identity is Perimeter)**：嚴禁共享帳號，建立完整的審計追蹤 (Audit Trail)。
2. **零信任架構 ([[Zero Trust]])**：實施最小權限原則與持續驗證。
3. **雲地混合決策 (Hybrid Deployment Decision)**：依據數據敏感度 (50%)、效能延遲 (30%) 與成本 (20%) 動態決定佈署路徑。

## AI 使用情境判定矩陣 ([[Dynasafe]] 模型)
| 級別 | 情境 | 規範 |
| :--- | :--- | :--- |
| **🟢 綠燈** | 會議記錄、通用文案 | 脫敏後可使用公有雲 AI。 |
| **🟡 黃燈** | 代碼編寫、法律摘要 | 沙盒執行 + 人工覆核。 |
| **🔴 紅燈** | 核心專利、客戶個資 | 嚴禁雲端，必須使用地端 sLLM。 |

## AI 映射：系統約束 (System Constraints)
- **自律規範 = Negative Constraints**：在 Prompt 或 Agent 規劃階段預設的限制邊界。
- **數據脫敏 = Privacy-Preserving Transformation**。

## 與 Wiki 的連結
- 亡靈書中的「審判規則」是這套現代 AI 治理規範的古典原型（參見古文明意識遺產相關研究）。
- [[煉金術與系統轉化模型_Alchemy_Transformation]]：規範中的數據脫敏屬於煉金術中的「黑化（淨化）」步驟。
- 另見：[[企業AI治理框架_Enterprise_AI_Governance]] 提供治理結構與合規視角。

---
- **編譯時間**：2026-04-09 05:30 (UTC+8)
- **編譯員**：[[LLM_Wiki|LLM Wiki]] Compiler
