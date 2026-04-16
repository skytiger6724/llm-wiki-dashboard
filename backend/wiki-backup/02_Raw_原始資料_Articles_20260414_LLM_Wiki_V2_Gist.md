# ---
title: "LLM Wiki V2 Gist (rohitg00)"
type: "raw"
tier: 2
confidence: 5
decay_factor: 0.1
last_verified: 2026-04-14
sources:
  - "https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2"
contradictions: []
tags: [Wiki, AI, Knowledge-Management, Reference]
created: 2026-04-14
updated: 2026-04-14
---

# LLM Wiki V2 Gist (rohitg00)

## 來源
- **URL**: https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2
- **作者**: rohitg00
- **項目**: agentmemory (https://github.com/rohitg00/agentmemory)
- **基礎**: 基於 Karpathy 原始 LLM Wiki gist
- **提取日期**: 2026-04-14

## 核心定位
LLM Wiki V2 是一份**生產級別知識庫模式**文檔，總結了從 agentmemory 項目中獲得的實戰經驗。

## 關鍵升級點

| 原始 LLM Wiki | LLM Wiki V2 新增 |
|---------------|------------------|
| 平面頁面 + index.md | 知識圖譜 + 類型化關係 |
| 所有內容同等有效 | 信心打分 + 生命週期管理 |
| 手動 ingest/lint | 事件驅動自動化 |
| 基本矛盾標記 | 自動矛盾解決 + supersession |
| 單一搜索 | 混合搜尋 (BM25 + Vector + Graph) |
| 單一用戶 | 多代理協作 |
| 無隱私考慮 | 入站過濾 + 審計追蹤 |

## 實戰數據
- 已應用於 thousands of sessions
- 開發團隊已當做升級藍圖
- 8-10 小時可完成搜尋升級

## 相關概念
- [[Karpathy_LLM_Wiki_Gist]] - 原始概念
- [[LLM_Wiki_V2_戰略結晶]] - 戰略結晶
- [[Schema_v3]] - 升級產出
