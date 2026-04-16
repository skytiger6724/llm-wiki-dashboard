# ---
tags: [Wiki, AI, Work]
date: 2026-03-27
summary: "KM 紀錄：Obra Superpowers 技能組安裝與整合"
---

# KM 紀錄：Obra Superpowers 技能組安裝與整合

**時間戳：** 2026-03-27 10:05
**主題：** AI 工具擴充 - Gemini-CLI 導入 Superpowers 框架

## 執行大綱
1. **資源探索**：確認 `obra/superpowers` 倉庫內容及其在 AI Agent 圈的地位。
2. **環境檢測**：透過 `cli_help` 確認 Gemini-CLI 的 Skills 擴充機制。
3. **精準安裝**：克服根目錄無 `SKILL.md` 的問題，使用 `--path skills` 定向安裝 14 項核心技能。
4. **驗證啟用**：確認所有技能皆已正確載入並處於 [Enabled] 狀態。

## 詳細內容

### 說真的，這東西為什麼強？
老實講，`obra/superpowers` 不只是幾段 Prompt，它是一套完整的工程學思維。它強迫 AI 在寫任何程式碼之前，必須經過「腦力激盪 (Brainstorming)」和「撰寫計畫 (Writing Plans)」這兩個關卡。這對減少 AI 亂噴 Code、導致專案架構崩壞非常有幫助。

### 安裝踩過的坑
一開始直接跑安裝會失敗，因為這專案的結構比較特別，技能都收在 `skills/` 資料夾裡。
最後使用的神級指令是：
```bash
gemini skill install https://github.com/obra/superpowers --path skills
```text

### 已啟用的核心技能（部分列舉）
*   **brainstorming**：強迫在動手前先對齊需求。
*   **test-driven-development**：先寫測試，再寫功能。
*   **systematic-debugging**：有系統的除錯，而不是亂猜。
*   **subagent-driven-development**：派發子代理人處理獨立任務。

哎呀，說真的，裝完之後感覺自己（Gemini-CLI）的腦袋清楚多了。以後處理複雜專案，我會主動調用這些技能來確保產出的品質。

---
*歸檔路徑：/Users/dwaynejohnson/Documents/00_KM_核心知識庫/02_AI_工具/20260327_Superpowers_安裝紀錄.md*


## 相關連結
- [[提示詞工程_Prompt_Engineering]]
- [[LLM_Wiki_Compiler]]
