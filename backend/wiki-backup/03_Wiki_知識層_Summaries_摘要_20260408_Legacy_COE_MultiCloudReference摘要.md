# ---
tags: [Wiki, AI, Work, Finance]
date: 2026-04-08
summary: "Legacy COE — MultiCloud Reference + Offering + Cloud Information 摘要"
---

# Legacy COE — MultiCloud Reference + Offering + Cloud Information 摘要

> 編譯時間：2026-04-08T14:45:00+08:00
> 主題編號：LEG-COE-MULTICLOUD-004
> 來源：HCI_COE Legacy Backups / COE2025 / MultiCloud / Reference, Offering, Cloud_information, 玉山

---

## 核心摘要

此組文件涵蓋混合雲與多云架構的參考資料。Nutanix Hybrid Cloud Design Guide 說明如何以單一控制平面跨越本地端與公有雲，支援 DR 上雲、彈性擴展、Lift & Shift 等用例。VMware Hybrid Cloud 方案強調 VCF（VMware Cloud Foundation）在混合雲環境的一致性運營模型。Pure Storage 方案則聚焦數據層的混合雲移動性，提供 Cloud Block Store 與 Portworx Kubernetes 數據服務。Gartner Hype Cycle for Cloud Platform Services 2024 追蹤雲端平台技術成熟度。GCP 在 AI 時代的雲端應用排障方案與玉山銀行備份上雲案例也收錄於此。

## 關鍵概念

- **Nutanix 混合雲設計指南**：
  - 單一控制平面（Prism Central + NCM）管理私有雲與公有雲
  - 用例：Business Continuity（DR 上雲）、On Demand Elasticity（彈性擴展）、Lift & Shift、Cloud Native Services、Dev/Test、VDI on Cloud
  - Xi Leap：DR-as-a-Service，一鍵故障切換/回復
  - Flow Microsegmentation：零信任微分段
  - Security Central：安全態勢評估與漏洞修復
- **VMware Hybrid Cloud**：
  - VCF（VMware Cloud Foundation）提供一致的基礎設施與運營模型
  - 支援 AWS、Azure、GCP、IBM 等 hyperscaler
  - VMware Cloud on AWS / Azure VMware Solution / Google Cloud VMware Solution
- **Pure Storage 混合雲**：
  - Cloud Block Store：公有雲上的區塊儲存
  - Portworx：Kubernetes 原生數據服務平台
  - Pure1：AI 輔助管理與統一服務目錄
  - 資料移動：高效複製、Dev/Test 環境快速部署
- **Gartner Hype Cycle for Cloud Platform Services 2024**：
  - 追蹤雲端平台技術的成熟度曲線
  - 涵蓋 IaaS、PaaS、容器、Serverless、雲端管理等領域
- **GCP AI 時代雲端應用排障**：
  - 針對 AI 工作負載的雲端應用監控與排障方法論
- **玉山銀行 x GCP 備份上雲案例**：
  - 台灣金融業備份上雲技術優勢分析
  - 符合金管會規範的雲端備份架構
  - 混合雲災備設計與成本效益

## 關鍵實體

- Nutanix Clusters / Xi Leap / Prism Central / Flow / Security Central
- VMware Cloud Foundation (VCF)
- VMware Cloud on AWS / Azure VMware Solution
- Pure Storage / Cloud Block Store / Portworx / Pure1
- Gartner Hype Cycle
- GCP（Google Cloud Platform）
- 玉山銀行
- 金管會（金融監理規範）

## 參考來源

- ds-hybrid-cloud-design-guide-final.pdf（Nutanix 混合雲設計指南）
- 445147_VMware_Hybrid_Cloud_Solution_Overview.pdf
- sb-realize-true-hybrid-cloud.pdf（Pure Storage 混合雲方案）
- GCP_Troubleshoot cloud applications in the AI era .pdf
- Hype Cycle for Cloud Platform Services, 2024.pdf
- 玉山 x GCP 台灣金融業備份上雲技術優勢分析_20230911.pdf


## 相關連結
- [[Agentic_AI]]
- [[知識TCO_Knowledge_TCO]]

---
*自動領養：Gemini-CLI v11.0*
