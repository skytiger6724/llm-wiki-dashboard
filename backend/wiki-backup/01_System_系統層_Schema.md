# ---
tags: [Wiki, AI, Work]
date: 2026-04-13
summary: "[[LLM Wiki]] 工作規範 (Schema) v2.0 - 動態代謝與權重加強"
---

# [[LLM Wiki]] 工作規範 (Schema) v2.0

## 核心邏輯
1. **原始資料優先**：所有 Wiki 頁面必須溯源至 `02_Raw_原始資料`。
2. **增量更新**：當新資料匯入時，必須同時檢查並更新相關的 Entity (實體) 與 Concept (概念) 頁面。
3. **連結為王**：使用 `雙括號` 建立強連結，並標註語義權重（如：`[[A]] --(關係:權重)--> [[B]]`）。
4. **動態代謝**：知識具備時效性，透過 `confidence` 與 `decay_factor` 決定其檢索權重。

## 元數據 (Metadata) 規範
每個 Wiki 頁面必須包含以下 YAML 屬性：
- **confidence (1-5)**：1=未經驗證/碎片；5=核心公理/原始論文。
- **decay_factor (0-1)**：0=永恆知識；1=極易過時（如每日新聞）。
- **last_verified**：最後一次知識檢核的時間戳。

## 寫作風格
- **簡明扼要**：使用清單與短句，避免大段落。
- **結構化**：每個 Entity/Concept 頁面需包含 `## 核心定義`、`## 關鍵事實` 與 `## 參考來源`。
- **動態性**：Wiki 內容應隨著新資料的輸入而不斷編譯與精煉。

## 處理流程
- **Ingest (匯入)**：將原始檔案存入 `02_Raw` -> 生成摘要存入 `03_Wiki/Summaries`。
- **Compile (編譯)**：根據摘要內容更新 `03_Wiki/Entities` 與 `03_Wiki/Concepts`。
- **Crystallize (結晶)**：當某主題累積 5+ 來源時，彙整為 `03_Wiki/05_Crystallized` 下的高濃度共識檔案。
- **Conflict Resolution (衝突解決)**：定期掃描，若新舊資訊衝突，標記舊條目為 `[Superseded]` 並建立入站連結指向新知識。
- **Lint (檢查)**：定期掃描 Wiki 頁面是否有矛盾或孤立連結。

