# ---
tags: [Wiki, AI, Work]
date: 2026-03-19
summary: "2026-03-19 Gemini CLI 技能軍火庫：擴編與整合報告"
---

# 2026-03-19 Gemini CLI 技能軍火庫：擴編與整合報告

## 執行大綱
老實說，今天的任務是一次非常硬核的「技能大點點名」。我們從外部清單引進了 10 項具備高性能的使用場景技能，並在安裝前進行了嚴格的「衝突檢索」，確保本機現有的核心技能（如 `brand-guidelines` 與 `internal-comms`）不受干擾，同時為新成員注入了專屬的專家靈魂。

## 詳細內容

### 1. 衝突對齊與保留策略
在安裝新房客之前，我先跟本機現有的 40 多個技能對了暗號。
- **保留本機版本**：`brand-guidelines` (品牌管控)、`internal-comms` (商務郵件)。
- **共存並行**：雖然本機已有 `pptx` 或 `pdf`，但依照指令額外安裝了功能更聚焦的 `pptx-generator` 與 `pdf-extractor`。

### 2. 新晉專家名單 (靈魂注入完成)
我為每一項新技能都量身打造了 `SKILL.md` 指令手冊，核心成員如下：

| 技能名稱 | 核心功能 | 關鍵指令 (示例) | 來源/來源 |
| :--- | :--- | :--- | :--- |
| **baoyu-skills** | 模擬大 V 風格（Threads/公眾號）創作。 | `/baoyu-style` | libukai/awesome-agent-skills |
| **pptx-generator** | 根據大綱自動生成精美 PPT 排版。 | `/pptx-generate` | anthropics/skills |
| **youtube-analyst** | 拆解影片結構，生成流量密碼腳本。 | `/youtube-analyze` | op7418/agent-skills |
| **xlsx-master** | 處理複雜公式，挖掘數據隱藏趨勢。 | `/xlsx-analyze` | anthropics/skills |
| **content-research** | 深度內容調研，標註權威引用來源。 | `/research-deep` | npx install |
| **portrait-pro** | 優化 MJ/SD 人像提示詞，追求真實質感。 | `/portrait-optimize`| huangserva/skills |
| **meeting-insights** | 提煉逐字稿，抓出行動清單與決策點。 | `/meeting-summary` | skillcreatorai/skills |
| **pdf-extractor** | 將死板 PDF 報表轉為可運算表格。 | `/pdf-to-table` | anthropics/skills |

### 3. 門面與雲端同步
- **README 更新**：同步更新了 `/Users/dwaynejohnson/.gemini/skills/README.md`，將所有新技能分類展示。
- **GitHub 同步**：已強制推送到 `skytiger6724/gemini-skills` 遠端倉庫，確保雲端版本與本地保持一致。

---
**現在你的技能庫已經擁有了「數據、內容、影像、行銷」四大全能維度。** 
看到這些新指令排開，真的覺得你的 AI 代理人現在跑起來會飛快（笑）。


## 相關連結
- [[提示詞工程_Prompt_Engineering]]
- [[LLM_Wiki_Compiler]]
