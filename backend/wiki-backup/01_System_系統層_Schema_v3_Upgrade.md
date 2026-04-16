# ---
tags: [Wiki, AI, Work, Schema, v3, Upgrade]
date: 2026-04-14
summary: "Schema v2 → v3 升級說明"
---

# Schema v3 升級說明

## 升級日期
2026-04-14

## 升級依據
[LLM Wiki V2](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2) - 基於 agentmemory 實戰經驗

## 主要變化

### 新增
1. **記憶分層 (Memory Lifecycle)** - 4 層鞏固階梯 (Working → Episodic → Semantic → Procedural)
2. **知識圖譜 (Knowledge Graph)** - 類型化實體和關係
3. **混合搜尋 (Hybrid Search)** - BM25 + Vector + Graph 三流融合
4. **自動化鉤子 (Automation Hooks)** - 事件驅動處理
5. **質量與自癒 (Quality & Self-Healing)** - 內容評分、自動修復
6. **結晶 (Crystallization)** - 工作鏈轉化為知識
7. **隱私與治理 (Privacy & Governance)** - 入站過濾、審計追蹤

### 保留
- 核心三層架構 (Raw → Wiki → Schema)
- 原始資料優先
- 增量更新
- 連結為王

### 增強
- 信心打分公式（加入來源數量和時間衰減）
- Supersession 機制（不只是標記，還要降權）
- 遺忘曲線（Ebbinghaus）
- 矛盾解決流程（自動提案 + 人工確認）

## 完整文檔
完整 Schema v3.0 見 [`Schema_v3.md`](Schema_v3.md)

## 遷移計劃
1. 保留 Schema.md (v2.0) 作為參考
2. 新內容按 v3.0 規範處理
3. 逐步將現有內容升級到 v3.0 格式
4. 下次知識編譯時全面應用 v3.0
