# ---
tags: [Wiki, AI]
date: 2026-03-19
summary: "KM 紀錄：ZeroAPI 模型路由 Skill 安裝與配置 (2026 版)"
---

# KM 紀錄：ZeroAPI 模型路由 Skill 安裝與配置 (2026 版)
**時間戳記**：2026-03-19 07:45

## 執行大綱
成功將 `ZeroAPI` 智能路由 Skill 部署至 Gemini 系統，整合 2026 年主流模型（Gemini 3, GPT-5.3, Claude 4.6）的自動調度功能。

## 詳細內容
### 1. 安裝背景
用戶提供了一個外部 Skill 連結，旨在優化多個 AI 模型的訂閱管理。考慮到當前系統日期為 2026 年，我們選擇了最具前瞻性的「高階路由邏輯」進行安裝。

### 2. 核心配置詳解
安裝位置：`/Users/dwaynejohnson/.gemini/skills/zeroapi/SKILL.md`
- **智慧分級**：
  - **極速層**：Gemini 2.5 Flash-Lite
  - **通用層**：Gemini 3 Flash
  - **深度層**：Claude Opus 4.6
  - **專業層**：GPT-5.3 Codex (代碼/邏輯)
- **路由策略**：
  - 自動判斷任務複雜度。
  - 當上下文超過 100k 時，強制切換至 Gemini 3 Pro。
  - 支援全自動的 Fallback 降級處理。

### 3. 操作手冊
- 使用 `/zeroapi status` 查看目前的路由規則。
- 使用 `/zeroapi mode auto` 讓系統接管所有模型的分配權。

### 4. 未來優化建議
老實說，雖然現在的配置很強，但如果未來 Kimi K3 出現，建議把 `ORCHESTRATE` 這一層再做升級，目前先用 K2.5 擋著跑起來也是飛快。


## 相關連結
- [[知識複利系統_Knowledge_Compounding]]
