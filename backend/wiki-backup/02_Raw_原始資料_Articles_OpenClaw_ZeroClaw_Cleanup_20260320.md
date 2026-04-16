# ---
tags: [Wiki, AI]
date: 2026-03-20
summary: "OpenClaw/ZeroClaw 憑證去敏感化執行紀錄"
---

# OpenClaw/ZeroClaw 憑證去敏感化執行紀錄

**時間戳記：** 2026-03-20 14:55 (UTC+8)
**分類：** /Users/dwaynejohnson/Documents/00_KM_核心知識庫/Security/Credential_Cleanup

## 執行大綱
因應 2026 年 3 月 25 日起 Gemini CLI 嚴查第三方掛載行為，本次任務針對 Workspace 內的 OpenClaw 與 ZeroClaw 進行憑證清理，強制斷開與 CLI OAuth 的連結。

## 詳細內容

### 1. 檢測發現
*   **ZeroClaw**：`~/.zeroclaw/config.toml` 中配置了 `cli = true`，存在自動調用 CLI 憑證的風險。
*   **OpenClaw**：`~/.openclaw/openclaw.json` 中配置了 `"mode": "token"` 及長度疑似為 OAuth 的 `token` 字串。

### 2. 處置動作
*   **ZeroClaw**：
    *   檔案路徑：`~/.zeroclaw/config.toml`
    *   變更：將 `cli = true` 修改為 `cli = false`。
*   **OpenClaw**：
    *   檔案路徑：`~/.openclaw/openclaw.json`
    *   變更 1：將 `"mode": "token"` 修改為 `"mode": "api_key_only"`。
    *   變更 2：將 `"token": "..."` 的內容替換為 `"STOPPED_FOR_SECURITY"`。

### 3. 風險評估與後續建議
*   **工具可用性**：目前 OpenClaw 與 ZeroClaw 在缺乏有效憑證的情況下可能無法正常運作。
*   **修復建議**：
    1.  前往 [Google AI Studio](https://aistudio.google.com/) 申請專屬 API Key。
    2.  將 API Key 填入 `~/.openclaw/agents/main/agent/auth-profiles.json` 或 OpenClaw 設定檔中的 `apiKey` 欄位。
    3.  重啟服務。

## 執行狀態
**狀態：已完成 (COMPLETED)**
**執行人：** Gemini CLI


## 相關連結
- [[知識複利系統_Knowledge_Compounding]]
