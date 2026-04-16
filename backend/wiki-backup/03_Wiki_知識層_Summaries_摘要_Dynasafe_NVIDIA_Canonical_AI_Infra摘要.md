# ---
tags: [Wiki, AI, Work]
date: 2026-04-08
summary: "Dynasafe_NVIDIA_Canonical_AI_Infra摘要"
---

# Dynasafe_NVIDIA_Canonical_AI_Infra摘要

**建立時間**: 2026-04-08 12:50
**更新時間**: 2026-04-08 12:50
**主題分類**: AI 基礎設施 / [[NVIDIA]] / Kubernetes / 開源 MLOps

---

## 核心摘要

[[NVIDIA]] 與 Canonical 合作提供開源 AI/ML 基礎設施堆疊。核心架構為 Ubuntu Server + MicroK8s + Charmed Kubeflow + [[NVIDIA]] NIM。參考架構基於 Dell PowerEdge R7525 + [[NVIDIA]] A100 GPU。[[NVIDIA]] AI Enterprise 提供企業級容器化 AI 軟體，包含超過 100 種 AI 框架與預訓練模型。Executives Guide to Managed AI Infrastructure 說明為何企業應考慮託管 AI 基礎設施。Edge AI Silicon 參考架構涵蓋邊緣 AI 的硬體選擇與部署模式。

## 關鍵概念清單

- **Canonical AI Stack**：Ubuntu Pro → MicroK8s → Charmed Kubeflow → Juju Operators
- **[[NVIDIA]] NIM 微服務**：預優化的推理微服務，可透過 Helm/KServe 快速部署
- **DGX + Kubeflow 解決方案**：[[NVIDIA]] DGX 系統與 Kubeflow 整合的參考架構
- **MLOps 生命週期**：數據獲取 → 特徵工程 → 訓練/測試 → 部署 → 監控 → 再訓練
- **GPU 資源池化**：vGPU (C系列) 和 MIG (Multi-Instance GPU) 實現多租戶共享
- **Managed AI Infrastructure 優勢**：降低運營複雜度、專注核心業務、獲得專業支持
- **Edge AI 架構**：從雲端訓練到邊緣推論的分散式 AI 部署模式
- **開源 ML 基礎設施優勢**：快速迭代實驗、可擴展性、避免供應商鎖定
- **NGC ([[NVIDIA]] GPU Cloud)**：容器、Helm charts、預訓練模型的註冊中心
- **Charmed Operators**：Juju 模型驅動的 Kubernetes Operator，自動化部署與維運
- **AI Workbench**：開發者工具集，管理 GPU 容器內的 Python 依賴與版本

## 關鍵實體清單

- **[[NVIDIA]] DGX** — [[NVIDIA]] 企業級 AI 超級電腦系統
- **[[NVIDIA]] NIM** — [[NVIDIA]] Inference Microservices
- **[[NVIDIA]] A100 / H100 / H200** — GPU 加速器系列
- **MicroK8s** — Canonical 的輕量 Kubernetes 發行版
- **Charmed Kubeflow** — Canonical 的 Kubeflow 管理方案
- **Juju** — Canonical 的 Operator Framework
- **Ubuntu Pro** — Canonical 的企業級 Ubuntu 訂閱服務
- **Dell PowerEdge R7525** — 參考架構伺服器平台
- **[[NVIDIA]] AI Enterprise (NVAIE)** — 企業級 AI 軟體套件
- **Triton Inference Server** — [[NVIDIA]] 推理服務
- **TensorRT** — [[NVIDIA]] 推理優化引擎
- **Morpheus** — [[NVIDIA]] 網路安全 AI 框架
- **KServe** — Kubernetes 上的模型服務框架

## 參考來源

1. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Nv_ubuntu/49180a1d-AI enterprise solution powered by Canonical and [[NVIDIA]].pdf`
2. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Nv_ubuntu/Build_Your_Performant_ML_Stack_with_NVIDIA_DGX_and_Kubeflow.pdf`
3. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Nv_ubuntu/Executive's_guide_to_Managed_AI_Infrastructure_WP.pdf`
4. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Nv_ubuntu/NVIDIA_DGX_Kubeflow_solution_06_03_23.pdf`
5. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Nv_ubuntu/nvidia-ai-enterprise-and-charmed-kubernetes-deployment-guide.pdf`
6. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Nv_ubuntu/ra_edge_ai_silicon.pdf`
7. `/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/Nv_ubuntu/ra_open_source_machine_learning_infrastructure.pdf`
