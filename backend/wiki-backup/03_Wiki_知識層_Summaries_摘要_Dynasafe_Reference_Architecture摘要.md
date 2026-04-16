# ---
tags: [Wiki, AI, Work]
date: 2026-04-08
summary: "Dynasafe_Reference_Architecture摘要"
---

# Dynasafe_Reference_Architecture摘要

**建立時間**: 2026-04-08 12:55
**更新時間**: 2026-04-08 12:55
**主題分類**: 參考架構 / VMware / SDDC / MicroCloud / 案例研究

---

## 核心摘要

VMware Reference Architecture 涵蓋 SDDC(軟體定義資料中心)的完整設計：從 vSphere/vSAN/NSX 基礎到 Validated Design(VVD)的實作指南。MicroCloud for 動力安全方案展示 Ubuntu 如何以開源替代 VMware，提供虛擬化、SDS(SDP/Ceph)、K8s、授權成本優勢。英業達 AP to OCI 案例展示地端 E-Learning 系統遷移到 Oracle Cloud 的完整 SOW 與架構。Cisco 研討會聚焦數位韌性與智慧維運。ThousandEyes + AppDynamics 整合提供端到端的全棧可觀測性。

## 關鍵概念清單

- **SDDC 四大支柱**：Compute(vSphere)、Storage(vSAN)、Network(NSX)、Management(vCenter/Aria)
- **VMware Validated Design (VVD)**：經 VMware 驗證的 SDDC 參考實作，涵蓋架構設計、部署、營運
- **Hub-Spoke vs VWAN**：兩種 Azure 登陸區域網路拓撲模式
- **MicroCloud vs VMware 對比**：
  - 虛擬化底層：ESXi vs KVM(LXD)
  - 軟體定義儲存：vSAN vs Ceph
  - 管理：vCenter vs LXD/MAAS
  - 授權：CPU Cores 計價 vs 開源免費
- **HCI 三層式架構**：運算 + 儲存 + 網路融合於標準 x86 伺服器
- **MicroCloud 硬體建議**：3 Node HCI, 2x16C CPU, 256GB RAM, ~23TB 可用空間
- **Cisco 數位韌性**：從被動維運到主動預測、AI 驅意的智慧維運
- **ThousandEyes + AppDynamics**：網路層 + 應用層的全棧可觀測性方案
- **英業達 OCI 遷移**：E-Learning 系統從地端 9 台 VM 遷移至 OCI，解決跨國連線速度問題
- **5R 遷移策略**：Rehost(搬移)、Refactor(重構)、Rearchitect(重新架構)、Rebuild(重建)、Replace(替換)

## 關鍵實體清單

- **VMware vSphere / vSAN / NSX** — VMware SDDC 核心產品
- **VMware Validated Design (VVD)** — VMware 參考實作指南
- **VMware Aria** — VMware 雲端管理產品線(原 vRealize)
- **Canonical MicroCloud** — 開源 HCI 解決方案(MAAS + LXD + MicroCeph + MicroCloud)
- **Ceph** — 開源分散式儲存系統
- **LXD** — Canonical 的系統容器/VM 管理器
- **MAAS** — Canonical 的裸機自動配置工具
- **Oracle Cloud Infrastructure (OCI)** — Oracle 公有雲
- **Cisco ThousandEyes** — 網路效能與數位體驗監控
- **DGX H200** — [[NVIDIA]] 最新一代 AI 訓練/推論 GPU 系統
- **AKS on Azure Stack HCI** — 混合雲 Kubernetes 方案

## 參考來源

1. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Refernece/vmware-reference-architecture-creating-software-defined-data-center.pdf`
2. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Refernece/vmware-validated-design-30-sddc-introduction.pdf`
3. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Refernece/vmware-validated-design-30-sddc-reference-architecture.pdf`
4. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Refernece/vmware-validated-design-43-sddc-architecture-design.pdf`
5. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Refernece/BRKOBS-1110.pdf`
6. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Refernece/Cisco研討會_強化數位韌性邁向智慧維運_0421.pdf`
7. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Refernece/DGX_H200_Use_Case_Sharing_Isa_v1.pdf`
8. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Refernece/MicroCloud for 動力安全_250326.pdf`
9. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Refernece/ThousandEyes-AppDynamics-Solution-Brief.pdf`
10. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Refernece/英業達APtoOCI.pdf`
