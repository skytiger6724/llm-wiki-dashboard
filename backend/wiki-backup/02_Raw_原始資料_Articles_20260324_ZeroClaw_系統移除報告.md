# ---
tags: [Wiki, AI, Work]
date: 2026-03-24
summary: "20260324_ZeroClaw_系統移除報告"
---

# 20260324_ZeroClaw_系統移除報告

**時間戳：** 2026-03-24 16:45

## 執行大綱
老實說，Zeroclaw 這傢伙簡直就是一個 Gemini API 的重度用戶。這次任務的重點是將其從系統中徹底刪除，特別是清理那些內嵌在各個技能腳本中的 Gemini API 調用邏輯，確保系統環境與 Google Generative AI 的聯繫完全切斷。

## 詳細內容

### 1. 核心設定目錄清理
說真的，這個目錄裡藏了太多自動化腳本。
- **動作：** 徹底刪除 `~/.zeroclaw` 設定資料夾（包含所有 workspace、config 與 secret_key）。
- **動作：** 特別針對 `workspace/skills/` 下所有含有 `GEMINI_API_KEY` 調用的 JavaScript 與 Python 腳本進行銷毀。
- **結果：** 所有的自動化調用入口已全數消失。

### 2. 二進位執行檔移除
- **動作：** 搜尋並刪除了 `/opt/homebrew/bin` 與 `/usr/local/bin` 下所有名為 `zeroclaw` 的連結與檔案。
- **結果：** 命令列已無法執行任何相關指令。

### 3. Shell 環境配置清理
- **動作：** 使用正則表達式清理 `.zshrc` 中所有包含 `zeroclaw` (不限大小寫) 的行。
- **結果：** 確保沒有任何隱藏的 alias 或 completion 殘留在啟動腳本中。

### 4. 殘餘資產巡檢
- **動作：** 巡檢 `Documents` 資料夾，除了保留 20260320 的清理歷史紀錄文件外，無其他運作中的資產。
- **結果：** 系統維持高純淨度。

---
說真的，現在你的電腦環境應該已經完全去除了 OpenClaw 與 Zeroclaw 的陰影。
尤其是與 Gemini API 相關的自動化調用管道已經被徹底堵死。
任務搞定！


## 相關連結
- [[LLM_Wiki_Compiler]]
- [[知識複利系統_Knowledge_Compounding]]
