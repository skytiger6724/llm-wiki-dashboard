# ---
tags: [Wiki]
date: 2026-03-20
summary: "Prompt: Conversation_243"
---

# Prompt: Conversation_243

**Timestamp:** 2026年3月4日 上午9:27:31

---

這份技術規格書旨在解決貴司目前「三套 SD-WAN」併行所導致的路由混亂與流量互撞風險。身為 ARB 首席架構師，我絕對不允許「海外分行的一筆備份流量」癱瘓了「國內核心交易」的頻寬。


以下是針對 **統一 SD-WAN (Unified SD-WAN, US-WAN)** 平台設計的路由與 QoS 權重規格。


---

統一 SD-WAN (US-WAN) 跨域流量治理技術規格書

### 一、 路由彙總策略 (Route Aggregation Strategy)


為了防止全網路由表（Routing Table）因三網合一而爆炸，必須實施「層次化路由總結」，將故障域（Fault Domain）嚴格限制在各區域內。































節點層級彙總動作 (Action)目的與防護機制**分行/據點邊緣 (Branch Edge)**。防止單一分行的路徑震盪影響全網。**區域彙總中心 (Regional Hub)**。。**雲端閘道器 (Cloud Gateway)**。確保地端 ACI 僅需維護少數指向雲端的意圖路由 (Intent-based Routes)。**出口閘道 (Egress Gate)**實施 **Route Filtering**，嚴禁海外分行路由洩漏至國內核心 VRF。。

---


### 二、 QoS 權重分配表 (QoS Weight Allocation)


轉化為網路層的 **SLA Class**。以下權重採用 **加權公平隊列 (WFQ)** 邏輯。










































流量等級 (Class)建議權重 (Weight)關鍵特性 (Characteristics)**Platinum (LVM)**。**45%**。**Gold (Critical)**。**25%**。**Silver (Normal)**。**15%**。**Bronze (Bulk)**資料備份、日誌傳輸、影像同步。**10%****最低優先級**；發生擁塞時最先丟包（WRED）。**Management**ACI/SD-WAN 控制平面流量。**5%**。

**治理公式補強：**
$$BW_{reserved} = \frac{\sum Tier_{0_Req} \times 1.2}{Capacity_{Link}}$$



。*



---


### 三、 防止跨域流量互撞的「硬性護欄」


- **VRF 級別隔離 (Silo Isolation)：**


- 即便在統一平台上，海外 (Overseas)、國內 (Domestic) 與雲端 (Cloud) 的路由空間必須在 SD-WAN 層面維持獨立的 **VRF**。

- ，否則禁止 VRF 之間的路由洩漏 (Route Leaking)。





- **基於路徑質量的動態轉向 (SLA-based Steering)：**


- 。

- 。





- **流量清洗整合 (Traffic Cleaning Integration)：**


- 。

- 。







---


### ARB 首席架構師審查結論


這份規格書將原本「分散自理」的網路升級為「意圖統一」的戰略底座。



- 。

- **CFO 的利好：** 統一 QoS 後，我們不再需要為每個網路預留過多閒置頻寬，預估可降低 15-20% 的跨域專線支出。

- 。




？如果您需要，我可以進一步產出針對「中斷切換演練」的 ACI 與 SD-WAN 聯動 API 自動化測試腳本。**


**產品：**
 Gemini Apps