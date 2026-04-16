# ---
tags: [Wiki, AI, Work, Finance]
date: 2026-04-10
summary: "[[Dynasafe]] 工作文件核心摘要"
---

# [[Dynasafe]] 工作文件核心摘要

## 核心摘要
[[Dynasafe]] 工作文件庫涵蓋 25 份高價值 .md 文件，橫跨**金融客戶提案**、**雲端智能部 BP**、**Cisco 360 評估**、**技術處主管報告**、**Solution Day 白皮書**、**混合雲 AI 框架**六大領域。核心主題圍繞：零信任架構、混合雲 AI 採用、統一標籤治理、微分段技術、企業 AI 治理框架。

## 關鍵概念

### 1. Gemini Enterprise AI 治理框架
- **文件編號 GEM-A-001**：企業級 AI 自律規範，涵蓋 10 條管理辦法
- **雲地部署決策三維度**：數據敏感度 (50%)、技術效能 (30%)、經濟成本 (20%)
- **三層 DLP 防護**：提示詞層級過濾 → RAG 權限審核 → 輸出層級審查
- **RTCO Prompt 框架**：Role → Task → Constraint → Output（通用全場景）
- **AI 使用情境判定矩陣**：綠燈 (會議記錄) / 黃燈 (程式碼) / 紅燈 (客戶投訴、核心專利)
- **安全脫敏規則**：人物→職稱、數據→百分比、地點→區域代稱、代碼→專案代稱

### 2. 統一標籤治理 (Unified Tag Governance)
- **核心邏輯**：從 IP 為中心 → 身分/意圖為中心，解決 SDDC 動態環境下策略爆炸問題
- **技術支柱**：IdNet (去中心化身分)、SRv6 (段落路由)、eBPF (內核編程)
- **Cisco SGT**：VXLAN-GPO 攜帶 16-bit 標籤，UADP ASIC 線速處理
- **VMware NSX DFW**：分散式防火牆嵌入 Hypervisor，策略跟隨 vNIC 遷移
- **Cilium eBPF**：K8s 環境事實標準，Pod 數值身分，P99 延遲比 iptables 低 1-3ms
- **AI 賦能**：生成式 AI 意圖翻譯 (自然語言 → 標籤策略)、閉環治理 (Closed-Loop)

### 3. NSX on ACI 混合架構
- **適用情境**：ACI 作 Underlay、NSX 作 Overlay 微分段
- **核心挑戰**：雙重 VXLAN 封裝 (MTU 問題)、可視性喪失、雙平台維運複雜度
- **決策建議**：虛擬化/安全優先 → NSX 為主；網路整合優先 → ACI 為主

### 4. 混合雲 AI 採用框架 (Hybrid Cloud AI Adoption Framework V0.3)
- **理論基礎**：資源基礎觀 (RBV)，AI 基礎設施 = 異質性戰略資源
- **價值鏈三支柱**：Compute to Data (數據就地化)、異構算力調度、Token 經濟模型 (TPS/$)
- **TCO 損益平衡點**：負載利用率 > 20% 時地端經濟性顯現，12-18 個月回本
- **五大維度**：商業財務、平台資料、營運算力、安全合規、人員組織
- **轉型旅程**：Envision → Align → Launch → Scale

### 5. 雲端智能部 BP (業務計劃)
- **人才盤點**：故障排除 52% 未達標、公有雲 STG 為 0%、自動化僅 5% 合格
- **工作量分析**：Teddy Chung (12 客戶, 9 SMO) 極高風險、Jarod Chang (9 BMO) 無備援
- **超級客戶**：玉山銀行 (21 工程師)、凱基人壽 (11 人)、彰化銀行 (10 人)
- **Cisco 360 評估**：Networking (8.50 Preferred)、Security (7.50 Preferred)、Cloud & AI (6.35 待衝刺)

## 關鍵實體
- **[[Dynasafe]] (動力安全)**：台灣 Cisco 頂級合作夥伴，聚焦金融/製造業零信任與混合雲
- **雲端智能部**：下轄 AST (架構)、CS (服務)、STG (儲存) 三團隊，約 30+ 技術人員
- **Cisco 360 Partner Program**：四維度評分 (Foundational/Capabilities/Performance/Engagement)
- **Gemini Enterprise**：Google 企業級 GenAI 平台，DLP 防護 + 不訓練客戶數據

## 參考來源
- `12_工作_Dynasafe/06_技術中心/HCI_COE/01_Cloud_Intelligence_Dept/2026_雲端智能部_BP/` (Gemini AI 規範、人才盤點、工作量分析、統一標籤治理報告)
- `12_工作_Dynasafe/06_技術中心/HCI_COE/01_Cloud_Intelligence_Dept/Cisco360 評估/`
- `12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2025/0515Solution Day/`
- `12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/COE2026/Hybrid_Clooud_AI_Adopt_Framewrok/`
- `12_工作_Dynasafe/05_業務與提案/05_Customer_Accounts/01_Financial_Sector/` (中信、玉山、三井住友)


## 相關連結
- [[Agentic_AI]]
- [[知識TCO_Knowledge_TCO]]

---
*自動領養：Gemini-CLI v11.0*
