# ---
tags: [Wiki, Work, Finance]
date: 2026-04-08
summary: "金融客戶雲端遷移與混合雲架構摘要"
---

# 金融客戶雲端遷移與混合雲架構摘要

> 建立時間：2026-04-08 12:45
> 主題編號：FIN-CLOUDMIG-004

## 核心摘要

金融業雲端遷移正從 Cloud 1.0（IaaS 為主）邁向 Cloud 2.0（混合雲、容器化、平台工程）。核心策略是「上雲從混合雲開始」，打通雲地串接、打造雲地空間、打破雲地邊界。上雲比例從 20-30%（VM/IaaS 方式）進展到 70-80%（容器方式）。關鍵考量包括合規要求（委外辦法、持續營運）、總體成本優化、開發生態系整合，以及 ESG 永續營運。

## 關鍵概念

- Cloud 2.0：混合雲為預設架構，VM/IaaS 過渡到容器化上雲
- 平台工程（Platform Engineering）：成熟且全面的雲端技術支撐
- 降本提效：公有雲成本可能高於預期，自有數據中心提供更多控制權
- SRE Skills：混合雲管理（配置/版控/CICD/監控/log）、硬體管理、網路儲存
- 合規框架：委外辦法要求雲端服務終止時能接續處理、服務中斷時能緊急應變
- 遷移策略：評估雲端服務商（總體成本、整合優勢、開發生態、市場熱度）
- 地端無痛遷移：不變更應用程式碼，透過 SRG 方案快速上雲
- GCVE（Google Cloud VMware Engine）：在公有雲運行 VMware 工作負載
- VDI to Cloud：虛擬桌面基礎設施上雲需求

## 關鍵實體

- [[Dynasafe]] Hybrid Cloud（動力安全混合雲）
- Google Cloud VMware Engine (GCVE)
- AWS VMware Cloud / Azure VMware Solution
- Red Hat OpenShift (OCP)
- VMware vSphere / Horizon VDI
- Cisco ACI（應用中心基礎設施）
- 中信商銀個金行網雲（個金雲端建置案）
- 玉山銀行海外上雲專案（GCVE PoC）
- 台新人壽網路架構圖
- 資源命名原則 / 資源 Tag 規範（CTBC 雲端治理）

## 參考來源

- 企業上雲搬遷的關鍵推手（Arby Chao, [[Dynasafe]]）
- 中信商銀個金行網雲 GC_IAC_v2 系列 README（security/network/ai/database/auth/ecs/bastion）
- 玉山銀行 VDI2Cloud 需求.md
- 玉山銀行 GCVE Kick-Off Meeting & PoC 報告
- 超融合一體機產品介紹 / 超融合小型機遷移解決方案（玉山子行）


## 相關連結
- [[混合雲AI採用框架_Hybrid_Cloud_AI_Adoption]]
- [[金融客戶雲端遷移與混合雲架構摘要]]

---
*自動領養：Gemini-CLI v11.0*
