# ---
tags: [Wiki, AI]
date: 2026-03-20
summary: "Prompt: Conversation_164"
---

# Prompt: Conversation_164

**Timestamp:** 2026年3月6日 下午3:29:31

---

根據您提供的兩份文件（架構建議與技術規格書），以下為「統一 SD-WAN（US-WAN）平台」的技術架構圖與核心設計說明。


### 統一 SD-WAN (US-WAN) 平台技術架構圖

graph TD
    subgraph Management_Layer [管理與智能層]
        AIOps[AI Ops 統一可視化看板] -- 根因推論與自動優化 --> US_Controller
        Evidence[同證據 Evidence Model 稽核軌跡] --- AIOps
    end

    subgraph Control_Security_Layer [控制與安全防護層]
        US_Controller[統一控制平面: vManage / APIC]
        DMZ[Hybrid DMZ: DDoS / IPS / WAF 流量清洗]
        US_Controller -- 意圖映射 --> DMZ
    end

    subgraph Backbone_Layer [統一骨幹網 Unified Backbone]
        Backbone{US-WAN 核心骨幹}
        Path1[海纜主線] --- Backbone
        Path2[備援衛星 / 5G] --- Backbone
        
        subgraph QoS_Engine [QoS 權重分配 WFQ]
            Q1[Platinum 45%: 關鍵交易]
            Q2[Gold 25%: 重要 App]
            Q3[Silver 15%: 一般業務]
            Q4[Bronze 10%: 備份日誌]
            Q5[Mgmt 5%: 控制流量]
        end
        Backbone --- QoS_Engine
    end

    subgraph Edge_Access_Layer [存取與路由邊界]
        Domestic[國內核心/分行] -- "ACI EPG 映射" --> Backbone
        Overseas[海外分行] -- "路由過濾 (Route Filtering)" --> Backbone
        Cloud[公有雲 VPC/VNet] -- "Cloud OnRamp 彙總" --> Backbone
    end

    %% 關鍵連線
    DMZ --- Backbone
    US_Controller -- "SLA-based Steering" --> Backbone
    
    %% 標註
    classDef highlight fill:#f9f,stroke:#333,stroke-width:2px;
    class Backbone,US_Controller highlight;


---


### 技術架構核心組件說明

1. 管理與智能層 (Intelligence & Management)


- 。

- 。



2. 統一控制與安全邊界 (Control & Security)


- 。

- 。

- 。



3. 統一骨幹網與 QoS 調度 (Backbone & QoS)


- 。

- **QoS 權重硬性護欄**：


- **Platinum (Tier 0)**：分配 **45%** 權重，採嚴格優先（PQ），確保抖動 < 10ms 。

- 。

- 。







4. 層次化路由彙總策略 (Routing Strategy)

：



- 。

- 。

- 。




### 落地路線圖 (18個月)



- 。

- 。

- 。




根據您提供的文件，這份「統一 SD-WAN 平台（Unified SD-WAN）」的技術架構核心在於打破「煙囪式（Silo）」困境，將**海外、國內、雲端**三大網路整合成「雲地一體」的營運底座。


以下為您產出的技術架構示意圖：


{
"action": "image_generation",
"action_input": "{"prompts": ["A professional technical architecture diagram for a 'Unified SD-WAN Platform'. The diagram shows three interconnected domains: Overseas Branches, Domestic Branches, and Cloud (VPC/VNet), all linked via a central 'Unified Backbone'. Key features displayed: 1. ACI and Cisco SD-WAN (Cloud OnRamp) integration mapping EPG/SGT to VPN/VRF. 2. A 'Hybrid DMZ' security layer with DDoS, IPS, and WAF. 3. Hierarchical Route Aggregation nodes. 4. A side panel showing QoS weights (Platinum 45%, Gold 25%, etc.). 5. A Unified Control Plane with AI Ops visibility. Modern, clean, enterprise network topology style with Chinese and English labels."], "image_generation_usecase": "alternatives", "aspect_ratio": "aspect_ratio_16_9"}"
}


### 統一 SD-WAN 平台：架構深度解析


這套架構的核心邏輯是將原本分散的網路（Source 1）轉化為「意圖導向」的戰略資產。以下是根據文件整理的關鍵技術組件：

1. 核心骨幹與整合（Unified Backbone & ACI）


- 。

- 。



2. 層次化路由與隔離（Hard Guardrails）


- **路由彙總策略**：


- 。

- 。

- 。





- 。



3. 智慧流量治理（QoS & SLA Steering）


- ：


- 。

- **Gold (25%) / Silver (15%)**：重要業務與一般系統。

- **Bronze (10%)**：備份與影像，擁塞時優先丟包。





- 。



4. 安全與維運（Security & AI Ops）


- 。

- 。




。


**產品：**
 Gemini Apps