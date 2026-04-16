# ---
tags: [Wiki, AI, Work]
date: 2026-04-08
summary: "Dynasafe_Cisco Live 精華摘要"
---

# Dynasafe_Cisco Live 精華摘要

> 編譯時間：2026-04-08
> 主題編號：SUM-CL-001
> 主題分類：Cisco Live 2025 US 技術分享

---

## 核心摘要

Cisco Live 2025 US 是思科史上發布新產品最多的一次，涵蓋資料中心、Campus 網路、工業 IoT、協作、安全、ThousandEyes 和 Splunk 七大產品線。核心戰略圍繞三個方向：以 AI 為基礎的網路維運（AgenticOps、AI Canvas、AI Assistant）、安全與網路的深度整合（Hybrid Mesh Firewall、Hypershield、Universal ZTNA），以及統一平台策略（Catalyst + Meraki 統一管理與授權）。思科同時展示了與 [[NVIDIA]] 合作的 Secure AI Factory 架構，以及完整的 AI POD 基礎設施方案。

---

## 關鍵概念清單

### 一、AI 驅動維運（AgenticOps）

- **Deep Network Model (DNM)**：思科基於 40+ 年網路專業知識訓練的網路專屬 LLM，在 CCIE 風格測試中超越通用模型約 20%
- **AI Assistant**：自然語言驅動的網路自動化，支援設定變更、交換器遷移、安全 Wi-Fi 設定等 workflow
- **AI Canvas**：跨域協作排障工具，整合 NetOps、SecOps 和 IT 團隊於同一工作區，支援 generative UI 與 reasoning
- **AgenticOps 架構**：Agent-First Operations、Cross-Domain Operations、Autonomy with Oversight 三層模型

### 二、AI 基礎設施（AI POD）

- **AI POD 架構**：可擴展的 AI 基礎設施堆疊，涵蓋 Training、Fine-Tuning、Inferencing 三大場景
- **Scale Unit 定義**：Type 1（32 GPU）、Type 2（64 GPU）、Type 3（128 GPU），基於 UCS C885A M8 + Nexus 9300 系列
- **網路架構**：前後端分離Fabric，前端 400GbE，後端 200GbE rail-optimized design
- **儲存方案**：VAST 全閃存儲存設備，支援 S3/Object/Block/NFS/SMB/Vector/SQL 多格式
- **[[NVIDIA]] 合作**：Secure AI Factory，每層嵌入安全性，與 [[NVIDIA]] AI Enterprise 無縫整合

### 三、Campus 網路與 Unified Platform

- **統一平台**：Catalyst 與 Meraki 共用硬體、統一管理平台（Catalyst Center + Meraki Dashboard）、一致授權模式
- **Smart Switches**：新一代交換器支援 Hypershield，每個 port 成為防火牆
- **Secure Routers（Cisco 8000 系列）**：支援 SD-WAN、SASE、後量子加密
- **Universal ZTNA**：融合 Duo、Secure Access、Identity Intelligence，獲 SE Labs AAA 评级（100% 偵測與保護）
- **Branch as a Service**：簡化大規模分支部署與變更管理

### 四、安全架構演進

- **Hybrid Mesh Firewall**：意圖導向政策管理，支援 Cisco 與第三方防火牆，無需 rip-and-replace
- **Mesh Policy Engine**：一次設定、全網執行，保留政策 why 並隨環境動態更新
- **Hypershield 微分段**：基於 eBPF 的工作負載行為基線建構、異常偵測、自動分段政策
- **Secure Workload + ACI/ISE 整合**：自動化分段政策探索，AI 驅動應用行為可視化
- **Cisco Foundation AI Security**：業界首發安全大模型，Hugging Face 開源，支援摘要生成、分類、NER、問答、推理等任務
- **AI Defense**：基於 Robust Intelligence 收購，提供 AI 防火牆、供應鏈安全、演算法越獄防護
- **量子安全**：後量子密碼學（MACsec、IPsec、WAN MACsec）、後量子安全啟動、量子實驗室

