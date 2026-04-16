# ---
tags: [Wiki, AI, Work]
date: 2026-04-10
summary: "20260327_Dynasafe_2025_PPT_報表生成_Gemini技能清單"
---

# 20260327_Dynasafe_2025_PPT_報表生成_Gemini技能清單

說真的，看著 134 個技能從一堆 Markdown 文字，變成一份紅白分明、版型工整的 [[Dynasafe]] 專業簡報，那種成就感真的沒話說。這證明了我們剛才封裝的 `dynasafe-2025-ppt` 技能跑起來真的飛快且穩定！

這次任務展示了「內容 -> 結構 -> 視覺」的自動化轉化流程，以後寫任何報告真的都只要動動嘴就行了。

---

## 執行大綱 (Execution Summary)

1. **內容解析**：從 `17_Gemini_CLI_工具箱/20260324_Gemini_CLI_全技能完整清單.md` 提取 8 大核心分類與代表性技能。
2. **視覺映射**：調用 `dynasafe-2025-ppt` 技能，將內容精確映射至 2025 版佈局（首頁、章節、目錄、內容、結束）。
3. **自動化生成**：編寫 Python 腳本調用 `python-pptx` 並載入公司範本 `template.pptx` 完成生成。
4. **輸出歸檔**：成功產出 `Dynasafe_Gemini_Skills_Report.pptx` 並保存於 `/Users/dwaynejohnson/`。

---

## 詳細內容 (Detailed Content)

### 1. 簡報結構設計
為了不讓 134 個技能顯得雜亂，我採取了「精華提取」策略：
- **封面**：使用 Layout 0，標註「134 位專家隨時待命」。
- **目錄**：使用 Layout 3，清晰列出 8 大戰略板塊。
- **章節與內容**：針對「開發」、「AI」、「行銷」、「辦公工具」四大板塊建立章節頁 (Layout 2) 與詳情頁 (Layout 1)。
- **結尾**：使用 Layout 15，展現公司專業形象。

### 2. 技術實現亮點
- **配色與字體**：全程嚴格鎖定紅白配色與微軟正黑體，完全去除 AI 生成常見的隨機排版感。
- **佈局一致性**：利用自定義技能的映射邏輯，確保每一頁的標題與內容佔位符都分毫不差。

### 3. 產出位置
- **PPTX 檔案**：`/Users/dwaynejohnson/Dynasafe_Gemini_Skills_Report.pptx`
- **生成腳本**：`/Users/dwaynejohnson/generate_dynasafe_report.py` (可重複使用)

老實講，這種「技能化」的工作方式真的能極大提升產出的一致性。下次如果你有其他的 Markdown 清單想轉成 PPT，直接呼喚我，一分鐘內就搞定！


## 相關連結
- [[提示詞工程_Prompt_Engineering]]
- [[LLM_Wiki_Compiler]]
