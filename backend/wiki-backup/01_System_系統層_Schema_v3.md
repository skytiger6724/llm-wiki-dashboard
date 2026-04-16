# ---
tags: [Wiki, AI, Work, Schema, v3]
date: 2026-04-14
summary: "LLM Wiki Schema v3.0 - 基於 LLM Wiki V2 升級版，整合記憶生命週期、知識圖譜、自動化鉤子與混合搜尋"
version: "3.0"
upgraded_from: "v2.0"
reference: "https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2"
---

# LLM Wiki Schema v3.0

基於 [Karpathy 原始 LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) 與 [LLM Wiki V2 (agentmemory)](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2) 升級。

## 核心升級：從靜態筆記到記憶引擎

v3.0 的核心差異：知識庫不是垃圾場，是**帶生命週期的記憶引擎**。
知識會老化、會強化、會自動被取代，而不是靜態地躺在那裡。

---

## 1. 記憶分層 (Memory Lifecycle)

知識不是平等的，必須按證據強度分層。

### 1.1 鞏固階梯 (Consolidation Tiers)

| 層級 | 名稱 | 內容 | 保留策略 | 信心範圍 |
|------|------|------|----------|----------|
| Tier 0 | **Working Memory** | 原始觀察、未處理的筆記 | 7 天未處理自動降級 | 1-2 |
| Tier 1 | **Episodic Memory** | 會話摘要、壓縮後的觀察 | 30 天未訪問自動降級 | 2-3 |
| Tier 2 | **Semantic Memory** | 跨會話事實、已鞏固知識 | 90 天未訪問降權 | 3-4 |
| Tier 3 | **Procedural Memory** | 工作流程、模式、SOP | 長期保留，低衰減 | 4-5 |

**晉升規則**：
- 同一事實被 2+ 獨立來源確認 → 晉升一層
- 知識被查詢 3+ 次 → 晉升一層
- 新資訊 contradicts 舊資訊 → 觸發 supersession 流程

**降級規則**：
- 超過保留期未訪問/未強化 → 降權（不被刪除，但搜索排名下降）
- 被更新版本 supersede → 標記 `[Superseded]`，保留但降權

### 1.2 信心打分 (Confidence Scoring)

每個事實必須攜帶信心分數 (1-5)：

```yaml
confidence: 3  # 1=未驗證碎片, 5=核心公理
decay_factor: 0.3  # 0=永恆, 1=極易過時
last_verified: 2026-04-14
sources_count: 2
contradictions: []
```

**信心計算**：
```
confidence = base_score × (1 + sources_bonus) × time_decay × contradiction_penalty

sources_bonus = min(sources_count - 1, 3) × 0.1  # 最多 +0.3
time_decay = exp(-decay_factor × days_since_verified / 365)
contradiction_penalty = 0.5 if has_contradictions else 1.0
```

### 1.3 遺忘曲線 (Forgetting Curve)

基於 Ebbinghaus 遺忘曲線：
```
retention(t) = exp(-t / τ)
τ = 衰減常數 (依知識類型調整)
```

- 架構決策：τ = 365 天（慢衰減）
- 技術趨勢：τ = 180 天（中衰減）
- 臨時 bug：τ = 30 天（快衰減）
- 新聞事件：τ = 7 天（極快衰減）

每次訪問/確認/新來源 → 重置曲線。

---

## 2. 知識圖譜 (Knowledge Graph)

Wiki 不只是頁面，是**類型化知識圖譜**。

### 2.1 實體類型 (Entity Types)

| 類型 | 說明 | 示例 |
|------|------|------|
| `Person` | 人物 | Andrej Karpathy, Sarah Chen |
| `Project` | 專案/計畫 | Auth migration, LLM Wiki v3 |
| `Library` | 庫/框架 | React, Express, Redis |
| `Concept` | 概念/模式 | RAG, Memory lifecycle, Crystallization |
| `File` | 檔案/文檔 | schema.md, server.js |
| `Decision` | 決策/抉擇 | Use Redis for caching, Adopt v3 schema |
| `Bug` | 缺陷/問題 | Port 3001 EADDRINUSE |
| `Pattern` | 最佳實踐/模式 | Express route order, Signal handling |

### 2.2 關係類型 (Relationship Types)

關係不只是 `[[A]] → [[B]]`，必須攜帶語義：

