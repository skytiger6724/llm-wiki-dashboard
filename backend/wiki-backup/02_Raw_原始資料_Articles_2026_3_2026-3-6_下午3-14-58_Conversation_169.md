# ---
tags: [Wiki, AI]
date: 2026-03-20
summary: "Prompt: Conversation_169"
---

# Prompt: Conversation_169

**Timestamp:** 2026年3月6日 下午3:14:58

---

這是我為你設計的 **AIOps 智慧營運系統資訊架構圖**。


身為架構師，在繪製此圖時，我特別強化了數據從「流量抓取」到「向量化推理」的分層邏輯。這張圖展現了如何將 Gigamon 的底層數據與 APM 的應用層數據，透過標籤體系轉化為 LLM 可理解的知識庫。





---


### 架構層級深度解析


這套架構分為四個核心階段，確保實現端到端的全生命週期管理：

1. 流量與應用感知層 (Data Acquisition Layer)


- **Gigamon Tap Switch:** 作為物理與虛擬流量的唯一真相來源，負責從 L2-L7 提取 Metadata。它不只是轉發，而是過濾掉無用封包，僅將關鍵的網路狀態（如 RTT、流量突增、身份標籤）輸入 **OMS**。

- **APM Agent:** 嵌入在應用程式內部，補足了程式碼層級的視角（如 Method 调用、DB Query 耗時）。



2. 數據融合與關聯層 (Integration & Correlation Layer)


- **OMS (Operation Management System):** 接收來自 Gigamon 的數據，並與 IT 基礎設施（伺服器、儲存、雲端）的狀態進行初步聚合。

- **AIOps 統一資料庫:** 這是數據的「蓄水池」。透過你提到的 **應用標籤 (App Tag)** 與 **身份標籤 (Identity Tag)**，系統在此處將網路層的 IP/Port 與應用層的 User ID/Transaction ID 進行硬關聯。



3. AI 數據工程與 RAG 管道 (AI Engineering Pipeline)


- **正規化與向量化 (Normalization & Vectorization):** 這是最關鍵的一步。將結構化的 Metric 與非結構化的 Log/Trace 轉化為高維向量（Vectors）。

- **Vector Store (向量資料庫):** 存儲這些向量，使 LLM 能夠透過語義搜索，快速找到與當前故障最相關的歷史場景或運維手冊。



4. LLM 推理與決策層 (Intelligence & Action Layer)


- **RAG (檢索增強生成):** LLM 不再盲目猜測，而是從 AIOps 數據庫中檢索當下的「標籤上下文」，輸出具備業務邏輯的診斷結果。

- **全生命週期管理:** 輸出結果直接對接運維儀表板，提供從「預測性維護」到「自動根因分析」的閉環能力。




---


### 架構師的最後叮嚀


在實作這套架構時，請務必注意 **數據清洗 (Data Cleansing)**。因為 LLM 的 RAG 效果高度依賴於輸入數據的品質。如果 Gigamon 傳入的 Metadata 雜訊過多，會干擾向量化的準確度。


**這份架構圖符合你的規劃預期嗎？如果你需要針對其中某個特定的組件（例如 OMS 與 AIOps 資料庫之間的接口協定）進行詳細定義，我可以為你撰寫技術規格書。**


**產品：**
 Gemini Apps