# ---
tags: [Wiki, AI, Work]
date: 2026-04-08
summary: "Dynasafe_Cisco 技術文件摘要"
---

# Dynasafe_Cisco 技術文件摘要

> 編譯時間：2026-04-08
> 主題編號：SUM-CT-001
> 主題分類：Cisco 技術架構文件（BRK 系列 + 架構設計）

---

## 核心摘要

本批次涵蓋 20 份 Cisco 技術文件，包含 BRK 系列技術議程（Networking、Security、AI/Cloud、Observability）與架構設計文件。核心主題包括：ACI Multi-Site 架構與部署、[[Agentic AI]] 入門與設計模式、AI 安全代理、eBPF/Isovalent 微分段、Nexus Smart Switches、跨架構 AI 網路方法、ACI 優化、Industrial IoT 與 MSP 策略。這些文件展示了 Cisco 從傳統網路設備商向 AI 驅動、安全融合的基礎設施平台的戰略轉型。

---

## 關鍵概念清單（依主題分組）

### 一、Networking 與 ACI

#### ACI Multi-Site（BRKDCN-2980）

- **Multi-Pod vs Multi-Site**：Multi-Pod 為緊耦合（同一 Fabric、共用 APIC），Multi-Site 為鬆耦合（獨立 Fabric、獨立 APIC）
- **Nexus Dashboard Orchestrator (NDO)**：跨 Fabric 的單一配置點，支援 autonomous sites 模板複製（最多 100 個 Fabric）
- **ISN 要求**：OSPF/BGP peering、sub-interface VLAN tag 4、不需 multicast、MTU 需額外 50/54 bytes
- **MTU 調適**：ACI 6.0(3)F 引入 TCP-MSS Adjust，解決 ISN 僅支援 1500B MTU 問題
- **使用場景**：DCI 互連、災難復原、編制隔離/擴展、SP 5G Telco DC

#### ACI 優化（Optimizing_ACI）

- 聚焦 ACI Fabric 效能優化與最佳實踐
- 涵蓋策略模型、Endpoint 學習、COOP 協議

#### Nexus Smart Switches

- Hypershield-ready 架構，每個 switch port 內嵌防火牆能力
- 支援 L3/L4/L7 狀態化政策檢查
- 東西向與南北向流量統一管控
- 適用 Campus、Branch、資料中心場景

### 二、Security

#### 雲端與應用安全（BRKSEC-2171）

- **韌性安全態勢**：不僅是防護，更強調政策、控制、威脅響應準備度
- **三大攻擊面**：身份攻擊、基礎設施攻擊、AI 應用攻擊
- **核心挑戰**：工具孤岛、攻擊面擴大、人才短缺、合規要求
- 強調 AI 與雲端普及帶來的新型安全挑戰

#### 安全可觀察性（BRKSEC-2265）

- Splunk + Cisco 安全產品的整合偵測與響應
- 聚焦 TDIR（Threat Detection, Investigation, Response）能力
- 利用 Splunk CISO Report 數據驅動安全策略

#### 量子安全（BRKSEC-2623）

- 後量子密碼學在網路設備的實作
- MACsec、IPsec、WAN MACsec 的量子安全升級
- 思科量子實驗室研發進展

#### AI 時代安全架構（BRKSEC-2772）

- 重新定義 AI 時代的資安防護框架
- 從防火牆到 Hybrid Mesh FW 到 Smart Switch 的演進
- 安全融入網路架構的每一個層級

### 三、AI/Cloud 與 [[Agentic AI]]

#### AI Agents 入門（BRKETI-1008）

- **[[Agentic AI]] 特徵**：對話式、生成式、自主性、自我改善
- **自主性分級**：
  - Level 1：規則基礎自動化（反應式、預設動作）
  - Level 2：ML 輔助自動化（确定性任務輔助）
  - Level 2+：Assistant 架構（LLM + Context + Knowledge）
  - Level 3：部分自動化（LLM 自主規劃與執行）
- **挑戰**：安全與信任、幻覺、偏差、數據安全、隱私、治理
- **工具**：LangChain、框架選擇、Agent 構建模式

#### 跨架構 AI 網路（Cross_Architecture_Approach_AI）

- AI 資料中心部署場景：AI 推理聯合、邊緣 AI、DCI 擴展
- **網路需求**：大頻寬（400G+）、RDMA/Lossless、低延遲、加密（量子安全）
- IP 與光學融合網路（Routed Optical Networking）
- Silicon One 晶片家族：A100、K100、P100、P200、Q200
- Cisco 8000 系列路由平台：Access 到 Core 統一 IOS-XR

#### eBPF/Isovalent（ebpf-ISOVALENT External Session）

- **eBPF**：extended Berkeley Packet Filter，可擴展的內核虛擬機器
- **Cilium**：基於 eBPF 的雲端原生可視性與安全增強
- **Hypershield 架構**：透過 eBPF 實現工作負載層級的動態微分段
- 適用場景：AI POD（Redhat Openshift）、容器環境
- 優勢：不需修改核心、不影響系統穩定性

#### AI 安全代理（Securing_AI_Agents）

- AI Agent 的安全考量與防護策略
- 身份為基礎的安全存取
- 防止未經授權的 AI 代理行為
- 與 UZTNA 的整合架構

### 四、Observability 與可觀察性

#### BRKOBS-1023

