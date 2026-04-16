# ---
tags: [Wiki, AI]
date: 2026-03-25
summary: "20260325_GitHub 技能同步計劃"
---

# 20260325_GitHub 技能同步計劃
**執行大綱:**
- 掃描所有 Gemini 技能 (SKILL.md)。
- 建立 GitHub 倉庫 `gemini-skills-backup`。
- 同步三大類技能 (Agency, Huggingface, Custom) 到倉庫。
- 維持目錄層級結構以便未來恢復。

**詳細內容:**
- 技能總數: 約 80+ 個。
- 同步方式: 使用 `gh repo create` 建立遠端，`git push` 上傳。
- 分類邏輯:
    - `agency-agents` -> `extensions/agency-agents/`
    - `huggingface-skills` -> `extensions/huggingface-skills/`
    - `.agents/skills` -> `custom-skills/`

**時間戳:** 2026-03-25 15:10:00


## 相關連結
- [[提示詞工程_Prompt_Engineering]]
- [[LLM_Wiki_Compiler]]
