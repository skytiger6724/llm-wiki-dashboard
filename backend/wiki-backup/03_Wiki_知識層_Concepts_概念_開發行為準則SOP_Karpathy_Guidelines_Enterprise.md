# ---
tags: [Wiki, AI, Engineering, SOP, Karpathy]
date: 2026-04-13
summary: "核心概念：開發行為準則 SOP (Karpathy Guidelines Enterprise)"
---

# 核心概念：開發行為準則 SOP (Karpathy Guidelines Enterprise)

## 核心定義
開發行為準則 SOP 是將 Andrej Karpathy 觀察到的 LLM 編碼缺陷轉化為**企業級工程團隊開發行為規範**的結構化框架。原始的四條原則（Think Before Coding、Simplicity First、Surgical Changes、Goal-Driven Execution）被擴展為可審計、可培訓、可量化的企業 SOP，適用於包含 AI Agent 在內的現代開發團隊。

## 四大原則企業化擴展

### 1. Think Before Coding → 需求澄清 SOP
**原始**：明確陳述假設、不猜測、提問
**企業化**：
- 需求接收階段必須產出「假設清單」與「模糊點清單」
- 多方案比較必須書面化，附上 tradeoff 分析
- 每週 Code Review 中審查「是否有未經確認的假設導致返工」

### 2. Simplicity First → 程式碼審查 Checklist
**原始**：最小程式碼、不 speculate、不亂加抽象
**企業化**：
- PR 描述必須說明「為什麼需要這些程式碼」而非「做了什麼」
- Code Review 新增檢查項：「這 200 行能用 50 行重寫嗎？」
- 技術債追蹤系統：記錄每次過度設計的案例與原因

### 3. Surgical Changes → 變更影響評估
**原始**：只改必須改的、配合現有風格、不亂動相鄰程式碼
**企業化**：
- Git diff 自動比對「每行變更是否對應到需求」
- 變更影響範圍評估工具（影響模組數、測試覆蓋率變化）
- 月度統計：「drive-by refactoring」發生率

### 4. Goal-Driven Execution → 測試優先工作流
**原始**：把任務轉成可驗證目標、先測試再通過
**企業多**：
- 所有任務必須以「Given/When/Then」格式定義成功標準
- CI/CD 管線強制執行測試，失敗不可合併
- 每月發布「測試覆蓋率趨勢報告」

## 量化指標

| 指標 | 定義 | 目標值 |
|:---|:---|:---:|
| **假設返工率** | 因未經確認假設導致的返工次數 / 總任務數 | <5% |
| **過度設計指數** | PR 中非必要程式碼行數 / 總變更行數 | <15% |
| **Drive-by 變更率** | 與需求無直接關聯的變更行數 / 總變更行數 | <5% |
| **測試先行率** | 先寫測試再寫實作的任務數 / 總任務數 | >80% |
| **澄清問題時機** | 實施前提問的次數 vs 實施後發現問題的次数 | >3:1 |

## 與 Wiki 的連結
- [[karpathy-guidelines|Skill：Karpathy Guidelines]] — 原始四條原則的技術實現
- [[知識自動化管線_Knowledge_Automation_Pipeline|概念：知識自動化管線]] — 管線程式碼的品質保障框架
- [[開發行為準則SOP|概念：開發行為準則 SOP]] — 企業化擴展的完整框架

## 商業洞察
1. **可產品化為企業培訓服務**：將 Karpathy Guidelines 封裝為「工程團隊開發行為轉型」諮詢服務，定價 $200K-500K/梯
2. **與 AI Agent 協同**：這些原則不僅適用於人類開發者，更是 AI Agent（如 Cursor、GitHub Copilot）的系統提示詞最佳實踐
3. **量化指標是差異化關鍵**：多數開發規範停留在「文化倡議」層面，量化指標使其成為可審計的 SOP

## 參考來源
- `https://github.com/forrestchang/andrej-karpathy-skills`
- `.qwen/skills/karpathy-guidelines/SKILL.md`
- [[2026全域知識複利戰略報告_v14.0_全光譜統合篇|戰略：全光譜統合 v14.0]]

---
- **編譯時間**：2026-04-13 12:45 (UTC+8)
- **編譯員**：[[LLM Wiki]] Compiler
