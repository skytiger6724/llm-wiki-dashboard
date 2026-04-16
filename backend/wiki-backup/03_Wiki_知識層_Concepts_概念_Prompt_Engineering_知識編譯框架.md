# ---
title: "Prompt Engineering 知識編譯框架"
type: "concept"
tier: 2
confidence: 4
decay_factor: 0.2
last_verified: 2026-04-14
sources:
  - "[[如何掌握 Prompt Engineering]]"
  - "[[LLM Wiki Schema v3.0]]"
  - "[[LLM Wiki V2 戰略結晶]]"
contradictions: []
tags: ["Prompt", "AI", "Knowledge-Management", "Framework"]
created: 2026-04-14
updated: 2026-04-14
---

# Prompt Engineering 知識編譯框架

基於 7 條核心規則 + LLM Wiki v3.0 Schema 設計的**知識編譯專用 Prompt 系統**。

---

## 框架定位

這不是通用的 Prompt 模板。
這是專門為**知識編譯**（Ingest → Compile → Crystallize → Lint）設計的 Prompt 架構。

目標：讓 LLM 從「隨意聊天」變成「紀律嚴明的知識工作者」。

---

## 核心設計原則

### 1. 清晰 > 技巧

**問題**: 大多数人跳過「思考階段」，直接打字。
**解法**: 在打開聊天框之前，先搞清楚自己要什麼。

**知識編譯應用**:
```
❌ 模糊: "幫我總結這篇文章"
✅ 清晰: "從這篇文章提取 3-5 個關鍵事實，每個事實標註來源段落，
          按 Entity/Concept/Decision 分類，
          輸出格式符合 LLM Wiki v3.0 Schema"
```

### 2. 上下文工程

**規則**: 創建 `context.json`，讓 AI 採訪你建立專案上下文。

**知識編譯應用**:
```yaml
context:
  wiki_root: "21_LLM_Wiki_核心知識庫"
  schema_version: "v3.0"
  current_tier: "Phase 3-6 已實裝"
  quality_threshold: 60  # 質量門控閾值
  entity_types: [Person, Project, Library, Concept, File, Decision, Bug, Pattern]
  relation_types: [uses, depends_on, contradicts, caused, fixed, supersedes, relates_to, owns, opposes]
```

### 3. 任務拆解

**規則**: 把過程拆成明確步驟，按順序執行。

**知識編譯應用**:
```
Step 1: 讀取原始資料 → 生成摘要
Step 2: 提取實體（人名/專案/概念/決策）
Step 3: 建立 wikilinks 和關係
Step 4: 計算信心分數和衰減係數
Step 5: 檢查矛盾和重複
Step 6: 輸出符合 Schema v3.0 的 Wiki 頁面
```

### 4. 格式規範

**規則**: 指定輸出格式，格式本身就是規格。

**知識編譯應用**: 每種編譯任務都有專屬輸出模板（見下方）。

### 5. 示例驅動

**規則**: 提供 3-5 個合格示例，強制模型在特定隧道中工作。

**知識編譯應用**: 每個 Prompt 模板都附帶合格/不合格示例。

### 6. 角色設定

**規則**: 捕捉專家的「氣質」，不是羅列資歷。

**知識編譯應用**:
```
❌ "你是一個知識管理專家"
✅ "你是那種能把雜亂筆記變成結構化知識體系的人，
    是那種看到碎片資訊就能自動提取實體、建立連結、
    判斷信心等級的知識圖書館員。"
```

### 7. 約束定義

**規則**: 3-5 個約束，寫清楚不想看到什麼。

**知識編譯約束**:
- ❌ 不要大段落（超過 5 行）
- ❌ 不要沒有來源聲明的關鍵事實
- ❌ 不要孤立頁面（必須有 wikilinks）
- ❌ 不要缺少 front matter
- ❌ 不要使用模糊語言（「可能」、「也許」除非標註信心 < 3）

---

## 知識編譯 Prompt 模板

### Template 1: Ingest（匯入）

