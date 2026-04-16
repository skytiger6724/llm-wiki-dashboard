# ---
tags: [Wiki, AI]
date: 2026-04-09
summary: "核心概念：混合雲 AI 算力調度 (Hybrid AI Orchestration)"
---

# 核心概念：混合雲 AI 算力調度 (Hybrid AI Orchestration)

## 核心定義
混合雲 AI 算力調度是指透過統一的控制平面，動態管理分佈在本地機房 (On-Prem) 與多個公有雲 (Public Cloud) 環境中的 GPU 資源，以實現最優的成本、效能與合規平衡。

## 核心組件 (基於 [[Run.AI]] 模型)
1. **全域控制平面 (Global Control Plane)**：統一治理、配額管理與任務排程。
2. **計算叢集 (Compute Clusters)**：分佈在不同物理環境的算力節點。
3. **智慧路由引擎**：根據任務優先級與當前負載，決定任務執行位置。

## AI 映射：系統級資源加權
- **算力溢出 (Cloud Bursting) = 彈性 Buffer**：當系統負載超過臨界點時，自動調用外部算力（類比於 LLM 的多級緩存或 RAG 檢索擴展）。
- **配額管理 = 權重硬約束**：確保高價值任務獲得保證資源。

## 與 Wiki 的連結
- [[AI工廠_AI_Factory|AI工廠]]：算力調度是 AI 工廠的「傳送帶與能源系統」。
- [[煉金術與系統轉化模型_Alchemy_Transformation]]：調度優化對應煉金術中的「火的試煉（算力分配）」。
- 另見：[[混合雲AI採用框架_Hybrid_Cloud_AI_Adoption]] 提供 TCO 與商業視角。

---
- **編譯時間：2026-04-09 06:10 (UTC+8)**
- **編譯員：[[LLM_Wiki|LLM Wiki]] Compiler**