### 五、工業 IoT（IIoT）

- **19 款新工業交換器**：IE3100-3500 系列，DIN-rail、IP67、Rackmount 三種形態
- **IE3500 Rugged Series**：支援 TSN Frame Preemption、10GigE、90W 4PPoE
- **Cyber Vision**：OT 資產盤點、通訊模式分析、AI 驅動的自動分群分段
- **Ultra Reliable Wireless Backhaul (URWB)**：零丟包、無縫切換、超低延遲，整合入 Enterprise Wi-Fi 7 AP
- **Wi-Fi 7 + URWB 效能**：延遲 <1ms、移動性 350 km/h、網路容量為 5G 的 100 倍

### 六、Collaboration（Webex）

- **AI 驅動 Room Vision PTZ 攝影機**：內建 AI 人物追蹤，Ethernet 即插即用
- **零接觸設備佈建**：自動化大規模設備入網
- **AI Agent Meeting Scheduler**：以人為中心的協作排程
- **Webex AI Agent**：全渠道、多語言（支援 12 種語言）、9 種語言即時支援
- **地端 AI 功能**：CCE Release 15 支援 AI Agent & Assistant
- **Zoom Meeting for Cisco Rooms**：RoomOS 支援 Zoom 會議（Q4 CY25）

### 七、ThousandEyes 保障

- **Traffic Insights GA**：企業網路流量直接可視性
- **Mobile Endpoints（Beta）**：Android/Zebra 掃描槍保障，MDM 支援
- **Industrial Devices（GA July）**：業界最廣泛工業 IoT 產品保障
- **Cloud Insights（GA July）**：AWS/Azure 多雲可視性，自動發現服務
- **Splunk 整合**：ITSI 雙向整合、Observability Cloud 共用服務地圖
- **AI Assistant**：故障排除工作流程、視圖解釋、測試分析、文檔處理

### 八、Splunk 整合與 AI 創新

- **Free Firewall Logs to Splunk**：FTD 客戶每台防火牆獲 5GB/Day Splunk Core，上限 1TB/Day
- **Cisco Security Cloud App**：單一應用整合所有 Cisco Security 產品
- **AI Defense + Splunk**：LLM 風險可視化，內建 ES 偵測
- **Talos 整合**：Attack Analyzer、Add-on、SOAR Connector
- **GPU Monitoring**：Gen AI 應用的 GPU、Vector DB、Langchain 監控
- **LLM Insights**：支援 OpenAI、Anthropic、Azure、AWS Bedrock、Gemini、Grok、Ollama
- **Machine Learning Toolkit**：50+ 演算法，引導式 AI workflow
- **AI Assistants Everywhere**：SPL AI Assistant、Enterprise Security AI Assistant

---

## Gartner 2025 MQ 回應要點

### 思科掉出 Leaders 象限為 Challenger

**Gartner 三大質疑與思科回應：**

1. **產品戰略不一致**
   - 思科回應：統一平台已服務 3500 萬台設備，每季新增 120 萬台；IDC 報告 Campus Switch 市占 48.2%、WLAN 市占 39.5%，均為第一

2. **創新不足**
   - 思科回應：AI Canvas 和 AgenticOps 為市場最具顛覆性創新，已於 2025/06 正式發布

3. **市場響應能力**
   - 思科回應：Unified Platform、Branch aaS、UZTNA、Cisco Capital Offering 均已發布

**Gartner 認可的三大優勢：**
- 整體可行性：廣泛地理覆蓋
- 產品：ThousandEyes 整合提供逐跳可觀察性
- 商業模式：Wi-Fi 7 統一授權簡化採購

