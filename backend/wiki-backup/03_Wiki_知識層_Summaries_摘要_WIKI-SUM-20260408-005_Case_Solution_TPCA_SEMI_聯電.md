# ---
tags: [Wiki, AI, Work, Finance]
date: 2026-04-08
summary: "WIKI-SUM-20260408-005  Case Solution + TPCA + SEMI + 聯電摘要"
---

# WIKI-SUM-20260408-005 | Case Solution + TPCA + SEMI + 聯電摘要

> 編譯時間：2026-04-08
> 來源：Case Solution、TPCA 採購案、SEMI 半導體 AI 化調查、聯電 DGX H200 教育訓練

## 核心摘要

此組合涵蓋四個主題：FY26 台灣 CX 合作夥伴研討會（服務策略與續訂）、TPCA 電路板產業 LLM 可行性委外測試採購案、SEMI 2024 台灣半導體產業 AI 化調查報告（多位專家觀點）、以及聯電 DGX H200 教育訓練文件。核心聚焦於思科服務轉型、半導體業 AI 導入現況與挑戰、以及 [[NVIDIA]] GPU 營運實務。

## 關鍵概念

- **FY26 TW CX Partner Workshop**：思科服務策略轉型為 Personalized、Proactive、Predictive，由 [[Agentic AI]] 與 human expertise 驅動。三級支持服務：Basic（基礎）、Standard（標準）、Signature（尊享）。Premium Services 策略強調與合作夥伴共同打造競爭優勢、加速客戶價值實現。
- **Cisco IQ**：AI 驅動的資產與風險洞察平台（early field trial）。支援 AI-powered troubleshooting、predictive analysis、personalized asset intelligence。
- **軟體續訂最佳實踐**：涵蓋 Security、Catalyst & CAI、Collaboration 三大產品線。Cisco360 與 CPI（Customer Partner Incentive）更新。
- **TPCA 電路板產業 LLM 可行性測試**：資策會採購案（NT$1,480,000）。測試生成式 AI 於 PCB 產業專業知識處理之可行性。要求資料收集清理至少 10,000 筆（含 word、excel、pdf、影像檔），評估 FFM、Lazarus 等大型語言模型，需具備中、英、泰語言轉譯能力。交付「模型選擇與預訓練模型效能評估成果報告」。
- **SEMI 半導體 AI 化調查 — 林京沛（聯電）**：提出「工業雙 AI」概念（Analytic AI + GenAI 協作）。AI 導入三大基石：聰明的大腦（LLM）、強力的外掛（系統串接）、專業的知識（經驗梳理）。聯電 AI 從總經理開始推動，高階經理人需具備 AI 知識基礎。SEMI 計畫打造半導體專屬 LLM。
- **SEMI 半導體 AI 化調查 — 魏志中（新思科技）**：台灣導入 GenAI 的 IC 設計公司可能不到 5%。AI 在半導體業兩大應用：機器學習建模識別潛在故障、AI 導入 EDA 系統加速 TAT。警告「AI 時代無法再有後發先至」。台灣企業保守，決策時間長。
- **SEMI 半導體 AI 化調查 — 梁伯嵩（聯發科）**：「紅皇后賽道」理論 — 不奔跑就會落後。聯發科 2012 年即關注 AI，2016-2017 年將自有 AI 加速器應用於 IC 產品。自建 MediaTek DaVinci AI 平台（達哥），釋出供其他企業使用。提醒不要用現有 ROI 框架估算 AI 投資，容易過度保守。
- **SEMI 半導體 AI 化調查 — 楊光磊（台大/台積電前研發處長）**：生成式 AI 在傳統工業用處有限，半導體製造數據與自然數據結構不同。建議用 Expert System（少量專業資料）而非巨量資料大模型。台灣企業不熟悉軟體應用端，數位轉型難度高。建議「借 AI 之勢轉型」：拆解內部營運模式、主動向外擴展。
- **SEMI 結論（曹世綸，SEMI 總裁）**：半導體業內部 AI 化差距大。SEMI Smart Data-AI Initiative 自 2018 年推動，聚焦 Digital Twin、永續發展、人才培育。
- **聯電 DGX H200 教育訓練**：涵蓋 [[NVIDIA]] GPU Cloud（NGC）使用、Support 開啟方式（Enterprise Support Portal 或 enterprisesupport@nvidia.com）、MIG（Multi-Instance GPU）教學。MIG 可將每 GPU 切分最多 7 個獨立執行個體（H200 每 instance 為 18GB）。操作基於 nvidia-smi 指令，reboot 後清除設定。

## 關鍵實體

- **客戶/組織**：TPCA（電路板產業協會）、SEMI、聯電（UMC）、聯發科（MediaTek）、新思科技（Synopsys）、台積電、資策會（III）
- **產品/平台**：DGX H200/H100、NGC（[[NVIDIA]] GPU Cloud）、NIM（[[NVIDIA]] Inference Microservices）、MIG（Multi-Instance GPU）、MediaTek DaVinci AI（達哥）、Cisco IQ
- **模型/框架**：FFM、Lazarus（TPCA 評估之 LLM）、Expert System
- **人物**：Luke Power、Michelle Fu、Ken Kuo、林京沛、魏志中、梁伯嵩、楊光磊、曹世綸
- **採購案**：PP25040012（電路板產業大型語言模型可行性委外測試，NT$1,480,000）

## 參考來源

1. `FY26 TW CX Partner Workshop Deck20260316.pdf` — 思科台灣 CX 合作夥伴研討會
2. `動力安全-解決方案架構師 (Solution Architect)-Mr. Lai.pdf` — 解決方案架構師職缺資訊
3. `TPCA/PP25040012_1_3_需求說明書PP25040012.pdf` — 電路板產業 LLM 可行性測試需求書
4. `20250121 SEMI 調查.pdf` — SEMI 2024 台灣半導體產業 AI 化調查報告
5. `聯電 DGX H200 教育訓練.pdf` — DGX H100/200 簡易教學文件
6. `TPCA/PCB KM 前期規格書.pdf` — PCB KM 前期規格書
7. `TPCA/PP25040012_1_1_投標須知.pdf` — 投標須知
8. `TPCA/PP25040012_1_2_勞務採購履約相關規定.pdf` — 勞務採購履約規定
9. `TPCA/PP25040012_1_4_保密切結書.pdf` — 保密切結書
10. `UMC_NV/採購單/Dynasafe_聯電DGX主機採購(軟體+人力)_Final_V3.pdf` — 聯電 DGX 採購單（軟體+人力）
11. `UMC_NV/採購單/Dynasafe_聯電DGX主機採購(硬體)_Final_V3.pdf` — 聯電 DGX 採購單（硬體）
