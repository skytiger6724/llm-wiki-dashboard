# ---
tags: [Wiki, Work, Finance]
date: 2026-04-08
summary: "金融客戶 DR2Cloud 災備上雲摘要"
---

# 金融客戶 DR2Cloud 災備上雲摘要

> 建立時間：2026-04-08 12:45
> 主題編號：FIN-DR2CLOUD-001

## 核心摘要

金融業災難備援上雲（DR2Cloud）是將地端系統透過複製、遷移或備援方式延伸至公有雲的解決方案。核心價值在於降低機房維運成本、提升營運韌性，並符合金管會對金融業持續營運的要求。主要雲端平台包括 Oracle Cloud Infrastructure (OCI)、Microsoft Azure、AWS。SRG（系統再生）方案主打「無痛遷移」，不需變更應用程式碼，支援 P2V/V2V 轉換，RPO 可達秒級、RTO 達分鐘級。

## 關鍵概念

- DR 等級分層：Backup 整機複製 > Pilot Light > Active/Standby > Active/Active
- RPO（復原點目標）：可容忍的資料丟失量，從 24 小時到零
- RTO（復原時間目標）：系統恢復所需時間，從數天到分鐘級
- P2V/V2V：實體到虛擬、虛擬到虛擬的遷移技術
- SRG 系統再生：數據再生 + 伺服器再生 + 服務再生三位一體
- Oracle OCI：金融業滿意度最高的 IaaS 供應商（IDC 調查）
- AWS CAF：雲端採用框架，涵蓋業務、人員、治理、平台、安全、營運六大視角
- Microsoft Azure for Financial Services：合規性覆蓋最廣的雲端平台，超過 100 項合規產品
- 混合雲已是趨勢：80-85% 企業採用混合雲架構
- Cloud 2.0 思維：雲端不只是節省成本，更是降本提效的關鍵

## 關鍵實體

- Oracle Cloud Infrastructure (OCI)
- Microsoft Azure (AZ-104 認證涵蓋的管理員技能)
- AWS Cloud Adoption Framework (CAF)
- SRG 系統再生方案（耀鏡資訊）
- Zerto Virtual Replication（DR 複製技術）
- Veeam Backup & DR
- VMware Cloud on AWS / Azure (GCVE)
- [[Dynasafe]] Hybrid Cloud（動力安全混合雲方案）
- 中信商銀（CTBC）法金 DR2Cloud 專案
- 國泰金控、玉山銀行（金融業參考案例）

## 參考來源

- DR-to-Cloud Proposal V3 (Oracle, Richard Chiu)
- 250918 SRG 系統再生解決方案 — 快速部署無痛遷移和備援至 OCI（耀鏡資訊）
- AWS Cloud Adoption Framework v3 (2021)
- Microsoft for Financial Services documentation
- 企業上雲搬遷的關鍵推手（Arby Chao, [[Dynasafe]]）
- 建議架構設計與考量 V0（CTBC DR2AWS）
- 0-ROSA-HCP-Services-Arch.md（CTBC 法金 DR2Cloud）


## 相關連結
- [[混合雲AI採用框架_Hybrid_Cloud_AI_Adoption]]
- [[金融客戶雲端遷移與混合雲架構摘要]]

---
*自動領養：Gemini-CLI v11.0*