**Gartner 策略規劃假設（思科已全部覆蓋）：**
- AI 網路維運：2028 年 35% 企業採用（思科 AgenticOps 已發布）
- 內部 NaaS：2028 年 15% 採用（思科 Branch aaS 已發布）
- ZTNA 取代 NAC：2029 年 20% 採用（思科 UZTNA 已發布）

---

## 關鍵實體清單

### 產品與平台

| 類別 | 產品名稱 |
|------|---------|
| AI 基礎設施 | AI POD、UCS C885A M8、UCS C845A M8、VAST 儲存 |
| 網路晶片 | Silicon One A100、K100、P100、P200、Q200 |
| 交換器 | Nexus 9364D-GX2A、9332D-GX2B、9364E-SG2、8202-32FH-M、8608、8712-MOD-M |
| 工業交換器 | IE3100/3200/3300/3400/3500、IE9300 系列 |
| 路由器 | Cisco 8000 系列（8100-8500）、ASR 9000/9900、NCS 540/5500/5700 |
| 管理平台 | Catalyst Center、Meraki Dashboard、Nexus Dashboard、Nexus Dashboard Orchestrator、Intersight |
| 安全平台 | Cisco Security Cloud Control、Secure Firewall 6100/200、Hypershield、Secure Workload |
| 協作 | Webex、RoomOS、CUCM、Expressway、CMS |
| 可觀察性 | ThousandEyes、Splunk、AppDynamics、Observability Cloud |

### 技術與架構

| 技術 | 說明 |
|------|------|
| AgenticOps | Agent-First 網路維運架構 |
| Deep Network Model | 思科專屬網路 LLM |
| AI Canvas | 跨域協作排障畫布 |
| Hybrid Mesh Firewall | 意圖導向混合網狀防火牆 |
| Hypershield | eBPF 驅動的動態微分段 |
| Universal ZTNA | 通用零信任網路存取 |
| Secure AI Factory | 與 [[NVIDIA]] 合作的安全 AI 基礎設施 |
| ACI Multi-Site | 鬆耦合資料中心互連架構 |
| URWB | 超可靠無線回程 |
| Routed Optical Networking | IP/光學融合網路 |

### 收購與整合

| 收購 | 時間 | 整合成果 |
|------|------|---------|
| Splunk | 2023.09 | 可觀察性與安全數據平台 |
| Isovalent | 2023.12 | eBPF/Cilium 技術、Hypershield 基礎 |
| Robust Intelligence | 2024.08 | Foundation AI、AI Defense |

---

## 參考來源

| # | 檔案名稱 | 路徑 |
|---|---------|------|
| 1 | 1-Opening-Cisco Live 開場.pdf | .../20250724_思科Cisco Live分享會 講義-selected/ |
| 2 | 2-NX-Cisco Live 精華篇.pdf | .../20250724_思科Cisco Live分享會 講義-selected/ |
| 3 | 3-IIoT-Cisco Live 精華篇.pdf | .../20250724_思科Cisco Live分享會 講義-selected/ |
| 4 | 4-Collab-Cisco Live 精華篇.pdf | .../20250724_思科Cisco Live分享會 講義-selected/ |
| 5 | 5-SEC-Cisco Live 精華篇.pdf | .../20250724_思科Cisco Live分享會 講義-selected/ |
| 6 | 6-CAI-Cisco Live 精華篇.pdf | .../20250724_思科Cisco Live分享會 講義-selected/ |
| 7 | 7-IMI-Cisco Live 精華篇.pdf | .../20250724_思科Cisco Live分享會 講義-selected/ |
| 8 | 8-TE-Cisco Live 精華篇.pdf | .../20250724_思科Cisco Live分享會 講義-selected/ |
| 9 | 9-Splunk-Cisco Live 精華篇.pdf | .../20250724_思科Cisco Live分享會 講義-selected/ |
| 10 | #Cisco GartnerWired-Wireless MQ Response_20250718.pdf | .../20250724_思科Cisco Live分享會 講義-selected/ |
