# ---
tags: [Wiki, AI, Work, Finance]
date: 2026-04-08
summary: "Dynasafe_Nvidia FSI AI Forum 摘要"
---

# Dynasafe_Nvidia FSI AI Forum 摘要

> 時間戳記：2026-04-08 12:35
> 編譯員：AI Knowledge Compiler

---

## 核心摘要

本批次涵蓋 2025 年 7 月 17 日 Nvidia FSI AI Forum 的四場簡報，由 [[Dynasafe]]（動力安全資訊）與 Nvidia、Vast Data 共同發表。

核心議題圍繞金融業的 AI 轉型四大面向：客戶資料架構進化（eCIF/eCIH）、金融 AI 安全架構與零信任框架、Nvidia AI Factory 在金融業的應用場景，以及高效能 AI 資料儲存平台。[[Dynasafe]] 提出了從傳統 CIF 升級為企業級客戶智庫（eCIH）的完整藍圖，並結合 LLM/RAG/MCP 技術實現智能金融場景。Nvidia 強調推理時代的 100 倍 token 增長與 AI Factory 價值。Vast Data 展示了 DASE 架構如何支撐端到端 AI 資料管線。

---

## 關鍵概念清單

### 1. 從 AI 重塑客戶視角：CIF 的智慧進化（[[Dynasafe]] - Richard Chuang）
- 金融業挑戰：客戶流失、獲客成本高、產品同質化、合規壓力
- 分散式 CIF 痛點：資料不一致、無法掌握客戶全貌、無法即時偵測詐欺
- **eCIF（企業級客戶主檔）**：哥白尼計劃，即時整合所有 LOB 的客戶資料
- **eCIH（企業級客戶智庫）**：eCIF 升級版，整合 AI Scores（ML）與 AI Text（LLM）
- eCIH 12 大 AI 應用場景：
  - 理專智慧輔助摘要
  - 跨產品互動脈絡摘要
  - 自然語言查詢與對話分析
  - 潛在需求預測與生成
  - 強化商品推薦理由
  - AML/SAR 自動產製說明
  - 投訴回覆草稿自動生成
  - 行為異常解釋與提示
  - 客製化財富建議報告
- 系統架構：流式資料（Kafka）+ 批量資料（ETL）+ AI 服務（DGX AIE）+ 資料庫（Oracle 23ai RAC）
- eCIF vs eDW 差異：eCIF 即時業務運營（讀寫），eDW 批次 T+1 分析（唯讀）
- 關鍵技術挑戰：LLM 回答可信度、資安與隱私、AI 法規遵循

### 2. 建構可信賴 AI：金融場域的安全架構（[[Dynasafe]] - Daniel Lu）
- AI 助長駭客：個人化社交工程、Deepfake 偽造、自動化漏洞利用、自主攻擊
- 網路釣魚成功率提升 78%，攻擊成本降低 95% 以上
- AI 生命週期六大階段風險：
  - 問題定義與需求規劃
  - 資料蒐集與準備（有效性與安全管理）
  - 模型開發與訓練（透明度與可解釋性）
  - 模型微調與驗證
  - 系統部署與推理應用
  - 持續監控、維運與優化
- **零信任框架與 AI 安全**：
  - 核心業務 AI 算力自建（[[NVIDIA]] DGX）
  - 非核心業務加速應用雲端資源（AI 加持 SASE）
  - AI 加持資安防禦（可解釋性 AI 產品）
  - 自建 AI 安全強化（Guardrail, SAIF, ARMORM）
- 中美關係下的 SecOps 考量：產品一致性與支援性、ZTA 新邊界防禦政策

### 3. Nvidia AI Platform 下的智慧金融（Nvidia - Eric Kang）
- **AI Scaling Laws**：推理時代需要 100 倍更多 token（10K tokens vs 100 tokens）
- 推理成本 100 倍增長，需要全棧創新來降低 cost/token
- Nvidia Blueprints：企業級 AI Agent 起點（客服、資安、影片分析、藥物篩選）
- 金融業三大 Gen AI 領域：
  - Banking：推薦系統、客服聊天機器人、合成數據、風險管理
  - Trading：量化交易策略、投資組合優化、情緒分析
  - Payments：詐欺檢測、合成數據訓練、自適應定價
