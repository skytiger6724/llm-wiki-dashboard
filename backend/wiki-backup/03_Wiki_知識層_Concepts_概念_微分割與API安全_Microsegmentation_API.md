# ---
tags: [Wiki, AI, Work]
date: 2026-04-09
summary: "核心概念：微分割與 API 安全 (Microsegmentation & API Security)"
---

# 核心概念：微分割與 API 安全 (Microsegmentation & API Security)

## 核心定義
這是在零信任架構中，針對「數據中心內部通訊」與「應用接口」進行極細粒度控制的技術組合。它將整體的安全壓力分解為無數個可控的小單元。

## 關鍵技術路徑
1. **微分割 (Micro-segmentation)**：
    - **邏輯**：基於虛擬機或容器標籤定義安全組。
    - **優勢**：安全規則跟隨工作負載遷移，不隨 IP 改變。
2. **API 安全治理**：
    - **邏輯**：監控 API 的調用頻率、參數異常與身分授權。
    - **重點**：識別「影子 API (Shadow APIs)」與「殭屍 API」。

## AI 映射：細粒度特徵對齊
- **微分割 = 參數遮罩 (Parameter Masking)**：限制不同模塊間的資訊流轉，只允許最小必要數據通過。
- **API 監控 = 邊界審計**：監控 Agent 調用外部 Tool 的接口安全性。

## 與 Wiki 的連結
- [[統一標籤治理_Unified_Tag_Governance]]：微分割的基礎。
- [[數據煉金術：全流程優化SOP]]：API 安全是煉金過程中「防止能量（數據）外洩」的管道加固。

---
- **編譯時間：2026-04-09 08:10 (UTC+8)**
- **編譯員：[[LLM_Wiki|LLM Wiki]] Compiler**
