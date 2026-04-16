# ---
tags: [Wiki, AI, Work, Finance]
date: 2026-04-08
summary: "Dynasafe_FinOps_FinCloud_AIInfra摘要"
---

# Dynasafe_FinOps_FinCloud_AIInfra摘要

**建立時間**: 2026-04-08 12:45
**更新時間**: 2026-04-08 12:45
**主題分類**: 雲成本管理 / 金融合規 / AI基礎設施

---

## 核心摘要

FinOps Framework 定義了雲端財務管理的三階段循環：Inform(可视化) → Optimize(優化) → Operate(營運)。金融機構使用雲端服務實務手冊(113年8月版)提供九大章節，涵蓋策略發展與治理、風險評估、管理架構、人才培訓、資安控管、維運控管、查核、韌性管理等。保險業作業委託他人處理應注意事項規範了保險業委外(含雲端服務)的監管要求。[[NVIDIA]] AI Enterprise 在金融業的導入效益包含 GPU 利用率提升、合規安全、Python 生態整合、簡化部署四大面向。

## 關鍵概念清單

- **FinOps 三階段**：Inform(成本可视化/分配/基準) → Optimize(費率優化/使用率優化) → Operate(持續營運/治理)
- **FinOps 跨領域協作**：Engineering + Finance + Business 團隊協作管理雲端成本
- **雲適性評估 5R 模型**：Rehost、Refactor、Rearchitect、Rebuild、Replace
- **金融雲端治理九大領域**：策略發展、風險評估、管理架構、人才培訓、資安控管、維運控管、查核、韌性管理、其他
- **資料處理地與儲存地評估**：優先選擇資料保護法規不低於我國要求的國家
- **多雲分散策略**：基於作業風險分散原則，避免單一供應商依賴
- **[[NVIDIA]] vGPU / MIG**：GPU 資源池化，提升利用率、降低硬體成本
- **NVAIE LTSB**：長期支持分支(約2.5年發布，3年支持)，滿足金融業合規需求
- **RAG 在金融業**：結合向量搜尋與 LLM 的企業知識管理方案
- **Data-Oriented Architecture**：以數據為中心的 SOA 設計，expose the data and hide the code
- **IPv6 金融改造**：金融行業 IPv6 改造方案，涵蓋網路架構、安全、應用層

## 關鍵實體清單

- **FinOps Foundation** — FinOps Framework 制定組織
- **勤業眾信(Deloitte)** — 金融機構使用雲端服務實務手冊撰寫單位
- **銀行公會金控業務委員會金融科技發展組** — 實務手冊專案單位
- **[[NVIDIA]] AI Enterprise (NVAIE)** — [[NVIDIA]] 企業級 AI 軟體套件
- **NIM ([[NVIDIA]] Inference Microservices)** — [[NVIDIA]] 推理微服務
- **Triton Inference Server** — [[NVIDIA]] 推理服務管理
- **RAPIDS** — GPU 加速的資料科學庫
- **PrimeHub / InfuseAI** — 台灣 AI 平台解決方案供應商
- **Real-Time Innovations (RTI)** — Data-Oriented Architecture 提出者

## 參考來源

1. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/MultiCloud/FinOps/FinOps-Framework-Poster-v4.pdf`
2. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/MultiCloud/FinOps/全方面雲地整合-加速數位轉型_OpenText.pdf`
3. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/MultiCloud/金融上雲指南/金融機構使用雲端服務實務手冊(含專有名詞與檢核表)第一版__113.08.pdf`
4. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/MultiCloud/金融上雲指南/保險業作業委託他人處理應注意事項.pdf`
5. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/MultiCloud/金融上雲指南/保險業作業委託他人處理應注意事項QA.pdf`
6. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/倡議/AI_Infra/2024-03 _ PrimeHub _ InfuseAI Tech Slide_M0805.pdf`
7. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/倡議/AI_Infra/[[NVIDIA]] AI Enterprise 在金融業導入效益.pdf`
8. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/倡議/temp/Data-Oriented_Architecture.pdf`
9. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/倡議/temp/面向金融行业的 IPv6 改造方案.pdf`
