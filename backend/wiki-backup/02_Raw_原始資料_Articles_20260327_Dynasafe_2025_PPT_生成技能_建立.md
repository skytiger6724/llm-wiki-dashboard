# ---
tags: [Wiki, AI]
date: 2026-04-10
summary: "20260327_Dynasafe_2025_PPT_生成技能_建立"
---

# 20260327_Dynasafe_2025_PPT_生成技能_建立

說真的，要把 PPT 模板的設計語法「抽」出來變成自動化技能，這過程真的很有趣。今天剛完成 [[Dynasafe]] 2025 年度模板的深度分析與技能封裝，感覺以後寫提案簡直要飛起來了！

這是一個里程碑式的進展，我們成功讓 Gemini 學會了 [[Dynasafe]] 的視覺 DNA，以後生成任何簡報都能自帶「紅白配色」與「微軟正黑體」的優雅。

---

## 執行大綱 (Execution Summary)

1. **模板基因分析**：使用 `python-pptx` 深入解析 `Dynasafe_2025_ver_template-OK.pptx`，提取核心佈局 (Layouts)。
2. **技能架構初始化**：建立 `dynasafe-2025-ppt` 專屬目錄，包含 `assets/` 範本與 `SKILL.md` 指令。
3. **指令集撰寫 (Prompting)**：精確映射 2025 版五大核心版型（封面、章節、目錄、內容、結束）。
4. **封裝與輸出**：成功打包為 `dynasafe-2025-ppt.skill` 檔案，輸出至目前的資料夾。

---

## 詳細內容 (Detailed Content)

### 1. 視覺 DNA 提取
老實講，[[Dynasafe]] 2025 的模版結構非常明確，我們成功定義了五個關鍵對應點：
- **首頁 (Layout 0)**：標配公司中英文名稱。
- **章節 (Layout 2)**：議題名稱 + 講者。
- **目錄 (Layout 3)**：固定標題格式 "目錄 Agenda"。
- **內容頁 (Layout 1)**：簡潔的標題加內容。
- **結束頁 (Layout 15)**：大大的 THANK YOU 加上官方網址。

### 2. 技能技能文件 (SKILL.md) 內容
技能文件內建了視覺規範檢核清單，確保生成的每一份 PPT 都只有紅與白，且背景絕對純白，字體絕對微軟正黑體。這種強制的視覺約束能有效避免 AI 產生常見的「審美災難」。

### 3. 使用方式與建議
目前生成的 `.skill` 檔已經存放在 `/Users/dwaynejohnson/dynasafe-2025-ppt.skill`。
安裝命令如下（建議使用 workspace scope）：
```bash
gemini skills install dynasafe-2025-ppt.skill --scope workspace
```text
安裝完畢後，別忘了在互動式界面執行 `/skills reload` 刷新，就能在下次撰寫材料時隨時呼喚這個「PPT 小幫手」了。

說實話，這套系統最棒的地方在於它的擴展性，如果 2026 有新模版，我們只需要更新 `assets/template.pptx` 就行了，超省心。


## 相關連結
- [[提示詞工程_Prompt_Engineering]]
- [[LLM_Wiki_Compiler]]
