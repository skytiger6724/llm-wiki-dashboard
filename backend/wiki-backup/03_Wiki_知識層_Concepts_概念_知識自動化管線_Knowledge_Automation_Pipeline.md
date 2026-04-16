# ---
tags: [Wiki, AI, Automation, [[MarkItDown]], LLM]
date: 2026-04-13
summary: "核心概念：知識自動化管線 (Knowledge Automation Pipeline)"
---

# 核心概念：知識自動化管線 (Knowledge Automation Pipeline)

## 核心定義
知識自動化管線是一套將「死資料」（PDF、DOCX、XLSX、PPTX 等二進制檔案）自動轉換為「活知識」（結構化 Markdown 摘要 → Wiki 知識節點 → 跨域連結網絡）的端到端流程。這條管線是 [[LLM Wiki]] Compiler 的核心能力，也是企業知識管理 SaaS 的技術基礎。

## 管線架構（五階段）

```text
原始文件          文字提取         結構化摘要        知識編譯         網絡連結
(Freeze)    →    (Thaw)     →    (Distill)   →    (Compile)   →    (Connect)
─────────       ─────────        ─────────       ─────────       ─────────
PDF/DOCX         MarkItDown       核心摘要        Entity 提取     [[Wikilink]]
XLSX/PPTX        pdftotext       關鍵概念        Concept 提取    跨域映射
MD/TXT/JSON      直接讀取        實體清單        增量更新       健康度檢查
                                 參考來源        Index/Log      死連結修復
```text

### Stage 1: Freeze（原始文件）
- **來源**：[[Dynasafe]] 工作區（11,408 檔案）、神秘學書籍（1,801 檔案）、KM 核心知識庫
- **格式**：PDF、DOCX、XLSX、PPTX、MD、JSON、CSV
- **挑戰**：掃描版 PDF 無文字層、XLSX 結構不一致、PPTX 圖文混雜

### Stage 2: Thaw（文字提取）
- **工具鏈**：[[MarkItDown]]（MD/XLSX/DOCX）、pdftotext（文字層 PDF）
- **OCR 備援**：掃描版 PDF 需 Azure Document Intelligence 或 LLM Vision
- **輸出**：純文本 Markdown

### Stage 3: Distill（結構化摘要）
- **格式**：核心摘要 + 關鍵概念 + 關鍵實體 + 參考來源
- **標準**：每份摘要必須包含可被 AI 檢索的結構化元數據
- **位置**：`03_Wiki_知識層/Summaries_摘要/`

### Stage 4: Compile（知識編譯）
- **Entity 提取**：從摘要中識別具體的人、事、物 → 建立/更新 Entities
- **Concept 提取**：從摘要中識別抽象概念、框架、方法 → 建立/更新 Concepts
- **增量更新**：已存在的節點進行增量寫入，避免重複
- **位置**：`Entities_實體/`、`Concepts_概念/`

### Stage 5: Connect（網絡連結）
- **Wikilink**：摘要中的關鍵詞自動轉為 `[[概念名稱|顯示名稱]]` 雙向連結
- **跨域映射**：不同集群的概念進行映射（如：塔羅 × Embedding、奇門 × Multi-Agent）
- **健康度檢查**：死連結掃描、孤立節點識別、連結密度分析

## 性能指標

| 指標 | 當前值 | 目標值 | 說明 |
|:---|:---:|:---:|:---|
| 單檔處理時間 | ~30 秒 | <10 秒 | [[MarkItDown]] + LLM 摘要 |
| OCR 處理時間 | ~5 分鐘/頁 | <30 秒/頁 | 需優化 |
| 摘要結構化率 | 95% | 100% | 必填欄位完整性 |
| 連結自動生成率 | 60% | 90% | AI 識別可連結關鍵詞 |
| 死連結率 | 0.0%（v11.0 修復後） | <1% | 持續監控 |

## 工具鏈

| 工具 | 功能 | 安裝位置 |
|:---|:---|:---|
| **[[MarkItDown]]** | PDF/DOCX/XLSX/PPTX → MD | `pip install markitdown[all]` |
| **pdftotext** | 文字層 PDF 提取 | macOS Homebrew (`poppler`) |
| **[[LLM Wiki]] Compiler** | 摘要生成 + 知識編譯 | `.qwen/skills/llm-wiki-compiler/` |
| **Karpathy Guidelines** | 編碼行為準則（確保管線程式碼品質） | `.qwen/skills/karpathy-guidelines/` |

## AI 映射：企業級知識自動化平台

這條管線本身就是一個**可產品化的 SaaS 核心引擎**：
- **產品名**：Knowledge Automation Platform（知識自動化平台）
- **目標客戶**：SI/SI 公司、技術顧問公司、金融業 KM 團隊
- **定價**：$50K-200K TWD/年（按文件量分級）
- **競爭壁壘**：已有 245 節點的知識網絡 + 統一場論 + 跨域映射方法論

## 與 Wiki 的連結
- [[LLM_Wiki_Compiler|實體：[[LLM Wiki]] Compiler]] — 管線的執行引擎
- [[知識複利系統_Knowledge_Compounding|概念：知識複利系統]] — 管線的最終目的
- [[MarkItDown|實體：MarkItDown]] — 文字提取的核心工具
- [[karpathy-guidelines|Skill：Karpathy Guidelines]] — 管線程式碼的品質保障

## 商業洞察
1. **管線本身就是產品**：[[MarkItDown]] + LLM Compiler + Wiki 網絡 = 完整的企業知識自動化解決方案
2. **OCR 是最大瓶頸**：~1,000 個掃描版 PDF 擋住了管線的自動化，解決 OCR 就能釋放海量知識
3. **從內部工具到外部產品**：[[Dynasafe]] 11,408 檔案的處理經驗就是最好的銷售案例

## 參考來源
- `02_Raw_原始資料/Papers/AI/Claude_AI_Agent.pdf`（待 OCR）
- `21_LLM_Wiki_核心知識庫/01_System_系統層/Index.md`
- `21_LLM_Wiki_核心知識庫/01_System_系統層/Log.md`
- [[2026全域知識複利戰略報告_v14.0_全光譜統合篇|戰略：全光譜統合 v14.0]]

---
- **編譯時間**：2026-04-13 12:35 (UTC+8)
- **編譯員**：[[LLM Wiki]] Compiler
