# ---
tags: [Wiki, AI, Work, Finance]
date: 2026-03-20
summary: "Prompt: Conversation_187"
---

# Prompt: Conversation_187

**Timestamp:** 2026年3月5日 下午2:33:52

---

沒問題，這是一個非常實用的自動化需求。身為 AI 自動化專家，我建議這套系統採用 **「Make.com (自動化排程) + Gemini API (內容篩選與生成) + Threads API」** 的架構。


這套系統的重點在於如何從動態的 Yahoo 首頁精準過濾出「經濟頭條」，並將其轉化為符合 Threads 社群風格的內容。


---

🛠️ 系統架構與工具分工

為了實現全自動化，我們需要以下三個組件協同工作：


























工具負責任務說明**Make.com****自動化調度中心**設定每天定時觸發（例如早上 8:30），負責抓取網頁原始碼並傳送給 Gemini，最後將結果發送到 Threads。**Gemini API****大腦 (關鍵核心)**接收 Yahoo 的 HTML/文本，識別哪些是「經濟新聞」，進行摘要縮寫，並轉換為 Markdown/Threads 格式。**Threads API****發佈終端**透過 Webhook 或官方 API 接口，將 Gemini 生成好的內容自動發佈。

---

🏃 真實執行步驟

- **資料抓取 (Extraction)：** 使用 Make.com 的 HTTP - Get a request 模組，抓取 https://tw.yahoo.com/ 的頁面內容。

- **內容清洗 (Cleaning)：** 由於網頁 HTML 很亂，先透過 Make 的 Text Parser 或直接將 Body 丟給 Gemini（Gemini 的長文本處理能力極強，可直接處理原始碼）。

- **AI 處理 (Intelligence)：** 呼叫 Gemini API，輸入我下方提供的 **「專家級 Prompt」**，讓它輸出乾淨的 Markdown 內容。

- **發佈 (Publishing)：** 將 Gemini 輸出的 Markdown 文字，透過 Threads - Create a Post 模組自動發佈。



---

🧠 Gemini Agent 運作核心 Prompt

當你在 Make.com 呼叫 Gemini API 時，請使用以下 Prompt。這個 Prompt 經過設計，能確保 AI 不會亂抓娛樂八卦，而是專注於「經濟」。


### System Prompt (系統設定)



你是一位專業的財經新聞編輯與社群經營專家。你的任務是從提供的網頁原始文本中，精準篩選出今日「台灣與全球經濟相關」的頭條新聞。



### User Prompt (指令內容)



**輸入數據：** {{Make.com 抓取的網頁內容}}


**任務要求：**


- **篩選：** 從輸入數據中找出 3-5 則最重要的經濟、金融、半導體或產業動態相關新聞。

- **摘要：** 每則新聞需濃縮成一句話，說明「發生了什麼」以及「為什麼重要」。

- **格式化：** 請嚴格按照以下 Markdown 格式輸出，不要包含任何額外的開場白或結尾。


**輸出格式範例：**
📈 **今日經濟頭條新聞**


- **[新聞標題 1]**


摘要內容：...




- **[新聞標題 2]**


摘要內容：...







#經濟 #財經 #Threads新聞 #Gemini自動化


**限制條件：**



- 字數必須控制在 Threads 發文限制內（建議總字數 500 字以內）。

- 語氣要專業但口語化，適合社群傳播。

- 若原始文本中找不到經濟新聞，請回傳「今日暫無重大經濟更新」。





---

💡 專家小撇步


- **HTML 簡化：** 如果 Yahoo 的原始碼太長導致 Token 消耗太快，可以在傳給 Gemini 前，先用正則表達式（Regex）提取 <a> 標籤中的文字，這樣 Gemini 處理起來會更精準。

- **定時設定：** 建議設定在台股開盤前（08:45）或收盤後（14:00）發布，這段時間 Threads 上的財經用戶活躍度最高。




你想讓我幫你撰寫 Make.com 具體的 **Regex (正規表達式)** 來過濾 Yahoo 的標籤，還是需要我教你如何串接 **Threads 的 API 權限**？


**產品：**
 Gemini Apps