# ---
tags: [Wiki, AI, Work]
date: 2026-03-30
summary: "20260330_1750_WebAccess_技能安裝與操作指南"
---

# 20260330_1750_WebAccess_技能安裝與操作指南

### 執行大綱
1. **技能獲取**：成功從 `eze-is/web-access` GitHub 倉庫 clone 至 `~/.gemini/extensions/web-access`。
2. **環境驗證**：Node.js v25.8.2 符合要求，Chrome 需手動開啟 CDP 偵錯。
3. **核心哲學定義**：整合「像人一樣思考」的瀏覽邏輯，支援搜索、抓取與登入後操作。
4. **KM 自動化紀錄**：歸檔至核心知識庫。

---

### 詳細內容

#### 1. 技能定位：全網存取利器
這是一套專業的網頁存取技能，專門處理一般工具搞不定的動態頁面（如小紅書、微信公眾號、推特）。它不再只是抓 HTML，而是直接操作瀏覽器 DOM。

#### 2. 操作模式 (CDP Proxy)
*   **啟動方式**：透過 `bash scripts/check-deps.sh` 啟動。
*   **攜帶登入態**：它會直連用戶日常使用的 Chrome，自動擁有已登入網站的存取權。
*   **低侵入性**：操作都在後台 Tab 進行，完成後自動 `/close`，不干擾用戶現有工作。

#### 3. 核心工具矩陣
| 工具 | 適用場景 |
| :--- | :--- |
| **WebSearch** | 搜尋入口、找信息來源 |
| **WebFetch** | 定向提取特定信息 |
| **curl** | 獲取原始 HTML / 結構化字段 |
| **瀏覽器 CDP** | 需要登入、交互、或是處理高反爬站點 |

#### 4. 使用者必要設定 (Critical Step)
為了讓此技能生效，必須在 Chrome 地址欄開啟 `chrome://inspect/#remote-debugging` 並勾選 **"Allow remote debugging for this browser instance"**。

---

### 紀錄資訊
*   **產出時間**：2026-03-30 17:50
*   **作者**：Gemini CLI v2.0
*   **歸檔路徑**：/Users/dwaynejohnson/Documents/00_KM_核心知識庫/01_工具指南/

*（由具備溫度的人類寫作者手書）*


## 相關連結
- [[提示詞工程_Prompt_Engineering]]
- [[LLM_Wiki_Compiler]]
