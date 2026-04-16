# LLM Wiki 頁面內容規範 v3.0

**版本**: 3.0
**日期**: 2026-04-14
**狀態**: ✅ 強制執行

---

## 核心原則

每個 Wiki 頁面必須是**結構化、可追溯、有生命週期**的知識單元。

不是寫完就丟在那裡，而是**帶著信心的知識聲明**。

---

## 1. YAML Front Matter (必填)

**每個頁面必須有**，少一個欄位都不行。

```yaml
---
title: "頁面完整名稱"
type: "entity|concept|summary|crystallized|raw"
tier: 0|1|2|3
confidence: 1|2|3|4|5
decay_factor: 0.0-1.0
last_verified: YYYY-MM-DD
sources:
  - "[[來源頁面名]]"
  - "[[另一個來源]]"
contradictions: []
tags: [標籤 1, 標籤 2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

### 欄位說明

| 欄位 | 必填 | 說明 | 示例 |
|------|------|------|------|
| `title` | ✅ | 人類可讀的頁面名稱 | "LLM Wiki Schema v3.0" |
| `type` | ✅ | 頁面類型 | `entity`, `concept`, `summary`, `crystallized`, `raw` |
| `tier` | ✅ | 鞏固階梯 (0=工作記憶, 3=程序記憶) | `2` |
| `confidence` | ✅ | 信心分數 (1-5) | `4` |
| `decay_factor` | ✅ | 衰減係數 (0=永恆, 1=極易過時) | `0.2` |
| `last_verified` | ✅ | 最後驗證日期 | `2026-04-14` |
| `sources` | ✅ | 來源清單 (至少 1 個) | `["[[Karpathy_LLM_Wiki_Gist]]"]` |
| `contradictions` | ⚠️ | 已知矛盾 (有就填) | `["[[舊版聲明]]"]` |
| `tags` | ⚠️ | 標籤 (建議填) | `["Wiki", "AI"]` |
| `created` | ⚠️ | 創建日期 | `2026-04-09` |
| `updated` | ⚠️ | 最後更新日期 | `2026-04-14` |

### 質量門檻

- **必填欄位** (`title`, `type`, `tier`, `confidence`, `decay_factor`, `last_verified`, `sources`): 缺一不可
- **缺少任一必填** → 結構評分 = 0
- **sources 為空** → 引用評分 ≤ 1
- **last_verified 超過 90 天** → 信心自動衰減

---

## 2. 頁面結構規範

### 2.1 Entity (實體) 頁面

```markdown
# [[實體名稱]]

## 核心定義
- 這是什麼：一句話定義
- 類型：Person/Project/Library/File/Decision/Bug/Pattern

## 關鍵事實
- 事實 1（來源：[[來源頁面]]）
- 事實 2（來源：[[來源頁面]]）
- 事實 3（來源：[[來源頁面]]）

## 關係
- [[A]] --(uses:0.8)--> [[B]]
- [[A]] --(depends_on:0.9)--> [[C]]

## 參考來源
- [[來源 1]]
- [[來源 2]]
```

### 2.2 Concept (概念) 頁面

```markdown
# [[概念名稱]]

## 核心定義
- 概念說明：一句話解釋
- 相關領域：AI, Knowledge Management, etc.

## 關鍵事實
- 要點 1
- 要點 2
- 要點 3

## 應用場景
- 場景 1：說明
- 場景 2：說明

## 參考來源
- [[來源 1]]
- [[來源 2]]
```

### 2.3 Summary (摘要) 頁面

```markdown
# [[摘要名稱]]

## 原始來源
- 來源：[[原始檔案]]
- 類型：文章/報告/會議記錄/書籍
- 日期：YYYY-MM-DD

## 核心摘要
- 重點 1
- 重點 2
- 重點 3

## 涉及實體
- [[實體 1]]
- [[實體 2]]

## 參考來源
- [[原始檔案]]
```

---

## 3. 引用規範

### 3.1 來源要求

**每個頁面必須有至少 1 個來源。**

來源可以是：
- 原始資料檔案 (`02_Raw_原始資料/` 下的檔案)
- 其他 Wiki 頁面
- 外部 URL（標註 `[外部]`）

### 3.2 來源格式

```yaml
sources:
  - "[[Karpathy_LLM_Wiki_Gist]]"         # Wiki 內部來源
  - "[[20260414_LLM_Wiki_V2_Gist]]"      # 原始資料來源
  - "[外部] https://example.com/article" # 外部來源