| 關係 | 權重 | 說明 |
|------|------|------|
| `uses` | 0.8 | A 使用 B |
| `depends_on` | 0.9 | A 依賴 B |
| `contradicts` | -1.0 | A 與 B 矛盾 |
| `caused` | 0.7 | A 導致 B |
| `fixed` | 0.8 | A 修復了 B |
| `supersedes` | 1.0 | A 取代了 B（舊版降權） |
| `relates_to` | 0.3 | A 與 B 相關（弱連結） |
| `owns` | 0.6 | A 擁有/負責 B |
| `opposes` | -0.5 | A 反對 B |

**格式**：
```markdown
[[A]] --(uses:0.8)--> [[B]]
[[A]] --(supersedes:1.0)--> [[B]]  # B 被 A 取代
```

### 2.3 圖譜遍歷 (Graph Traversal)

查詢時不只是關鍵字搜索，要走圖譜：
1. 找到起點實體節點
2. 沿關係邊向外遍歷（2-3 跳）
3. 收集所有相關節點
4. 按關係權重和信心分數排序

示例：「升級 Redis 的影響？」
→ 找到 Redis 節點
→ 沿 `uses` 和 `depends_on` 向外走
→ 找到所有下游節點
→ 返回影響清單

---

## 3. 混合搜尋 (Hybrid Search)

單一搜索不夠，需要三流融合。

### 3.1 搜索流

| 流 | 技術 | 擅長 | 示例 |
|----|------|------|------|
| **BM25** | 關鍵字匹配 + 詞幹提取 + 同義詞 | 精確術語 | "EADDRINUSE" |
| **Vector** | 語義相似度 (embeddings) | 概念關聯 | "端口佔用" → "EADDRINUSE" |
| **Graph** | 實體關係遍歷 | 結構連接 | "Redis" → 所有依賴它的項目 |

### 3.2 結果融合 (RRF - Reciprocal Rank Fusion)

```
score(d) = Σ (1 / (k + rank_i(d)))  # k=60 是常用常數
```

每個搜索流返回排序列表，RRF 融合後返回 Top-N。

### 3.3 index.md 定位

- 保留作為人類可讀目錄
- 不作為 LLM 主要搜索機制（超過 100 頁後太長）
- 定期自動更新

---

## 4. 自動化鉤子 (Automation Hooks)

從手動到事件驅動。

### 4.1 事件觸發器

| 事件 | 觸發動作 |
|------|----------|
| `on_new_source` | 自動 ingest → 提取實體 → 更新圖譜 → 更新索引 |
| `on_session_start` | 根據近期活動加載相關上下文 |
| `on_session_end` | 壓縮會話為觀察 → 歸檔洞察 |
| `on_query` | 檢查答案是否值得寫回 wiki（質量分數 > 閾值） |
| `on_memory_write` | 檢查與現有知識的矛盾 → 觸發 supersession |
| `on_schedule` (每日) | 定期 lint、鞏固、衰減計算 |
| `on_schedule` (每週) | 深度清理、孤立節點處理 |

### 4.2 人工審核點

自動化不意味著無人管，以下需要人工確認：
- 信心分數 < 2 的內容被晉升到 Tier 2+
- 矛盾解決提案（系統建議哪個更可信）
- 批量刪除/合併操作
- 新實體類型定義

---

## 5. 質量與自癒 (Quality & Self-Healing)

### 5.1 質量評分

每個 LLM 生成的內容必須評分：

| 維度 | 說明 | 閾值 |
|------|------|------|
| **結構** | 是否符合元數據規範 | ≥ 3/5 |
| **引用** | 是否標註來源 | ≥ 2 個來源 |
| **一致性** | 是否與現有 wiki 矛盾 | 無未解決矛盾 |
| **準確性** | 事實是否正確 | 經抽查驗證 |

低於閾值的內容：
- 標記 `[Needs Review]`
- 自動重寫一次
- 如果還是不行 → 人工審核

### 5.2 自癒機制

Lint 不只是檢查，要自動修復：
- **孤立頁面** → 自動添加反向連結或標記 `[Orphan]`
- **過時聲明** → 標記 `[Stale]` 並建議更新
- **斷裂交叉引用** → 自動修復或移除
- **重複實體** → 建議合併

wiki 應該自己走向健康，而不是等人來修理。

### 5.3 矛盾解決

1. 檢測矛盾（關鍵字/語義匹配找到衝突聲明）
2. 評估可信度：
   - 來源新度（越新越可信）
   - 來源權威性（論文 > 部落格 > 觀察）
   - 支持來源數量
3. 提案解決方案（自動）
4. 人工確認或自動執行（信心差距 > 1 時自動執行）

---

## 6. 結晶 (Crystallization)

探索本身就是知識來源。

### 6.1 結晶流程

