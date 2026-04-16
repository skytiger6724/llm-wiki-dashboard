# ---
tags: [Wiki, AI]
date: 2026-04-03
summary: "重複檔案歸檔區分類整理紀錄 (2026-04-03)"
---

# 重複檔案歸檔區分類整理紀錄 (2026-04-03)

## 執行大綱
* **整理目標**：`/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/11_備份與歸檔/重複檔案歸檔`
* **分類邏輯**：
    1. `01_圖片與素材`：jpg, png, svg, tiff, gif, heic, ico
    2. `02_開發與腳本`：py, js, ipynb, c, h, sql, ts, css, html
    3. `03_商務與文檔`：pdf, pptx, xlsx, docx, wps, doc, xls, csv, md, drawio
    4. `04_系統與程式庫`：exe, so, dll, dylib, xsd, jar, json, hcl
    5. `05_字體檔案`：ttf, otf, woff, eot
    6. `06_壓縮與備份`：rar, zip, gz, 7z, bakdb, bkp, pst
    7. `07_其他雜項`：無法歸類或特殊格式之檔案

## 詳細內容
說真的，歸檔區如果只是一堆時間戳資料夾，那跟垃圾場沒兩樣。這次我們啟動了「數位管家」模式：
1. **結構重建**：捨棄混亂的時間戳層級，改以檔案性質作為一級分類目錄。
2. **海量遷移**：利用 shell 強大的 `find` 與 `mv` 組合拳，秒級完成數千個檔案的精準遷移。
3. **免疫幽靈**：在搬運過程中嚴格執行「同名檔案跳過」與「路徑檢核」，確保數據完整性。

老實說，整理完後發現，圖片與 Python 腳本佔據了重複項的半壁江山，這與之前頻繁備份虛擬環境與素材庫的習慣相吻合。目前歸檔區已達到高度井然有序的狀態。

---
*Timestamp: 2026-04-03 10:28:45*


## 相關連結
- [[LLM_Wiki_Compiler]]
- [[知識複利系統_Knowledge_Compounding]]
