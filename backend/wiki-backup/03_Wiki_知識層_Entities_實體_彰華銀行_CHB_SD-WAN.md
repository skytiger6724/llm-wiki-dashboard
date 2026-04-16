# ---
tags: [Wiki, Work]
date: 2026-04-06
summary: "彰華銀行_CHB_SD-WAN — 彰銀 SD-WAN 專案與事件"
---

# 彰華銀行_CHB_SD-WAN — 彰銀 SD-WAN 專案與事件

## 核心定義
彰華銀行（CHB）的 SD-WAN 專案，使用 Cisco ENCS 平台。2026 年 4 月遭遇 P1 等級緊急事件，root cause 為 Cisco bug CSCwj73091。

## 關鍵事實
- **P1 事件**：ENCS register value 異常導致服務中斷
- **修復方案**：4/2 建立清除 script 並手動執行
- **4/10 二次事件**：重啟 20 間分行 ENCS，霧峰/苗栗兩分行故障（疑非正常關機流程）
- **霧峰**：已更換備品
- **苗栗**：4/11 早 7 點到場，需從北部送備品
- **架構推進**：與業務協調往增購 Router 修改架構方向推進
- 相關 bug：[CSCwj73091](https://bst.cloudapps.cisco.com/bugsearch/bug/CSCwj73091)

## 參考來源
- [[雲端智能部主管報告摘要_20260406_0417]] — 2026-04-06 與 04-17 主管報告

*建立日期：2026-04-10*
