# ---
tags: [Wiki, AI, Tool, Microsoft, Entity]
date: 2026-04-13
summary: "實體：[[MarkItDown]]（微軟開源文件轉換工具）"
---

# 實體：[[MarkItDown]]（微軟開源文件轉換工具）

## 核心定義
[[MarkItDown]] 是微軟（Microsoft）開源的輕量級 Python 工具，專注於將各種二進制文件格式轉換為 Markdown，供 LLM 和文字分析管線使用。是 [[LLM Wiki]] Compiler 知識自動化管線的核心文字提取引擎。

## 關鍵事實
- **開發者**：Microsoft
- **來源**：`github.com/microsoft/markitdown`
- **語言**：Python
- **安裝命令**：`pip install 'markitdown[all]'`
- **API 用法**：
  ```python
  from markitdown import MarkItDown
  md = MarkItDown()
  result = md.convert("file.pdf")
  print(result.text_content)
  ```text
- **CLI 用法**：`markitdown file.pdf -o output.md`

## 支援格式
| 格式 | 說明 |
|:---|:---|
| **PDF** | 有文字層可直接提取，掃描版需 OCR 插件 |
| **DOCX** | Word 文件（含表格、標題、列表結構保留） |
| **PPTX** | PowerPoint 簡報 |
| **XLSX** | Excel 試算表（自動轉為 Markdown 表格） |
| **HTML** | 網頁內容 |
| **CSV/JSON/XML** | 結構化數據 |
| **圖片** | EXIF 元數據 + OCR |
| **音訊** | 元數據 + 語音轉錄 |
| **YouTube URL** | 影片字幕 |
| **EPUB** | 電子書 |
| **ZIP** | 自動解壓縮並迭代處理內部檔案 |

## 特色
- 依賴按功能分組安裝（如 `pip install 'markitdown[pdf,docx,pptx]'`）
- 支援第三方插件（`markitdown-ocr` 提供 PDF/DOCX/PPTX 的 OCR 支援）
- 提供 MCP Server（可與 Claude Desktop 等 LLM 應用程式整合）
- 可透過 Docker 部署
- 輸出格式高度 Token 效率優化，LLM 原生可理解

## 實戰表現
- **成功**：XLSX（前鋒三角、三級單位職掌）、MD 檔案轉換 100% 成功
- **失敗**：掃描版 PDF（Claude_AI_Agent.pdf 13MB，pdftotext 僅提取 15 bytes）
- **解決方法**：掃描版 PDF 需改用 `markitdown-ocr` 插件或 Azure Document Intelligence

## 安裝位置
- 系統 Python 環境（`pip install --break-system-packages 'markitdown[all]'`）
- 依賴套件：mammoth（DOCX）、openpyxl（XLSX）、python-pptx（PPTX）、markdownify（HTML）、speechrecognition（音訊）、youtube-transcript-api 等 32 個依賴

## 關聯節點
- [[知識自動化管線_Knowledge_Automation_Pipeline|概念：知識自動化管線]] — [[MarkItDown]] 是 Stage 2（Thaw）的核心工具
- [[LLM_Wiki_Compiler|實體：[[LLM Wiki]] Compiler]] — 編譯器呼叫 [[MarkItDown]] 進行文件轉換
- [[karpathy-guidelines|Skill：Karpathy Guidelines]] — 確保使用 [[MarkItDown]] 的程式碼品質

## 參考來源
- `https://github.com/microsoft/markitdown`
- 安裝紀錄：`02_Skills_技能優化與指南/2026-04-13-1200-Karpathy-Guidelines部署與MarkItDown整合.md`

---
- **編譯時間**：2026-04-13 12:40 (UTC+8)
- **編譯員**：[[LLM Wiki]] Compiler
