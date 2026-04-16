# ---
title: "LLM Wiki V2 戰略結晶"
type: "crystallized"
tier: 3
confidence: 5
decay_factor: 0.1
last_verified: 2026-04-14
sources:
  - "[[Karpathy_LLM_Wiki_Gist]]"
  - "[[LLM_Wiki_V2_Gist]]"
contradictions: []
tags: [Wiki, AI, Knowledge-Management, Schema, v3]
created: 2026-04-14
updated: 2026-04-14
---

# [Crystallized] LLM Wiki V2 戰略結晶

## 原始問題
如何讓 LLM Wiki 在規模增長時保持有用，而不是變成知識垃圾場？

## 關鍵發現

### 1. 知識有生命週期
- 不是所有知識都同等重要
- 新知識比舊知識更有價值（除非舊知識被頻繁訪問）
- 知識需要信心分數和衰減機制
- **核心公式**: `confidence = base × (1 + sources_bonus) × time_decay × contradiction_penalty`

### 2. 平面頁面不夠，需要圖譜
- Wikilinks 只是弱連結
- 類型化關係 (`uses`, `depends_on`, `contradicts`) 攜帶語義
- 圖譜遍歷能找到關鍵字搜索遺漏的連接

### 3. 單一搜索會遇到瓶頸
- index.md 在 100-200 頁後太長
- 需要 BM25 + Vector + Graph 三流融合
- RRF (Reciprocal Rank Fusion) 是有效的融合方法

### 4. 手動操作是最大痛點
- 人們會放棄 wiki 因為維護成本太高
- 自動化鉤子 (on_ingest, on_query, on_session_end) 是關鍵
- 人工應該只做策展和方向，不做簿記

### 5. 質量控制不可少
- LLM 生成的內容不一定好
- 需要評分、自癒、矛盾解決
- Wiki 應該自己走向健康

## 涉及實體

| 實體 | 類型 | 關係 |
|------|------|------|
| [[LLM Wiki]] | Concept | 核心概念 |
| [[Karpathy_LLM_Wiki_Gist]] | File | 原始靈感來源 |
| [[LLM_Wiki_V2_Gist]] | File | 升級參考 |
| [[Schema_v3]] | File | 升級產出 |
| agentmemory | Library | 實戰驗證的記憶引擎 |
| iii-engine | Library | agentmemory 底層框架 |

## 提取教訓

### 可重用模式

1. **鞏固階梯模式**: Working → Episodic → Semantic → Procedural
   - 適用場景：任何需要知識管理的系統
   - 關鍵：晉升和降級規則要明確

2. **信心打分模式**: base_score + sources_bonus - time_decay - contradiction_penalty
   - 適用場景：需要評估知識可靠度的系統
   - 關鍵：時間衰減用指數函數

3. **混合搜尋模式**: BM25 + Vector + Graph → RRF 融合
   - 適用場景：超過 100 頁的知識庫
   - 關鍵：每個流抓住不同訊號

4. **事件驅動模式**: on_X → do_Y
   - 適用場景：需要自動化維護的系統
   - 關鍵：人工審核點不可少

5. **自癒模式**: Lint 不只是檢查，要自動修復
   - 適用場景：大型知識庫
   - 關鍵：孤立頁面、過時聲明、斷裂引用

### 信心與來源

- 信心分數：5/5（已驗證，多來源支持）
- 來源：Karpathy 原始 gist + LLM Wiki V2 gist + agentmemory 實戰驗證
- 升級狀態：Schema v3.0 已實施

## 下一步行動

1. ⏳ 實施實體提取流程
2. ⏳ 建立類型化關係系統
3. ⏳ 添加自動化鉤子
4. ⏳ 實施混合搜尋
5. ⏳ 建立質量評分和自癒機制
