# ---
tags: [Wiki, Work, Finance]
date: 2026-04-08
summary: "金融客戶 Cisco ACI 微分段與數據中心網路摘要"
---

# 金融客戶 Cisco ACI 微分段與數據中心網路摘要

> 建立時間：2026-04-08 12:45
> 主題編號：FIN-ACI-007

## 核心摘要

Cisco ACI（Application Centric Infrastructure）是金融業資料中心軟體定義網路的核心架構。透過微分段（Micro-Segmentation）實現東西向流量的精細管控，搭配 APIC 控制器進行集中式政策管理。Layer 3 配置指南涵蓋 Tenant、Bridge Domain、Contract、EPG 等核心概念。強化韌性設計包含營運韌性與混合雲整合，是玉山銀行等金融機構的資料中心網路升級方向。

## 關鍵概念

- ACI 核心元件：APIC（應用策略基礎設施控制器）、Spine、Leaf
- EPG（Endpoint Group）：端點群組，微分段的基本單位
- Contract（合約）：定義 EPG 之間的通訊政策
- Bridge Domain（橋接域）：Layer 2 廣播域抽象
- Tenant（租戶）：ACI 的多租戶隔離模型
- 微分段（Micro-Segmentation）：東西向流量精細管控，零信任的網路層實踐
- Layer 3 配置：VRF、外部路由（OSPF/BGP）、L3Out
- 營運韌性：確保服務中斷時仍能維持核心營運
- 混合雲整合：ACI 與公有雲網路的對接與政策一致性

## 關鍵實體

- Cisco ACI（Application Centric Infrastructure）
- Cisco APIC（Application Policy Infrastructure Controller）
- Cisco Nexus 9000 系列
- MSO（Multi-Site Orchestrator）
- 玉山銀行 ACI 選商與微分段專案
- 下一代數據中心網絡架構規劃建議書
- CISCOU-2066（ACI 認證課程）

## 參考來源

- Cisco_ACI_微分段.md（玉山銀行）
- Cisco-ACI-Virtualization-Guide（ACI 虛擬化指南）
- CISCOU-2066.pdf
- b_Cisco_APIC_Layer_3_Configuration_Guide
- ESB_營運韌性與混合雲簡報（20260302/20260305）
- 強化韌性_V01.pdf


## 相關連結
- [[混合雲AI採用框架_Hybrid_Cloud_AI_Adoption]]
- [[金融客戶雲端遷移與混合雲架構摘要]]

---
*自動領養：Gemini-CLI v11.0*