當完成一個工作鏈（調研、除錯、分析）：
1. **提取問題**：當初要解決什麼？
2. **提取發現**：找到了什麼？
3. **提取實體**：涉及哪些檔案/概念/決策？
4. **提取教訓**：什麼可以重用？
5. **生成摘要**：結構化結晶頁面
6. **更新圖譜**：強化相關節點的信心
7. **挑戰現有**：如果有矛盾，觸發 supersession

### 6.2 結晶輸出

結晶結果是**一等 wiki 頁面**，格式：
```markdown
# [Crystallized] 主題名稱

## 原始問題
## 關鍵發現
## 涉及實體
## 提取教訓
## 信心與來源
```

---

## 7. 輸出格式 (Beyond Markdown)

Wiki 是知識存儲，輸出格式取決於受眾。

| 查詢類型 | 推薦輸出 |
|----------|----------|
| 比較 | 比較表格 |
| 時間線 | 時間軸可視化 |
| 依賴分析 | 依賴圖 |
| 簡報 | 投影片 (Marp/PPTX) |
| 數據分析 | JSON/CSV 導出 |
| 團隊同步 | 簡報摘要 |

---

## 8. 隱私與治理 (Privacy & Governance)

### 8.1 入站過濾

寫入 wiki 前自動過濾：
- API keys、tokens、密碼 → 自動移除
- 個人身份信息 (PII) → 標記或匿名化
- 標記 `@private` 的內容 → 不進入共享 wiki

### 8.2 審計追蹤

每次操作都記錄：
```markdown
## Log Entry
- **時間**: 2026-04-14-1430
- **操作**: ingest/update/delete/query
- **目標**: [[Entity Name]]
- **變更**: 摘要
- **原因**: 觸發事件
```

### 8.3 批量操作治理

- 批量刪除/合併 → 需要確認 + 可回滾
- 導出子集 → 記錄誰導出了什麼
- 合併重複實體 → 保留歷史版本

---

## 9. 實施路線圖

不需要一次做完，按需求疊加。

### Phase 1: MVP Wiki（現有）
- ✅ 原始資料 + Wiki 頁面 + index.md + Schema
- ✅ 基本 ingest/query/lint 流程

### Phase 2: 生命週期管理（本次升級）
- ✅ 信心打分
- ✅ Supersession 機制
- ✅ 基礎衰減計算
- ✅ 鞏固階梯

### Phase 3: 結構化（下一步）
- ⏳ 實體提取
- ⏳ 類型化關係
- ⏳ 知識圖譜

### Phase 4: 自動化
- ⏳ 事件鉤子
- ⏳ 自動 lint
- ⏳ 上下文注入

### Phase 5: 規模化
- ⏳ 混合搜尋
- ⏳ 質量評分
- ⏳ 自癒機制

### Phase 6: 協作（可選）
- ⏳ Mesh sync
- ⏳ 共享/私有分層
- ⏳ 工作協調

---

## 處理流程 (v3.0)

```
┌─────────────────┐
│  新來源/會話結束  │
└────────┬────────┘
         ▼
┌─────────────────┐
│ 1. 入站過濾      │  ← 移除敏感信息
└────────┬────────┘
         ▼
┌─────────────────┐
│ 2. Ingest       │  ← 生成摘要，存入 Working Memory
└────────┬────────┘
         ▼
┌─────────────────┐
│ 3. 實體提取      │  ← 提取 Entities/Relationships
└────────┬────────┘
         ▼
┌─────────────────┐
│ 4. 圖譜更新      │  ← 更新節點和邊
└────────┬────────┘
         ▼
┌─────────────────┐
│ 5. 矛盾檢查      │  ← 檢查衝突，觸發 supersession
└────────┬────────┘
         ▼
┌─────────────────┐
│ 6. 鞏固檢查      │  ← 是否滿足晉升條件？
└────────┬────────┘
         ▼
┌─────────────────┐
│ 7. 索引更新      │  ← 更新 index.md
└─────────────────┘
```

---

## 元數據模板

```yaml
---
title: "頁面名稱"
type: "entity|concept|summary|crystallized"
tier: 0|1|2|3  # 鞏固階梯
confidence: 1-5
decay_factor: 0-1
last_verified: YYYY-MM-DD
sources:
  - "[[來源 1]]"
  - "[[來源 2]]"
contradictions: []
tags: [標籤 1, 標籤 2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

---

## 參考

- [Karpathy LLM Wiki (原始)](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [LLM Wiki V2 (agentmemory)](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2)
- [Ebbinghaus Forgetting Curve](https://en.wikipedia.org/wiki/Forgetting_curve)
- [Reciprocal Rank Fusion](https://plg.uwaterloo.ca/~gvcormack/cormacksigir09-rrf.pdf)
