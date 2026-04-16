# ---
tags: [Wiki, Work]
date: 2026-04-08
summary: "Azure 架構中心參考架構摘要"
---

# Azure 架構中心參考架構摘要

> 建立時間：2026-04-08
> 來源：`05_Customer_Accounts/02_Manufacturing_Sector/鹏鼎/顧問案/Phase-one現況調研/azure-architecture.pdf`

---

## 核心摘要

Azure 架構中心（Azure Architecture Center, AAC）是微軟官方的雲端架構指引資源庫，涵蓋 Well-Architected Framework 五大支柱（可靠性、安全性、成本優化、卓越營運、效能效率）、六大架構樣式、技術選擇指南、設計模式目錄與參考架構。這份 12,712 頁的文檔是 Azure 雲端建置的百科全書，從基礎訂閱管理、網路拓撲到微服務、IoT、大數據等都有完整模式，是 [[Dynasafe]] 進行 Azure 混合雲架構設計與客戶提案的核心參考來源。

---

## 關鍵概念

### 五大架構樣式
- 多層式（N-tier）：傳統企業應用架構，水平分層，適合現有應用遷移
- Web-Queue-Worker：PaaS 解決方案，前端處理 HTTP＋後端背景作業，透過異步佇列通訊
- 微服務（Microservices）：小型獨立服務透過 API 合約通訊，適合複雜網域，需成熟 DevOps 文化
- 事件驅動架構（Event-driven）：Pub-Sub 模型，適合 IoT 與即時系統
- 巨量計算（Big Compute/HPC）：數百至數千核平行計算，適合模擬與轉譯
- 巨量數據（Big Data）：Data Lake＋批次/串流處理＋分析倉儲

### Well-Architected Framework 五大支柱
- 可靠性：故障設計（MTTR 取代 MTBF）
- 安全性：機密性、完整性、可用性防護
- 成本優化：訂閱預算、成本管理、標籤追蹤
- 卓越營運：自動化自我管理、不可變基礎設施
- 效能效率：彈性調整、平行處理

### 雲端設計十大原則
- 設計為自我療癒、可擴展、可組合
- 避免單點故障、設計為彈性
- 減少預測、可處置設計
- 異步處理、最終一致性容忍

### 訂閱自動販賣（Subscription Vending）
- 治理：管理群組階層、RBAC、Azure 原則
- 網路：虛擬網路部署與對等互連
- 預算：訂閱層級成本管理
- 身份識別：受控識別或 OIDC 驗證

### Hub-Spoke 網路拓撲
- 中樞（Hub）：共享服務（防火牆、DNS、閘道）
- 輪輻（Spoke）：工作負載訂閱
- ExpressRoute＋VPN 容錯移轉混合連線

---

## 關鍵實體

- Azure Architecture Center（AAC）
- Azure Well-Architected Framework（WAF）
- Cloud Adoption Framework（CAF）
- Hub-Spoke 網路拓撲
- Azure Landing Zone
- Subscription Vending
- N-tier / Microservices / Event-driven / Big Data / HPC 架構樣式
- Azure Batch / HDInsight / Data Lake / Synapse Analytics / Stream Analytics
- InfiniBand / RDMA 高速網路
- [[Dynasafe]] Azure 混合雲方案

---

## 參考來源

- `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/05_業務與提案/05_Customer_Accounts/02_Manufacturing_Sector/鹏鼎/顧問案/Phase-one現況調研/azure-architecture.pdf`（12,712 頁，Azure 架構中心完整匯出）
- `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/05_業務與提案/05_Customer_Accounts/02_Manufacturing_Sector/鹏鼎/顧問案/Phase-one現況調研/Azure Security Best Practices.pdf`


## 相關連結
- [[混合雲AI採用框架_Hybrid_Cloud_AI_Adoption]]
- [[Dynasafe工作文件核心摘要]]

---
*自動領養：Gemini-CLI v11.0*
