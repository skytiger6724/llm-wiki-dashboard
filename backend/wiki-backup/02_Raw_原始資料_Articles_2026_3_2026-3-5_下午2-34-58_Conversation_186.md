# ---
tags: [Wiki, AI, Work, Finance]
date: 2026-03-20
summary: "Prompt: Conversation_186"
---

# Prompt: Conversation_186

**Timestamp:** 2026年3月5日 下午2:34:58

---

既然你指定使用 **Antigravity (AG)** 這套以 Agent 為核心的自動化編排工具，我們將捨棄傳統線性邏輯（如 Make 的模組堆疊），改採 **「自主 Agent 導向」** 的設計。


在 Antigravity 的架構中，我們不只是「抓取資料」，而是建立一個具備 **「意圖識別 (Intent Recognition)」** 與 **「內容重構 (Content Reconstruct)」** 能力的數位員工。


---

🛠️ 系統架構與工具分工

這套系統在 Antigravity 環境下分為三個核心層級：































組件名稱負責任務運作邏輯**Scheduler Trigger****時間觸發器**設定每日 08:30 (CST) 啟動工作流。**Web Browser Agent****網頁感知員**進入 tw.yahoo.com，執行視覺或 DOM 掃描，精準提取「財經/經濟」板塊的標題與連結。**Antigravity Core Agent****決策與內容官****（本系統靈魂）** 負責判斷新聞價值、轉換 Markdown 格式，並調整為 Threads 專用的「脆味」語氣。**Threads API Executor****發佈執行員**將 Markdown 轉換為純文字/圖片組合，透過 API Token 推送到 Threads。

---

🏃 拆解真實可執行步驟

### 第一步：環境初始化 (Initialization)


在 Antigravity 建立一個新的 Workspace，並連結你的 Gemini API Key。設定 Web Browser 節點，目標指向 Yahoo 台灣首頁。


### 第二步：語義抓取 (Semantic Scraping)


不同於傳統 CSS Selector，我們讓 Agent 直接「看」網頁。



- **指令：** 「請找到 Yahoo 首頁中，與『台股、全球經濟、半導體、通膨、美債』相關的新聞區域，並提取前 5 則標題。」




### 第三步：Agent 處理 (Intelligence Process)


將抓取到的原始資料丟給核心 Agent。我們會在這裡套用特定的 **System Prompt**，確保產出的 Markdown 符合 Threads 的社群美學（簡潔、有觀點、有 Emoji）。


### 第四步：格式化與發佈 (Publishing)


將 Agent 輸出的 Markdown 傳遞至 HTTP Request 節點，對 Threads 官方 API 發送 POST 請求。


---

🧠 Antigravity Agent 運作專用 Prompt

請將以下內容直接貼入 Antigravity 的 **Agent Node** 設定中：


### 角色定義 (System Role)



你是一位專為 Threads (脆) 設計的財經專欄作家。你擅長從雜亂的網頁資訊中精煉出「對讀者錢包有影響」的經濟頭條，並以 Markdown 格式輸出。



### 任務指令 (Task Prompt)



**【輸入資料】**：[來自 Web Browser Node 的 Yahoo 新聞原始數據]


**【執行指令】**：


- **深度篩選**：僅保留與「經濟、產業、金融市場」相關的訊息，排除娛樂、社會與體育新聞。

- **價值判斷**：從中選出今日最關鍵的 3 條經濟新聞。

- **語氣轉換**：針對 20-45 歲台灣用戶，使用「專業但像朋友在聊天」的語氣，多用「...嗎？」或「這代表...」來增加互動感。

- **格式封裝**：嚴格依照下方 Markdown 範本輸出。


**【輸出 Markdown 範本】**：
🎙️ **今日經濟頭條｜快速掃描**

**1️⃣ [新聞標題，請簡化得更有吸引力]**



- 🧐 **一話短評**：[說明這件事對市場或讀者的影響]




**2️⃣ [新聞標題]**



- 📊 **重點數據**：[若有數字請列出，若無則改為「關鍵影響」]




**3️⃣ [新聞標題]**



- 💡 **專家觀點**：[用一句話總結後續觀測重點]




---


☕ 早起看經濟，投資不走偏。
#經濟 #Threads財經 #台股 #Gemini自動化 #Antigravity



---

🎯 專家級優化建議


- **避開廣告：** Yahoo 首頁充滿廣告標籤，在 Antigravity 的 Browser 節點中，建議勾選 Skip Ad Segments 選項，減少垃圾資訊對 Gemini 的干擾。

- **圖片生成 (選配)：** 如果想增加 Threads 的點擊率，可以再串接一個 Flux 或 DALL-E 節點，根據新聞標題生成一張財經風的配圖一併發送。

- **版本控制：** 既然你在開發 Hybrid Cloud AI 框架，建議將此自動化流程的版本標記為 v1.0-NewsAuto，並在 Antigravity 中記錄 Token 消耗模型，以利後續 TCO (成本) 計算。




**需要我幫你寫出對接 Threads API 的 JSON 格式 (Payload)，還是要優化針對半導體產業的新聞篩選邏輯？**


**產品：**
 Gemini Apps