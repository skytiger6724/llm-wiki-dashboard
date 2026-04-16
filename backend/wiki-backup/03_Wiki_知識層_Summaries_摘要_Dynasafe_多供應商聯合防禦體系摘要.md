# ---
tags: [Wiki, AI, Work, Spirituality]
date: 2026-04-09
summary: "摘要：[[Dynasafe]] 多供應商聯合防禦體系 (Cisco, Akamai, Forcepoint)"
---

# 摘要：[[Dynasafe]] 多供應商聯合防禦體系 (Cisco, Akamai, Forcepoint)

## 核心摘要
本摘要整合了 [[Dynasafe]] 在零信任實務中採用的三大主流供應商技術方案。這些資料共同構建了一個從「網路微分割」、「應用層 API 安全」到「生成式 AI 數據防護」的立體化防禦矩陣。其核心理念在於：透過多維度的技術疊加，守住數據在分散式、AI 驅動環境下的最後邊界。

## 關鍵方案盤點

### 1. Cisco：數據中心微分割 (Secure Workload)
- **核心功能**：實現數據中心內部的「東西向流量」控制。
- **目標**：防止駭客在入侵後進行橫向移動，落實零信任的最後一哩路。
- **與 Wiki 連結**：技術化落實 [[零信任架構實務_Zero_Trust_Practice]]。

### 2. Akamai (Noname)：API 全生命週期安全
- **核心功能**：API 資產自動盤點、異常行為分析（如 Shadow API 檢測）。
- **目標**：守住現代應用的主要入口（API），防止數據透過 API 洩漏。
- **AI 映射**：針對 API 調用的「異常檢測 (Anomaly Detection)」模型。

### 3. Forcepoint：M365 與 GenAI 數據防護
- **核心功能**：結合 Web DLP、Endpoint DLP 與 CASB。
- **戰略價值**：針對 AI 生成內容進行實時掃描，防止敏感特徵透過 Prompt 被導出。
- **工作流**：發現 -> 分類 -> 優先級 -> 修復 -> 保護 (The Five Stages)。

## 關鍵洞察
- **防禦者優勢的技術化**：透過微分割與 DLP，企業在自己的環境中建立了多重「數位關卡」，抵銷了駭客的靈活性優勢。
- **標籤即治理**：Forcepoint 的智能分類與 Cisco 的標籤策略共同印證了 [[統一標籤治理_Unified_Tag_Governance]] 的核心地位。

## 參考來源
- `12_工作_Dynasafe/06_技術中心/HCI_COE/02_Legacy_Backups/ZTA_COE/`

---
- **編譯時間**：2026-04-09 08:00 (UTC+8)
- **編譯員**：Lumen-OCR (Defense Strategy Mode)
