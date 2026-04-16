# ---
tags: [Wiki, AI, Work, Finance]
date: 2026-03-31
summary: "2026 雲端智能部：倡議解決方案與產品內容摘要紀錄"
---

# 2026 雲端智能部：倡議解決方案與產品內容摘要紀錄
Timestamp: 2026-03-31 16:45:00

## 1. 執行大綱 (Executive Summary)
本文件針對「雲端智能部 (Cloud Intelligence Dept, CID)」於 2026 年所倡議之核心解決方案、產品線及營運計畫進行深度提煉。核心主軸聚焦於 **「混合雲韌性 (Hybrid Cloud Resilience)」** 與 **「AI 基礎設施 (AI Infra+)」**。透過整合 Cisco ACI、[[NVIDIA]] GB200/300 以及 Run.ai 調度平台，解決企業上雲過程中的「數據引力」與「算力孤島」問題，並為金融業等高合規場景提供極端備援能力。

---

## 2. 詳細內容 (Detailed Analysis)

### 2.1 核心三支柱戰略 (Strategic Pillars)
CID 2026 年的產品與解決方案劃分為三大核心軌道：
1. **Cloud+ (雲地整合韌性)**：
   - **目標**：打造「連得上、管得住、擴得快」的雲地一體底座。
   - **核心解決方案**：混合雲基礎架構、基礎架構上雲、金融級韌性（極端備援場景）。
   - **技術關鍵**：ACI 網路整合、數據分層存儲 (Data Tiering)、高速 Direct Connect。
2. **AI Infra+ (AI 算力引擎)**：
   - **目標**：駕馭混合雲 AI 算力，解決訓練高峰與閒置浪費。
   - **核心解決方案**：RDMA 算力網路、GDS (GPUDirect Storage) 存儲 Fabric、客製化 Base Pod (針對 NV 規範優化)。
   - **調度平台**：導入 **Run.ai** 實現 GPU 資源池化、細粒度分配 (Fractional GPU) 及「雲端爆發 (Cloud Bursting)」自動化。
3. **Campus Infra+ (園區基礎設施)**：
   - **目標**：實現 Software Defined (SDI) 全棧可視化與自動化。

### 2.2 技術架構與挑戰 (Architecture & Challenges)
- **數據引力 (Data Gravity)**：報告指出混合架構最核心挑戰在於數據存放在本地而算力在雲端。策略為：在 ACI 層級配置高速連線，並導入數據分層策略。
- **AI 混合架構 (Hybrid AI)**：
    - **地端 (On-Prem)**：專注於 Baseline 訓練，採用 [[NVIDIA]] GB200/300 NVLink 4th Gen，確保資料安全與 TCO 優化。
    - **雲端 (Cloud)**：用於推論與突發算力需求 (Inference & Bursting)，整合 AWS SageMaker、GCP Vertex AI 等。
- **統一控制平面 (Unified Control Plane)**：強調跨越實體邊界的統一資源治理，支援 SaaS 與 Self-Hosted (Air-gapped) 模式。

### 2.3 重點市場與案例 (Market & Case Studies)
- **金融業領導群 (以玉山銀行為例)**：已具備基本架構，下一步是將能力「標準化、可複製、可稽核」，並強化證據鏈定位與止血能力。
- **Cisco 策略整合**：聚焦 AI-Ready Data Center、Digital Resilience 與 Cisco 360 合作夥伴計畫轉型。

### 2.4 產品矩陣 (Product Matrix)
- **Base/Cash Cow**：公有雲服務、基礎網路/存儲產品、ACI/SDWAN。
- **Incremental/Beach Head**：AI 自動化工具、IaC 服務、RDMA 技術、客製化 Base-Pod、Run.ai 調度服務。

---

## 3. 附件參考
- `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/01_Cloud_Intelligence_Dept/倡議解決方案與產品`
- 2026_雲端智能部_BP_V0.9.pptx
- 2026_雲端智能部_Solution_V0.1.pptx
- HybridCloud_for_AI_NV_DS.pptx
- 營運韌性與混合雲_20260318.pdf

---
*紀錄人：Gemini CLI (Human-Centric Calibration v2.0)*


## 相關連結
- [[知識複利系統_Knowledge_Compounding]]
