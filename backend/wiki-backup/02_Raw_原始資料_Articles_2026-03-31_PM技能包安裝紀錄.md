# ---
tags: [Wiki, AI, Work]
date: 2026-03-31
summary: "2026-03-31 PM 技能包安裝紀錄"
---

# 2026-03-31 PM 技能包安裝紀錄

**時間戳：** 2026-03-31 15:00 (UTC+8)

## 執行大綱
1. **任務目標**：從 GitHub 存儲庫 (https://github.com/phuryn/pm-skills.git) 安裝全套產品管理 (PM) 相關技能。
2. **分析與診斷**：
    - 初次嘗試全域安裝失敗，診斷為 Repo 結構非扁平化。
    - 手動 Clone 並掃描目錄，發現技能分布在 8 個大類子目錄中。
3. **執行過程**：
    - 使用 Generalist Agent 批次掃描所有包含 `SKILL.md` 的路徑。
    - 逐一執行 `gemini skills install` 並指定 `--path`。
4. **清理與驗證**：刪除暫存 Clone 資料夾，並確認技能已成功加載。

---

## 詳細內容

說真的，這次安裝的 PM 技能包內容非常紮實，涵蓋了產品經理從 0 到 1 再到成長的所有核心場景。

老實講，這絕對是目前裝過最豐富的技能包之一，以下是這次安裝的主要類別與核心技能：

### 1. 產品策略 (pm-product-strategy)
- **核心技能**：SWOT 分析、PESTEL 分析、波特五力模型、商業模式畫布 (Business Model Canvas)、安索夫矩陣 (Ansoff Matrix)、定價策略等。
- **應用場景**：用於產品初期定位、市場掃描及商業決策。

### 2. 產品探索 (pm-product-discovery)
- **核心技能**：機會解決方案樹 (Opportunity Solution Tree)、訪談大綱生成、需求優先級排序、指標儀表板設計。
- **應用場景**：協助 PM 從用戶回饋中提煉價值，並驗證關鍵假設。

### 3. 產品執行 (pm-execution)
- **核心技能**：PRD 生成、用戶故事 (User Stories) 撰寫、OKR 腦力激盪、Sprint 計劃、利害關係人地圖。
- **應用場景**：日常研發流程的管理與產出。

### 4. 數據分析 (pm-data-analytics)
- **核心技能**：A/B 測試分析報告、留存分析 (Cohort Analysis)、SQL 查詢生成。
- **應用場景**：輔助數據驅動的產品決策。

### 5. 市場研究與增長 (pm-market-research & pm-marketing-growth)
- **核心技能**：用戶畫像 (User Personas)、客戶旅程圖 (Customer Journey Map)、北極星指標、增長環 (Growth Loops)、競爭者戰鬥卡 (Battlecards)。
- **應用場景**：用於市場定位、競爭分析及產品上線後的增長優化。

---

說真的，有了這幾十個「外掛」技能，我現在對 PM 相關任務的處理深度完全上了一個檔次。如果你想試試看效果，可以直接叫我跑個 SWOT 分析來瞧瞧。


## 相關連結
- [[提示詞工程_Prompt_Engineering]]
- [[LLM_Wiki_Compiler]]
