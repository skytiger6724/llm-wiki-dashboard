# ---
筆記本:
  - "[[工作]]"
封存: false
---
針對您要求的 **"Hybrid Cloud Bursting" (混合雲溢流)** 技術展示，這在 [[NVIDIA]] Run:ai 的架構中是指「當在地端 GPU 資源飽和時，系統自動將任務導向雲端（如 GCP GKE）執行」的能力。
雖然目前網路上大多數的公開 Demo 是以 Azure 或 AWS 為例，但 Run:ai 的管理介面是**統一的**，其在 GCP 上的操作邏輯與畫面完全一致。
以下為您展示的核心技術流程與一段推薦的技術演示影片說明：
### 1. 推薦技術演示影片
這段影片由 [[NVIDIA]] 官方提供，展示了 Run:ai 如何在雲端環境（以 Azure 為例，與 GCP 邏輯相同）中實現智慧化的 GPU 調度。
- **影片連結：** [在 AKS 上部署與縮放 [[NVIDIA]] Run:ai (與 GCP GKE 邏輯一致)](https://www.youtube.com/watch?v=fgF3c_ZY5yQ)
- **關鍵片段 (Timestamps)：**
    
    - **[00:00:13]：** 提到 Run:ai 作為混合多叢集（Hybrid Multi-cluster）平台，能管理 AKS (或 GKE) 以及 **在地端 (On-prem)** 運行的算力。
    
    - **[00:00:19]：** 展示「單一管理視窗 (Single Pane of Glass)」，同時監控分布在不同地點的 GPU 節點。
    
    - **[00:02:14]：** 展示 **Quota (配額) 管理**。當團隊 A 的任務超過其在地端的保證配額時，系統如何利用剩餘資源（或啟動雲端溢流）。
    
    - **[00:01:41]：** 展示節點池 (Node Pools) 如何與雲端的擴展群組 (Scale Group) 對接，實現自動增減 GPU 數量。
    
---
### 2. "Hybrid Cloud Bursting" 的典型演示場景 (Demo Flow)
如果您在進行技術評估，典型的 Demo 通常包含以下三個階段：
### **第一階段：地端負載飽和 (On-prem Saturation)**
- **操作：** 數據科學家在地端環境（非 GDC 硬體）提交了 10 個大型訓練任務。
- **現象：** 地端只有 4 顆 GPU。Run:ai 會將 4 個任務掛載執行，剩餘 6 個任務進入 `Pending` 狀態。
### **第二階段：觸發溢流策略 (Bursting Trigger)**
- **操作：** 系統偵測到地端隊列擁塞。根據預設的 **"Cloud Bursting Policy"**，Run:ai 會自動與 **GCP GKE** 通訊。
- **技術细節：** 透過 GKE 的 **Cluster Autoscaler**，GCP 會自動啟動 G2 (L4 GPU) 或 A3 (H100 GPU) 實例。
### **第三階段：雲地協作執行 (Hybrid Execution)**
- **操作：** 那 6 個處於 `Pending` 的任務會自動被分派到 GCP 的節點上執行。
- **結果：** 在 Run:ai 的 Dashboard 上，您會看到同一個 Project 下，一部分任務在地端運行，另一部分在 GCP 運行，對使用者來說是**透明且無縫的**。
---
### 3. 混合雲部署的技術亮點
- **統一命名空間 (Unified Namespace)：** 透過 Run:ai，開發者不需要切換 `kubectl` 上下文。他們只需提交任務，Run:ai Scheduler 會根據「成本、數據位置、資源可用性」自動決定任務去向。
- **優先順序排程 (Priority & Preemption)：** 如果地端有高優先權任務進來，Run:ai 可以先將地端的低優先權任務「移動」到 GCP 執行，確保關鍵任務始終使用地端最低成本的算力。
- **鏡像一致性：** 配合 **Google Artifact Registry**，不論是在地端還是雲端，Run:ai 都會拉取完全相同的 Docker 鏡像，確保實驗的一致性。
### 4. 進階資源：[[NVIDIA]] Mission Control
[[NVIDIA]] 現在已將 Run:ai 的功能整合進 **[[NVIDIA]] Mission Control**，這是針對「AI 工廠」設計的最高階管理平台。它支援跨全球資料中心與雲端的 GPU 監控與維運。

> [!TIP]
> 
> 建議： 若您需要針對 GCP 的實作清單，建議參考 [[NVIDIA]] Run:ai 官方文檔 - 集群安裝，其中詳述了如何透過 Helm 將地端與雲端 Agent 分別註冊到同一個控制平面
> 
>