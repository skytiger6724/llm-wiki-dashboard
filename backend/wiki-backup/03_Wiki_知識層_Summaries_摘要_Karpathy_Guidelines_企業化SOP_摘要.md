# ---
tags: [Wiki, Arch, Engineering, Karpathy, SOP]
date: 2026-04-13
summary: "Karpathy Guidelines 企業化 SOP — LLM 編碼四原則轉化為可審計、可量化的工程團隊開發行為規範"
---

# 摘要：Karpathy Guidelines 企業化 SOP v1.0

## 核心摘要
將 Andrej Karpathy 觀察的 LLM 編碼四條原則（Think Before Coding、Simplicity First、Surgical Changes、Goal-Driven Execution）擴展為完整的企業級 SOP，適用於人類工程師 + AI Agent 混合團隊。包含個人檢查清單、PR 流程、Code Review 規範、五大量化指標、培訓課程設計和 AI Agent System Prompt 模板。

## 關鍵概念
- **四原則個人層**：每個原則附操作手冊 + 檢查清單 + 企業化擴展
- **團隊流程**：任務生命週期（Think → Simple → Surgical → Goal → Review → Merge）
- **8 題 CR Checklist**：每個 PR 必須回答 Think/Simple/Surgical/Goal 四類問題
- **五大量化指標**：假設返工率 <5%、過度設計 <15%、Drive-by <5%、測試先行 >80%、澄清問題 >3:1
- **AI Agent 整合**：可直接作為 Cursor/Copilot/Qwen Code 的 System Prompt
- **持續改進**：月度回顧 + 季度回顧 + 版本控制

## 關鍵實體
- Andrej Karpathy（原始觀察者）
- [[Karpathy_Guidelines|Skill: karpathy-guidelines]]（原始技術實現）
- [[知識自動化管線|概念：知識自動化管線]]（關聯節點）

## 參考來源
- `~/.qwen/skills/karpathy-guidelines/SKILL.md`
- `Concepts_概念/開發行為準則SOP_Karpathy_Guidelines_Enterprise.md`
- `00_KM_核心知識庫/03_Arch_技術架構與安全/Karpathy_Guidelines_企業化SOP_v1.0.md`

---
- **編譯時間**：2026-04-13 16:00 (UTC+8)
- **編譯員**：LLM Wiki Compiler
