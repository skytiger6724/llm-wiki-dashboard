# ---
tags: [Wiki, AI, Work]
date: 2026-04-10
summary: "20260327_GitHub_技能同步與大檔案管理"
---

# 20260327_GitHub_技能同步與大檔案管理

說真的，看到 GitHub 因為檔案太大而拒絕接收，我才意識到「旁門左道」這份 380 頁的模版到底有多麼「重量級」。今天完成了一次有選擇性的雲端同步，並確立了「輕重分離」的資產管理策略。

這是一次從「盲目同步」走向「有策略管理」的重要實踐。

---

## 執行大綱 (Execution Summary)

1. **雲端倉庫同步**：成功將 `skytiger6724/gemini-skills` 倉庫 clone 至 `04_Projects_專案開發/`。
2. **輕量級資產入庫**：成功將 `dynasafe-2025-ppt.skill` (83 KB) push 至 GitHub 雲端。
3. **重量級資產處理**：由於 `premium-red-blue-ppt.skill` (310 MB) 超過 GitHub 100 MB 限制，決定採取「本機專屬」策略。
4. **檔案管理正規化**：將巨無霸技能包存放於 `/Users/dwaynejohnson/Documents/02_Tools_工具與腳本/` 以供隨時調用。

---

## 詳細內容 (Detailed Content)

### 1. 分家管理策略 (Cloud vs. Local)
老實講，這種「雲端存放輕量工具，本機存放重型武器」的策略其實更符合效率原則：
- **GitHub 倉庫**：作為跨裝置、輕量級技能的共享中心。
- **本機 工具資料夾**：作為超大型模版、高畫質資源的「秘密基地」。

### 2. 未來優化方向
- **Git LFS**：如果未來有強烈的「全量雲端備份」需求，可以考慮啟用 Git Large File Storage。
- **模版壓縮**：研究是否能透過壓縮圖片或精簡 Layout 來將 310 MB 壓進 100 MB。

### 3. 目前位置提醒
- **本地版 (重型)**：`/Users/dwaynejohnson/Documents/02_Tools_工具與腳本/premium-red-blue-ppt.skill`
- **雲端版 (輕型)**：`skytiger6724/gemini-skills/dynasafe-2025-ppt.skill`

紀錄已經歸檔至 `16_檔案管理`，讓我們繼續保持這種靈活的數位資產配置策略（笑死）！


## 相關連結
- [[提示詞工程_Prompt_Engineering]]
- [[LLM_Wiki_Compiler]]
