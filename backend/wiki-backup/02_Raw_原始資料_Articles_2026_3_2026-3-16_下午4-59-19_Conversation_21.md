# ---
tags: [Wiki, AI, Work, Spirituality]
date: 2026-03-20
summary: "Prompt: Conversation_21"
---

# Prompt: Conversation_21

**Timestamp:** 2026年3月16日 下午4:59:19

---

這段影片由國立台灣大學李宏毅教授主講，以開源專案 **OpenClaw**（小龍蝦）為例，深入淺出地解剖了 AI Agent（人工智慧代理人）的運作原理、技術架構以及潛在的資安風險。


以下是針對影片內容的深度解析與重點整理：


### 一、 核心理論：AI Agent vs. 大型語言模型 (LLM)


影片首先釐清了一個關鍵觀念：**AI Agent 不等於大型語言模型**。



- **語言模型 (LLM)**：本質是「文字接龍」。它住在一個沒有窗戶的黑盒子裡，只負責根據輸入的指令（Prompt）預測下一個字（Token）。它「只動口不動手」。 [[20:51](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=1251)]

- **AI Agent (代理人)**：是人與模型之間的「介面」與「執行框架」。它讓語言模型擁有「手」可以操控電腦、讀取檔案、上網、甚至與其他 AI 協作。 [[12:42](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=762)]




---


### 二、 技術路徑：AI Agent 是如何運作的？


Agent 的運作是一個循環過程，核心依賴於對 Prompt 的精密加工：


- **系統提示詞 (System Prompt)**：Agent 會在你的問題前加上一段非常長的文字，包含「它是誰」、「人生目標」、「擁有的工具清單」以及「行為準則」。這讓模型在接龍時能表現出穩定的人格。 [[27:09](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=1629)]

- **工具調用 (Tool Call)**：當 LLM 判斷需要執行動作時，它會輸出一個特殊的符號（如指令代碼）。Agent 框架（OpenClaw）偵測到符號後，會在本地電腦執行對應的程式（如讀檔、繪圖、配音），再將結果回傳給 LLM 繼續接龍。 [[33:51](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=2031)]

- **上下文管理 (Context Engineering)**：由於模型有「脈絡視窗」（Context Window）的限制，Agent 必須透過以下技術來節省空間： [[23:25](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=1405)]


- **上下文壓縮 (Context Compression)**：將過往對話摘錄成簡短摘要。 [[01:13:43](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=4423)]

- **子代理人 (Sub-agent)**：繁殖出小代理人去處理繁瑣庶務（如讀長篇論文），主代理人只接收摘要結果。 [[46:58](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=2818)]







---


### 三、 名詞解釋與概念



- **Token (權杖/詞元)**：模型處理文字的基本單位。 [[21:08](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=1268)]

- **Context Window (脈絡視窗)**：模型一次能處理的輸入加上輸出的長度上限。 [[23:25](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=1405)]

- **RAG (檢索增強生成)**：Agent 透過搜尋本地的 .md 檔案（長期記憶）來尋找答案，而非僅依賴模型本身的知識。 [[01:02:30](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=3750)]

- **Heartbeat (心跳機制)**：每隔固定時間（如 30 分鐘）主動「戳」一下 AI，讓它檢查是否有待辦事項，達成 AI 自主運行的感覺。 [[01:06:31](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=3991)]

- **Skill (技能)**：以 Markdown 檔案儲存的工作 SOP（標準作業程序），Agent 只有在需要時才會讀取這些技能文件。 [[53:14](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=3194)]




---


### 四、 資安觀念與風險管理


李教授特別強調，給予 AI 權限如同讓它「附身」在電腦上，存在極大風險：



- **Prompt Injection (指令注入)**：攻擊者可能在網頁、郵件或 YouTube 留言中隱藏惡意指令（例如 rm -rf 清空硬碟）。Agent 讀取到後若無過濾，可能會直接執行。 [[38:06](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=2286)]

- **惡意 Skill 陷阱**：網路上分享的 AI 技能可能包含木馬程式，引導 Agent 下載並執行加密的惡意檔案以規避防毒軟體。 [[57:50](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=3470)]

- **防禦策略**：

- **人類審核 (Approval Mode)**：設定執行危險指令前必須經過人類確認。 [[41:44](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=2504)]

- **環境隔離**：不要將 Agent 裝在存有個人私密資料或密碼的常用電腦，建議使用乾淨的新電腦或格式化後的舊電腦。 [[07:33](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=453)]

- **獨立帳號**：為 AI 申請專屬的 Email 或 GitHub 帳號，與個人權限切分。 [[01:22:11](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=4931)]







---


### 五、 核心觀念：AI 的「遺忘」與「成長」



- **記了個寂寞**：如果 AI 說它記住了，但沒有實際啟動工具去修改本地的 .md 檔案，那麼下次開啟對話時它就會完全忘記。必須確認它有執行「寫入」動作才算真正記住。 [[01:05:48](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=3948)]

- **學會等待**：透過排程系統（Cronjob），AI 可以處理需要長時間運作的任務（如等待另一個 AI 生成影片），在三分鐘後再回頭檢查結果。 [[01:12:08](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=4328)]




**總結建議**：對待 AI Agent 應視其為「實習生」，給予安全、隔離的練習環境，讓它在受控的範圍內嘗試與犯錯，才能真正發揮其 24 小時不間斷運作的強大潛力。 [[01:21:02](http://www.youtube.com/watch?v=2rcJdFuNbZQ&t=4862)]


**產品：**
 Gemini Apps