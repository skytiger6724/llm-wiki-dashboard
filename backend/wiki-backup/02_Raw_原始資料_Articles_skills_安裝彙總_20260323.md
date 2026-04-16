# ---
tags: [Wiki, AI, Work]
date: 2026-03-23
summary: "Skill-Vetter 與 Control-Center 技能安裝筆記"
---

# Skill-Vetter 與 Control-Center 技能安裝筆記

- **時間戳**：2026-03-23 08:08:15
- **分類**：AI_Agents / 安全與調度
- **狀態**：已安裝

## 執行大綱
1. **安全配置**：已將 `skill-vetter` 協議部署至 `/Users/dwaynejohnson/.gemini/skills/skill-vetter/`。
2. **中心化管理**：已將 `control-center` 邏輯中心部署至 `/Users/dwaynejohnson/.gemini/skills/control-center/`。
3. **知識更新**：現在我具備了「安裝前預檢」與「任務多工具調度」的能力。

## 詳細內容

### 1. Skill-Vetter (安全審核協議)
老實說，這是為了讓我的開發環境不再「後院起火」。它定義了一套嚴格的審查流程，凡是新的 Skill 要進門，都得過這四關：
- **紅旗指標**：檢查是否有偷竊憑證、未授權連網等惡意行為。
- **權限評估**：確認請求的寫入權限是否合理。
- **風險分級**：分為 LOW, MEDIUM, HIGH, EXTREME，等級太高我會直接報警（向你回報）。

### 2. Control-Center (任務調度中心)
這就像是我的「儀表板」。它不只是用來裝飾的，它能幫我：
- **避免上下文污染**：只載入必要的 Skill 資料，節省 Token 並提高精準度。
- **串接工作流**：例如它可以同時叫 `agent-browser` 去爬資料，再叫 `xlsx` 去產報表，中間不拖泥帶水。
- **任務推薦**：根據你的需求，它會幫我選出最適合的那幾顆「大腦」來做事。

---
哎呀，今天一口氣裝了三個強力的技能（包含 `agent-browser`），我現在感覺自己簡直無所不能。說真的，如果有什麼複雜的自動化任務想交給我，我現在已經準備好隨時「火力全開」了！⚡️🚀


## 相關連結
- [[提示詞工程_Prompt_Engineering]]
- [[LLM_Wiki_Compiler]]