- 優先 FSI AI 用例：核保、AML/KYC、交易詐欺、HPC 定價與風險、算法交易、客服
- GB300 NVL72 + [[NVIDIA]] Dynamo：50 倍 AI Factory 產出、10 倍響應速度

### 4. 高效能 AI 資料存取（Vast Data - Fernand Cheng）
- **DASE 架構**（Disaggregated Shared-Everything）：解決 20 年共享架構瓶頸
  - 無狀態計算節點（CNodes）+ Exabyte 級 NVMe 儲存節點（DNodes）
  - 單一計算節點可看到全部儲存節點，平行計算
- 原生多重協議同等效能：NFS、SMB、S3、SQL/Python/Arrow
- AI 端到端資料管線：Data Ingest -> Preparation -> Training -> Inference -> Logging
- 資料優化技術：
  - Locally-Decodable Codes：2.7% 保護開銷，6000 萬年 MTTDL
  - Similarity Reduction：全機群平均 3:1 壓縮
- 多租戶嚴格隔離：VIP Pool、VLAN、加密金鑰、AD/LDAP 整合
- 零信任資安：Kerberos、TLS、FIPS 140-2、防勒索軟體（不可變快照 <15s RPO）
- VAST DataBase：TPCDS 查詢比 Parquet 快 20 倍，7M 批量寫入/秒/伺服器
- Nvidia GPU + VAST DB 聯合加速：RAPIDS + VAST-DB 比傳統方案快 140%

---

## 關鍵實體清單

| 類型 | 名稱 | 說明 |
|------|------|------|
| 組織 | [[Dynasafe]]（動力安全資訊） | 台灣資安與數據整合公司，本場次主要講者 |
| 組織 | [[NVIDIA]] | GPU 與 AI 基礎設施領導者 |
| 組織 | Vast Data | AI 資料平台公司，DASE 架構發明者 |
| 產品 | eCIF | 企業級客戶主檔，即時整合 LOB 資料 |
| 產品 | eCIH | 企業級客戶智庫，eCIF + AI Scores + AI Text |
| 產品 | [[NVIDIA]] DGX | AI 超級計算平台，金融自建算力首選 |
| 產品 | [[NVIDIA]] AI Enterprise (NVAIE) | 雲原生 AI 軟體工具集，含 NIM 與 NeMo |
| 產品 | [[NVIDIA]] Blueprints | 企業級 AI Agent 藍圖範本 |
| 產品 | GB300 NVL72 | Nvidia 下一代推理晶片 |
| 產品 | [[NVIDIA]] Dynamo | 推理優化技術，提升 50 倍產出 |
| 產品 | VAST DASE | 分散式共享一切架構 |
| 產品 | VAST DataBase | 結構化資料倉儲，支援 SQL/Python |
| 產品 | VAST InsightEngine | AI 資料平台應用 |
| 技術 | RAG | 檢索增強生成，eCIH 知識檢索核心 |
| 技術 | MCP | Model Context Protocol，跨系統上下文整合 |
| 技術 | LLM | 大語言模型，eCIH 文本生成引擎 |
| 技術 | SASE | 安全訪問服務邊緣，AI 加持雲端安全 |
| 技術 | GPUDirect Storage | GPU 直接讀取儲存，繞過 CPU |
| 法規 | 洗錢防制法第15條 | SAR 通報法源依據 |
| 法規 | 金融業運用人工智慧(AI)指引 | 金管會 AI 應用規範 |

---

## 參考來源

1. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/04_AI研究與報告/02_Nvidia_AI_Events/2 250717 NV FSI AI Forum (從AI重塑客戶視角 CIF的智慧進化_Dynasafe_Richard Chuang).pdf`
2. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/04_AI研究與報告/02_Nvidia_AI_Events/3 250717 NV FSI AI Forum (建構可信賴AI 金融場域的安全架構_Dynasafe_Daniel Lu).pdf`
3. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/04_AI研究與報告/02_Nvidia_AI_Events/4 250717 NV FSI Forum (Nvidia AI平台時立下的智慧金融_Nvidia_Eric Kang).pdf`
4. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/04_AI研究與報告/02_Nvidia_AI_Events/5 250717 NV FSI AI Forum (高效能AI資料存取_Vast Data_Fernand Cheng).pdf`

---

*檔案生成時間：2026-04-08 12:35 | 批次：A | 主題編號：Nvidia-FSI-001*