```

### 3.3 內文引用

重要聲明必須標註來源：

```markdown
LLM Wiki 的核心思想是停止重新推導，開始編譯。[[Karpathy_LLM_Wiki_Gist]]
```

不是所有句子都要標，但**關鍵事實和數字**必須有來源。

---

## 4. 信心分數指南

| 分數 | 定義 | 條件 | 示例 |
|------|------|------|------|
| **5** | 核心公理 | 3+ 獨立來源 + 原始論文/文檔 | Karpathy 的原始 LLM Wiki 理念 |
| **4** | 高度可靠 | 2+ 來源 + 已驗證 | 經過實踐驗證的技術方案 |
| **3** | 中等可靠 | 1-2 來源 + 基本合理 | 一般摘要和觀察 |
| **2** | 待驗證 | 單一來源 + 未驗證 | 初步觀察、個人筆記 |
| **1** | 未經驗證 | 無明確來源 | 碎片化筆記、臨時想法 |

### 信心衰減

```
有效信心 = confidence × exp(-decay_factor × days_since_verified / 365)
```

- **decay_factor = 0.0**: 永不分類（如數學定理）
- **decay_factor = 0.1**: 慢衰減（架構決策、核心概念）
- **decay_factor = 0.3**: 中衰減（技術趨勢、最佳實踐）
- **decay_factor = 0.7**: 快衰減（新聞、市場觀察）
- **decay_factor = 1.0**: 極快衰減（每日快報、臨時觀察）

---

## 5. 鞏固階梯 (Consolidation Tiers)

| Tier | 名稱 | 定義 | 晉升條件 |
|------|------|------|----------|
| **0** | Working Memory | 原始觀察，未處理 | 新創建的頁面 |
| **1** | Episodic Memory | 壓縮後的會話摘要 | 結構完整 + 有來源 |
| **2** | Semantic Memory | 跨會話事實，已鞏固 | 2+ 來源 + 被查詢 3+ 次 |
| **3** | Procedural Memory | 工作流程、SOP | 3+ 來源 + 實踐驗證 + 信心≥4 |

### 降級條件

- **Tier 1 → Tier 0**: 30 天未訪問
- **Tier 2 → Tier 1**: 90 天未訪問
- **Tier 3 → Tier 2**: 180 天未訪問

---

## 6. 寫作風格

### 必須
- ✅ 使用清單和短句
- ✅ 每個章節至少 2-3 個要點
- ✅ 關鍵事實標註來源
- ✅ 使用 wikilinks 連接相關概念

### 禁止
- ❌ 大段落（超過 5 行）
- ❌ 沒有章節結構
- ❌ 沒有來源聲明的關鍵事實
- ❌ 孤立頁面（沒有任何 wikilinks）

---

## 7. 質量自檢清單

每次創建或更新頁面時，檢查：

- [ ] 有 YAML front matter
- [ ] 所有必填欄位已填
- [ ] 至少 1 個來源
- [ ] 有至少 2 個章節
- [ ] 有 wikilinks 連接到其他頁面
- [ ] 關鍵事實有來源標註

**6 項全勾 = 合格**
**4-5 項 = [Needs Review]**
**< 4 項 = 不合格，需要改進**

---

## 8. 範例

### ✅ 合格頁面範例

```yaml
---
title: "LLM Wiki Schema v3.0"
type: "concept"
tier: 2
confidence: 4
decay_factor: 0.1
last_verified: 2026-04-14
sources:
  - "[[Karpathy_LLM_Wiki_Gist]]"
  - "[[LLM_Wiki_V2_Gist]]"
contradictions: []
tags: [Wiki, AI, Schema]
created: 2026-04-14
updated: 2026-04-14
---
```

# LLM Wiki Schema v3.0

## 核心定義
- 這是什麼：LLM Wiki 的工作規範，定義了如何創建、維護和驗證知識
- 版本：v3.0，基於 Karpathy 原始概念和 LLM Wiki V2 升級

## 關鍵事實
- 基於三層架構：原始資料 → Wiki → Schema [[Karpathy_LLM_Wiki_Gist]]
- V2 升級增加了生命週期管理和知識圖譜 [[LLM_Wiki_V2_Gist]]
- 核心原則：停止重新推導，開始編譯

## 處理流程
- **Ingest**: 原始資料匯入
- **Compile**: 知識提取和編譯
- **Lint**: 質量和一致性檢查

## 參考來源
- [[Karpathy_LLM_Wiki_Gist]]
- [[LLM_Wiki_V2_Gist]]
- [[Schema_v3_Upgrade]]
```

### ❌ 不合格頁面範例

```markdown
# 某個概念

這是一段沒有結構的文字。不知道在說什麼。沒有來源。沒有 wikilinks。
也沒有 front matter。
```

---

## 9. 自動檢查

系統會自動檢查每個頁面：

```bash
# 質量評分
curl http://localhost:3001/api/quality

# 自動 Lint
curl http://localhost:3001/api/lint
```

低於閾值的頁面會自動被標記 `[Needs Review]`。

---

*本規範由 LLM Wiki v3.0 系統維護，最後更新：2026-04-14*
