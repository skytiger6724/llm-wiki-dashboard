# ---
tags: [Wiki, AI, Work]
date: 2026-04-03
summary: "Gemini CLI 技能庫清理紀錄：gog 技能移除報告"
---

# Gemini CLI 技能庫清理紀錄：gog 技能移除報告

- **操作時間**：2026-04-03 星期五
- **核心目標**：徹底移除 gemini-cli 技能庫中的 `gog` (GOG 遊戲搜尋) 技能。
- **執行動作**：物理刪除 `/Users/dwaynejohnson/.gemini/skills/gog/` 資料夾。

## 1. 執行大綱 (Execution Summary)

1. **鎖定目標**：確認 `gog` 技能及其 `SKILL.md` 檔案路徑。
2. **物理清除**：調用 `rm -rf` 指令，將整個 `gog` 技能資料夾從系統中拔除。
3. **一致性檢查**：確保沒有殘留任何相關的指針檔案。

## 2. 移除原因分析 (Removal Logic)
- **需求調整**：用戶指示徹底移除，可能因功能不符、資源衝突或內容不符預期（如誤判為 Google 相關工具）。

## 3. 復盤與後續
目前 `gemini-cli` 技能庫中剩餘的核心技能包括 `obsidan`、`pptx`、`pdf`、`dynasafe-2025-ppt`、`premium-red-blue-ppt`。

說真的，定期清理不常用的技能，能讓我的「聯想大腦」更專注在真正核心的任務上。


## 相關連結
- [[提示詞工程_Prompt_Engineering]]
- [[LLM_Wiki_Compiler]]
