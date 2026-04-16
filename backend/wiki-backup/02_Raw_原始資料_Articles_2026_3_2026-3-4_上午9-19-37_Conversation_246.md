# ---
tags: [Wiki, AI, Work]
date: 2026-03-20
summary: "Prompt: Conversation_246"
---

# Prompt: Conversation_246

**Timestamp:** 2026年3月4日 上午9:19:37

---

。


---

混合雲標籤同步技術實作手冊 (Ver 1.0)

### 1. 核心架構組件


，透過 API 轉譯引擎將意圖同步至多雲環境。



- **身份源 (SSoT):** Cisco ISE (負責發放 SGT 標籤)。

- **地端網路執行器:** Cisco ACI (負責 EPG 與 Contract 執行)。

- **同步引擎 (Middleware):** 建議採用自建的 **Tag-Bridge Service** 或 **HashiCorp Terraform/Crossplane** 搭配 ACI APIC API。

- 。




---


### 2. API 串接工作流 (Step-by-Step)

第一階段：地端標籤獲取與標準化 (SGT-to-Dictionary)

當工作負載（VM 或 Container）上線時，ISE 會根據認證結果賦予 SGT。


- **監聽事件:** 同步引擎透過 WebSocket 或 REST API 訂閱 APIC 的 fvCEp (Endpoint) 事件。

- **屬性提取:** 提取該端點的 IP、MAC、EPG 名稱以及對應的 **SGT (Scalable Group Tag)**。

- 。


- 範例: SGT:10 → Security_Level: Critical |  。






第二階段：跨雲意圖轉譯 (Intent Translation)

將標籤與關聯的安全政策（Contracts）推送至雲端。


- 。

- **物件同步:**


- 。

- 。





- 。


第三階段：持續監控與 AI 護欄 (Verification & AI Feedback)

- 。

- 。


- 。





- **人機協作 (Deterministic Gate):**


- 。

- 。







---


### 3. 關鍵 API 參考範例 (JSON)


**A. 從 APIC 獲取端點標籤資訊:**

GET /api/node/mo/uni/tn-Common/ap-App1/epg-Trading.json?query-target=children&target-subtree-class=fvCEp


**B. 推送至雲端意圖轉換 (示意):**

POST /api/tag-bridge/v1/sync-cloud-policy
{
  "source": "ACI-DC-01",
  "app_tag": "Core_Trading",
  "identity_tag": "SGT_10",
  "intent": {
    "action": "Allow",
    "protocol": "tcp",
    "port": 443,
    "source_group": "Web_Frontend",
    "dest_group": "Core_DB"
  },
  "guardrail_mode": "Manual_Approve_Tier0"
}


---


### 


，同步引擎必須記錄以下 API 日誌：



- **同步成功率:** 跨雲標籤的一致性覆蓋率應 > 99% 。

- 。

- 。




---


### ARB 首席架構師結語


。
**下一步行動建議：**
您是否希望我針對「雲端標籤被人工手動篡改」時，如何透過 **Cisco Cloud Network Controller** 自動執行「強制覆蓋（Enforce Mode）」的 API 邏輯進行壓力測試場景設計？


**產品：**
 Gemini Apps