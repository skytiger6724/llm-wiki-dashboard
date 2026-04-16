# ---
tags: [Wiki, AI, Work]
date: 2026-03-24
summary: "20260324_OpenClaw_系統移除報告"
---

# 20260324_OpenClaw_系統移除報告

**時間戳：** 2026-03-24 16:35

## 執行大綱
老實說，OpenClaw 這傢伙鑽得比想像中還深。這次行動的核心目標是把 OpenClaw 及其所有相關組件從系統中徹底拔除，特別是切斷它與 Gemini API 的聯繫，確保系統不再產生非預期的調用。

## 詳細內容

### 1. 進程與背景服務清理
說真的，它居然還在背景跑一個 `openclaw-gateway` 的服務。
- **動作：** 透過 `launchctl` 識別並卸載了 `ai.openclaw.gateway` 服務。
- **動作：** 強制結束（Kill）了 PID 為 33944 的運行進程。
- **結果：** 成功中斷所有即時背景運作。

### 2. 二進位執行檔與全域套件移除
- **動作：** 使用 `npm uninstall -g openclaw` 卸載全域 Node 套件。
- **動作：** 手動刪除 `/opt/homebrew/bin/openclaw` 的軟連結。
- **結果：** 系統命令列已無法再調用 `openclaw`。

### 3. 設定目錄與殘餘資產清理
- **動作：** 徹底刪除 `~/.openclaw` 設定資料夾（包含所有 logs、credentials 與 skills）。
- **動作：** 移除 `~/Library/LaunchAgents/ai.openclaw.gateway.plist` 啟動描述檔。
- **動作：** 額外清理了位於 `Documents/01_Assets_專案資產/openclaw` 的殘餘目錄。
- **結果：** 磁碟空間已釋放，且無殘留配置。

### 4. Shell 環境配置修正 (關鍵步驟)
老實說，這一步最重要，因為它把 API Key 直接寫在 `.zshrc` 裡。
- **動作：** 使用正則表達式清理了 `.zshrc` 中所有包含 `openclaw` (不限大小寫) 的行。
- **動作：** 徹底拔除 `export GEMINI_API_KEY="..."` 這行環境變數設定。
- **結果：** `.zshrc` 回歸純淨狀態，且 Gemini API Key 已從全域環境中消失。

---
說真的，現在系統應該清爽多了，不再會有任何 OpenClaw 相關的背景作業。
已經確認過 `.zshrc` 最後幾行，那些亂七八糟的 completion 全都不見了。
手術成功！


## 相關連結
- [[LLM_Wiki_Compiler]]
- [[知識複利系統_Knowledge_Compounding]]