- Splunk 可觀察性雲與 Cisco 產品的整合
- AppDynamics GPU Monitoring、Vector DB 監控、Langchain 支援
- 自動 Agent 部署（Smart Agent 自動發現與安裝）
- AI-driven 異常偵測（Database anomaly detection）
- 自然語言查詢與 AI Assistant for SPL

### 五、Industrial IoT

#### PSOIOT-1018

- 工業網路現代化：AI 與軟體定義自動化
- 虛擬機器人控制器、虛擬 PLC/RTU
- 網路作為「神經系統」連接資料中心大腦與現場設備
- PoE 攝影機、低延遲、高頻寬需求
- Catalyst Center 對 OT 網路的自动化管理

### 六、MSP 與商業策略

#### PSOMSI-1003

- MSP（Managed Service Provider）策略與商業模式
- 服務提供商的 AI 連線 monetization
- 2027 年 62% 數據將在邊緣處理
- AI 豐富網路流量年增 120% CAGR
- Cisco Agile Services Networking 架構

### 七、開發者與自動化

#### DEVNET-2028

- 開發者工具與 API 整合
- 網路自動化與程式化介面
- 350+ App 的 Networking App Marketplace

#### BRKXAR-2028（Cross-Architecture）

- 跨平台整合與擴展架構
- API 驅動的工作流程自動化
- 第三方系統整合模式

#### BRKCOM 系列

- **BRKCOM-2018**：AI POD 架構設計，Scale Unit Type 1-3 詳細規格
- **BRKCOM-2115**：UCS 運算產品組合，AI Server 與 Mainstream Server
- **BRKCOM-2519**：HyperFabric AI UCS Storage Servers，VAST 儲存架構

#### BRKATO-2001

- 網路自動化主題
- 聚焦於自動化運維與管理

---

## 關鍵實體清單

### BRK 議程對照表

| 議程編號 | 主題 | 領域 |
|---------|------|------|
| BRKDCN-2980 | ACI Multi-Site Architecture | Data Center Networking |
| BRKETI-1008 | AI Agents 101 | AI/Edge Computing |
| BRKSEC-2171 | Building Resilient Security Postures | Cloud Security |
| BRKSEC-2265 | Security Observability | Security/Observability |
| BRKSEC-2623 | Quantum Security | Security |
| BRKSEC-2772 | AI Era Security Architecture | Security |
| BRKOBS-1023 | Observability Integration | Observability |
| BRKXAR-2028 | Cross-Architecture | Architecture |
| BRKCOM-2018 | AI POD Design | Compute/AI Infra |
| BRKCOM-2115 | UCS Compute Portfolio | Compute |
| BRKCOM-2519 | HyperFabric AI Storage | Storage |
| BRKATO-2001 | Network Automation | Automation |
| DEVNET-2028 | Developer Tools | Developer/API |
| PSOIOT-1018 | Industrial IoT Modernization | IIoT |
| PSOMSI-1003 | MSP Strategy | Service Provider |

### 非 BRK 技術文件

| 檔案 | 主題 |
|------|------|
| Cisco Nexus Smart Switches.pdf | Hypershield 交換器架構 |
| Cross_Architecture_Approach_AI.pdf | AI 資料中心跨架構網路方法 |
| Optimizing_ACI.pdf | ACI 效能優化 |
| ebpf-ISOVALENT External Session.pdf | eBPF/Cilium/Hypershield 技術 |
| Securing_AI_Agents.pdf | AI 安全代理架構 |

---

## 參考來源

| # | 檔案名稱 | 路徑 |
|---|---------|------|
| 1 | BRKATO-2001.pdf | .../Cisco AI Infra/ |
| 2 | BRKCOM-2018.pdf | .../Cisco AI Infra/ |
| 3 | BRKCOM-2115.pdf | .../Cisco AI Infra/ |
| 4 | BRKCOM-2519.pdf | .../Cisco AI Infra/ |
| 5 | BRKDCN-2980.pdf | .../Cisco AI Infra/ |
| 6 | BRKETI-1008.pdf | .../Cisco AI Infra/ |
| 7 | BRKOBS-1023.pdf | .../Cisco AI Infra/ |
| 8 | BRKSEC-2171.pdf | .../Cisco AI Infra/ |
| 9 | BRKSEC-2265.pdf | .../Cisco AI Infra/ |
| 10 | BRKSEC-2623.pdf | .../Cisco AI Infra/ |
| 11 | BRKSEC-2772.pdf | .../Cisco AI Infra/ |
| 12 | BRKXAR-2028.pdf | .../Cisco AI Infra/ |
| 13 | Cisco Nexus Smart Switches.pdf | .../Cisco AI Infra/ |
| 14 | Cross_Architecture_Approach_AI.pdf | .../Cisco AI Infra/ |
| 15 | DEVNET-2028.pdf | .../Cisco AI Infra/ |
| 16 | Optimizing_ACI.pdf | .../Cisco AI Infra/ |
| 17 | PSOIOT-1018.pdf | .../Cisco AI Infra/ |
| 18 | PSOMSI-1003.pdf | .../Cisco AI Infra/ |
| 19 | ebpf-ISOVALENT External Session.pdf | .../Cisco AI Infra/ |
| 20 | Securing_AI_Agents.pdf | .../Cisco AI Infra/ |


## 相關連結
- [[混合雲AI採用框架_Hybrid_Cloud_AI_Adoption]]
- [[Dynasafe工作文件核心摘要]]

---
*自動領養：Gemini-CLI v11.0*
