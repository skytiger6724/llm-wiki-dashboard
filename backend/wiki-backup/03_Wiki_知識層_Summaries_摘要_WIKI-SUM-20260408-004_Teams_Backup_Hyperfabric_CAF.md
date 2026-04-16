# ---
tags: [Wiki, AI, Work]
date: 2026-04-08
summary: "WIKI-SUM-20260408-004  Teams 備份摘要（Hyperfabric + Azure CAF）"
---

# WIKI-SUM-20260408-004 | Teams 備份摘要（Hyperfabric + Azure CAF）

> 編譯時間：2026-04-08
> 來源：Teams_Backup 目錄下 Hyperfabric workshop、Nexus Hyperfabric Roadshow、Azure Cloud Adoption Framework

## 核心摘要

此組合涵蓋三個主題：Nexus Hyperfabric Workshop 台灣場簡報、Nexus Hyperfabric Roadshow 簡報、以及 Azure Cloud Adoption Framework（雲端採用框架）文件。核心聚焦於 Cisco Nexus Hyperfabric 如何簡化資料中心網路的部署與營運，以及 Azure 雲端採用的完整方法論（從策略定義到遷移執行）。

## 關鍵概念

- **Nexus Hyperfabric Workshop**：2025/9/10 台灣場活動。議程包含歡迎致辭、Hyperfabric 簡化營運、AI Roadmap 建置。思科 AI 技術戰略分為三大方向：AI-ready data centers、Future-proofed workplaces、Digital resilience。
- **Nexus Hyperfabric 核心價值**：plug-and-play 的 leaf-spine fabric，基於 Nexus 6000 Series Switches。支援 Design → Order → Deploy → Validate → Monitor → Upgrade 的完整生命週期管理。針對 IT generalist 與 DevOps 團隊設計。
- **思科 AI 戰略架構**：
  - AI-ready data centers：UCS Compute、Nexus 9K、Silicon One、HyperFabricAI、Nutanix GPT
  - Future-proofed workplaces：園區、分支、工廠、居家等場景的現代化辦公體驗
  - Digital resilience：安全、性能保障、可觀察技術（Splunk、ThousandEyes、AppDynamics）
- **Cloud Protection Suite**：Hypershield、Secure Workload、Multicloud Defense、Firewall，保護廣泛分布的資料中心工作負載。
- **Azure Cloud Adoption Framework（CAF）**：完整的雲端採用方法論，包含六大步驟：
  1. **Define Strategy**：定義雲端採用策略與商業案例
  2. **Plan**：規劃雲端採用藍圖與優先順序
  3. **Ready**：準備雲端環境（landing zone、治理、技能）
  4. **Migrate**：執行工作負載遷移（8 種策略：Retire、Rehost、Replatform、Refactor、Rearchitect、Replace、Rebuild、Retain）
  5. **Innovate**：雲端創新與最佳化
  6. **Manage & Govern**：持續管理與治理
- **雲端遷移 8R 策略**：
  - **Retire**：退役冗餘工作負載
  - **Rehost**：等同搬遷（lift-and-shift），低風險快速遷移
  - **Replatform**：最小程式碼變更移至 PaaS
  - **Refactor**：程式碼現代化，減少技術債務
  - **Rearchitect**：架構重新設計，解鎖雲原生功能
  - **Replace**：以 SaaS/AI 解決方案取代
  - **Rebuild**：用雲原生方案完整重建
  - **Retain**：保持現狀（法規限制或技術相依）
- **雲端技能準備**：評估團隊在 Azure adoption fundamentals、environment management、cloud-native development 三大類的技能缺口。建議使用 Microsoft Learn、認證計畫、外部專家加速準備。
- **工作負載盤點**：使用 Azure Migrate 自動探索伺服器、應用程式與相依性。記錄商業關鍵性、資料敏感性、合規要求、營運約束、 projected timeline。

## 關鍵實體

- **活動**：Nexus Hyperfabric Workshop 台灣場（2025/9/10）、Nexus Hyperfabric Roadshow
- **產品**：Nexus Hyperfabric、Nexus 6000 Series、Nexus Dashboard、Intersight、Hypershield
- **框架**：Azure Cloud Adoption Framework、Azure Well-Architected Framework、Microsoft Learn
- **工具**：Azure Migrate、Dr Migrate、CloudPilot、CAST Highlight、Cloudockit、AppCAT
- **人物**：Ken Kuo（郭桂延）、Terry Liao

## 參考來源

1. `Event-Hyperfabric workshop Ken+Andy_20250909.pdf` — Nexus Hyperfabric Workshop 台灣場
2. `Event-Nexus Hyperfabric Roadshow_Presentation_v1.pdf` — Nexus Hyperfabric Roadshow 簡報
3. `azure-cloud-adoption-framework.pdf` — Azure Cloud Adoption Framework 完整文件


## 相關連結
- [[混合雲AI採用框架_Hybrid_Cloud_AI_Adoption]]
- [[Dynasafe工作文件核心摘要]]

---
*自動領養：Gemini-CLI v11.0*