**用途**: 將原始資料轉化為 Wiki 摘要

```markdown
# Role
你是 LLM Wiki v3.0 的知識編譯引擎。
你的工作是將原始資料轉化為結構化摘要，符合 Schema v3.0 規範。

# Context
- Wiki Schema: v3.0
- 鞏固階梯: Tier 0 → Tier 1（Working → Episodic）
- 信心起點: 2（待驗證）
- 衰減係數: 0.5（原始資料）

# Task
讀取以下原始資料，生成符合規範的摘要頁面：

1. 提取 3-5 個關鍵事實
2. 識別涉及的實體（Entity/Concept/Decision）
3. 建立 wikilinks 到現有知識庫
4. 標註每個事實的來源段落

# Output Format
```yaml
---
title: "[摘要名稱]"
type: "summary"
tier: 1
confidence: 2
decay_factor: 0.5
last_verified: YYYY-MM-DD
sources:
  - "[[原始資料檔案名]]"
contradictions: []
tags: [標籤 1, 標籤 2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

# [摘要名稱]

## 原始來源
- 來源：[[原始檔案]]
- 類型：[文章/報告/會議記錄/書籍]
- 日期：YYYY-MM-DD

## 核心摘要
- [關鍵事實 1]（來源：第 X 段）
- [關鍵事實 2]（來源：第 X 段）
- [關鍵事實 3]（來源：第 X 段）

## 涉及實體
- [[實體 1]]
- [[實體 2]]

## 參考來源
- [[原始檔案]]

# Constraints
- 摘要不超過 5 個要點
- 每個要點必須標註來源段落
- 必須建立至少 2 個 wikilinks
- 不要添加原始資料中沒有的資訊
- 不要大段落（超過 5 行）

# Input
[在此貼上原始資料]
```

---

### Template 2: Compile（編譯）

**用途**: 從摘要中提取實體和概念，建立知識圖譜

```markdown
# Role
你是 LLM Wiki v3.0 的知識圖譜建構師。
你能從摘要中自動識別實體類型、建立關係、推斷信心分數。

# Context
- 實體類型: Person, Project, Library, Concept, File, Decision, Bug, Pattern
- 關係類型: uses, depends_on, contradicts, caused, fixed, supersedes, relates_to, owns, opposes
- 信心指南: 5=公理, 4=高度可靠, 3=中等, 2=待驗證, 1=未經驗證

# Task
從以下摘要中提取並建立實體頁面：

1. 識別所有 Entity 和 Concept
2. 為每個實體創建獨立 Wiki 頁面
3. 建立實體之間的關係（使用 --(關係:權重)--> 格式）
4. 計算信心分數（基於來源數量和被引用次數）
5. 設置衰減係數（概念=0.1, 實體=0.2, 決策=0.3）

# Output Format（每個實體）
```yaml
---
title: "[實體名稱]"
type: "entity|concept"
tier: 1
confidence: [1-5]
decay_factor: [0.0-1.0]
last_verified: YYYY-MM-DD
sources:
  - "[[來源摘要]]"
contradictions: []
tags: ["entity|concept", "分類"]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

# [[實體名稱]]

## 核心定義
- 這是什麼：一句話定義
- 類型：[Person/Project/Library/Concept/...]

## 關鍵事實
- [事實 1]（來源：[[來源]]）
- [事實 2]（來源：[[來源]]）

## 關係
- [[本實體]] --(關係:權重)--> [[相關實體]]

## 參考來源
- [[來源 1]]
- [[來源 2]]

# Constraints
- 每個實體必須有至少 1 個 wikilinks
- 關係必須有明確類型（不是模糊的「相關」）
- 信心分數必須有依據（來源數量、被引用次數）
- 不要創建孤立頁面（必須連接到知識圖譜）

# Input
[在此貼上摘要清單]
```

---

### Template 3: Crystallize（結晶）

**用途**: 將多個相關主題彙整為高濃度共識檔案

```markdown
# Role
你是 LLM Wiki v3.0 的知識結晶引擎。
你能從多個來源中提取共識、識別矛盾、生成高濃度知識。

# Context
- 結晶條件: 5+ 相關來源
- 目標階梯: Tier 2 → Tier 3（Semantic → Procedural）
- 信心目標: 4-5（高度可靠 → 核心公理）

# Task
將以下相關主題結晶為高濃度共識檔案：

1. 提取所有來源的共同事實（共識）
2. 識別矛盾和不一致之處
3. 基於來源新度和權威性解決矛盾
4. 生成結晶頁面（信心 4-5）
5. 更新被 supersede 的舊頁面

# Output Format
```yaml
---
title: "[Crystallized] 主題名稱"
type: "crystallized"
tier: 3
confidence: [4-5]
decay_factor: 0.1
last_verified: YYYY-MM-DD
sources:
  - "[[來源 1]]"
  - "[[來源 2]]"
  - "[[來源 3]]"
contradictions:
  - "[[舊版聲明]]: 已被本頁 supersede"
tags: ["crystallized", "主題"]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

# [Crystallized] 主題名稱

## 原始問題
[這個結晶要解決什麼問題？]

## 共識事實
- [事實 1]（支持來源: [[A]], [[B]], [[C]]）
- [事實 2]（支持來源: [[A]], [[D]]）

## 矛盾與解決
- [矛盾點]: [[舊版]] 說 X，[[新版]] 說 Y
  - 解決方案: 採用 Y（依據: 來源新度 + 更多支持）
  - 舊版標記: [Superseded]

## 提取教訓
- [可重用的模式或原則]

## 信心與來源
- 信心: [4-5]/5
- 來源數: X 個獨立來源
- 最後驗證: YYYY-MM-DD

# Constraints
- 必須有至少 5 個來源
- 必須明確列出矛盾和解決方案
- 信心必須 ≥ 4
- 必須標註被 supersede 的舊版聲明
- 提取的教訓必須可獨立重用

# Input
[在此貼上相關主題清單]
```

---

### Template 4: Lint（檢查）

**用途**: 自動檢查和修復知識庫健康度

```markdown
# Role
你是 LLM Wiki v3.0 的自動 Lint 引擎。
你的工作是檢測知識庫健康度，找出問題並自動修復。

# Context
- Schema: v3.0
- 質量閾值: 60%
- 檢查維度: 結構、引用、一致性

# Task
對以下 Wiki 頁面進行健康檢查：

1. 檢測孤立頁面（無 wikilinks）
2. 檢測斷裂引用（指向不存在的頁面）
3. 檢測重複實體（名稱相似或指向相同內容）
4. 檢測過時聲明（被 supersede 但未標記）
5. 檢測缺少 front matter 的頁面
6. 對每個問題提出修復建議

# Output Format
## Lint 報告

### 統計
- 總頁面: X
- 孤立頁面: X
- 斷裂引用: X
- 重複實體: X
- 過時聲明: X
- 缺少 front matter: X

### 問題清單
| # | 類型 | 頁面 | 嚴重度 | 建議修復 |
|---|------|------|--------|----------|
| 1 | orphan | [頁面名] | warning | 添加反向連結或標記 [Orphan] |
| 2 | broken_ref | [頁面名] | error | 移除或修復引用 |
| 3 | duplicate | [頁面名] | warning | 合併到 [現有頁面] |
| 4 | stale | [頁面名] | info | 添加 [Superseded] 標記 |

### 自動修復
- [ ] 為 X 個孤立頁面添加 [Orphan] 標記
- [ ] 為 X 個過時聲明添加 [Superseded] 標記
- [ ] 修復 X 個斷裂引用

# Constraints
- 嚴重度分級: error > warning > info
- 自動修復只添加標記，不刪除內容
- 合併重複需要人工確認
- 報告必須包含具體的修復建議

# Input
[在此貼上 Wiki 頁面清單或圖譜數據]
```

---

### Template 5: 批量 Front Matter 修復

**用途**: 為缺少 front matter 的頁面自動生成元數據

```markdown
# Role
你是 LLM Wiki v3.0 的元數據補全引擎。
你能從頁面內容自動推斷並補全 YAML front matter。

# Task
為以下沒有 front matter 的頁面生成元數據：

1. 從檔案名稱和路徑推斷類型（entity/concept/summary/crystallized/raw）
2. 從 wikilinks 數量推斷信心分數
3. 從內容類型推斷衰減係數
4. 從 wikilinks 提取前 3 個作為來源
5. 生成符合 Schema v3.0 的 front matter

# 推斷規則
| 維度 | 規則 |
|------|------|
| type | 路徑包含 'entity' → entity, 'concept' → concept, 'summary' → summary, 'crystallized' → crystallized, 否則 → concept |
| confidence | wikilinks ≥ 10 → 4, ≥ 5 → 3, 否則 → 2 |
| decay_factor | concept → 0.1, entity → 0.2, summary → 0.3, crystallized → 0.1, raw → 0.5 |
| sources | 從 wikilinks 提取前 3 個，如果沒有 → ["[[Index]]"] |
| tier | 新頁面 → 1, 有 2+ 來源 → 2, 3+ 來源 + 信心≥4 → 3 |

# Output Format（只輸出 front matter 區塊）
```yaml
---
title: "[從檔案名推斷]"
type: "[推斷類型]"
tier: [推斷階梯]
confidence: [推斷信心]
decay_factor: [推斷衰減]
last_verified: YYYY-MM-DD
sources:
  - "[[來源 1]]"
contradictions: []
tags: ["[類型]", "[分類]"]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

# Constraints
- 不要修改原始內容，只添加 front matter
- 來源必須是有效的 wikilinks
- 信心分數必須有依據
- 如果無法推斷類型，預設為 concept

# Input
[在此貼上沒有 front matter 的頁面內容]
```

---

## Prompt 使用流程

```
┌─────────────────────────────┐
│  1. 選擇模板                 │
│     (Ingest/Compile/         │
│      Crystallize/Lint/Fix)   │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│  2. 填寫上下文               │
│     (context.json 或手動)    │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│  3. 貼上原始資料             │
│     (文章/摘要/頁面清單)     │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│  4. LLM 執行                 │
│     (按模板格式輸出)         │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│  5. 質量門控檢查             │
│     (POST /api/quality-gate) │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│  6. 寫入 Wiki                │
│     (通過 → 寫入             │
│      不通過 → 修改重試)     │
└─────────────────────────────┘
```

---

## 合格 vs 不合格示例

### ✅ 合格 Prompt

```
Role: 知識編譯引擎
Context: Schema v3.0, Tier 1
Task: 從這篇文章提取 3-5 個關鍵事實，按 Entity/Concept 分類，
      建立 wikilinks，標註來源段落
Format: 符合 Summary 模板
Constraints: 不超過 5 要點、每個要點有來源、至少 2 個 wikilinks
Input: [文章內容]
```

### ❌ 不合格 Prompt

```
幫我總結這篇文章
```

---

## 與 LLM Wiki v3.0 Schema 的對應

| Prompt 模板 | Schema 階段 | 鞏固階梯 | 信心範圍 |
|-------------|-------------|----------|----------|
| Ingest | Phase 1 | Tier 0 → 1 | 2 |
| Compile | Phase 3 | Tier 1 → 2 | 2-4 |
| Crystallize | Phase 5 | Tier 2 → 3 | 4-5 |
| Lint | Phase 4 | 所有階梯 | 不變 |
| Fix | Phase 5 | 所有階梯 | 提升 0-1 |

---

## 參考

- [[如何掌握 Prompt Engineering]] — 7 條核心規則
- [[LLM Wiki Schema v3.0]] — 知識庫規範
- [[LLM Wiki V2 戰略結晶]] — 戰略參考
- [[Content_Guidelines]] — 內容規範
