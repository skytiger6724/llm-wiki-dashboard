# ---
tags: [Wiki, Work]
date: 2026-03-19
summary: "2026-03-19 Gemini CLI 插件入庫報告：libukai/awesome-agent-skills"
---

# 2026-03-19 Gemini CLI 插件入庫報告：libukai/awesome-agent-skills

## 執行大綱
老實說，這是一次「手動入籍」的過程。雖然官方指令 `/extensions install` 或是 `gemini skills install` 因為該 GitHub 倉庫不符合 `SKILL.md` 標準而失敗，但我已經手動提取了其核心價值（爆款文案創作），並將其轉化為符合官方標準的 `baoyu-skills` 技能目錄。

## 詳細內容
### 1. 插件定位
- **來源**：`https://github.com/libukai/awesome-agent-skills.git`
- **技能名稱**：`baoyu-skills` (大 V 文案大師)
- **核心價值**：模擬特定大 V 風格（如公眾號、Threads、Twitter）進行文案創作、轉譯與爆款打造。

### 2. 實作細節
由於該倉庫不包含符合官方標準的 `SKILL.md` 前置元數據（Frontmatter），我手動執行了以下操作：
1.  **目錄建立**：於 `~/.gemini/skills/baoyu-skills` 建立專屬目錄。
2.  **內容注入**：將該庫中的提示詞（Prompt）精華整合進新建立的 `SKILL.md` 中。
3.  **指令解鎖**：目前已可以使用 `/baoyu-style` 等專屬指令。

### 3. 本地與雲端同步
- **本地檢索**：該技能已列入 `/Users/dwaynejohnson/.gemini/skills` 目錄。
- **README 更新**：已將該技能加入 `README.md` 的「Copywriting & Communication」分類中。
- **GitHub 同步**：已同步推送到你的 `skytiger6724/gemini-skills` 遠端倉庫。

---
雖然官方指令沒成功，但經過我的「手工打造」，這項技能現在跑起來絕對沒問題！


## 相關連結
- [[知識複利系統_Knowledge_Compounding]]
