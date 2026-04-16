# ---
tags: [Wiki, Work, Finance]
date: 2026-04-08
summary: "金融客戶零信任安全架構摘要"
---

# 金融客戶零信任安全架構摘要

> 建立時間：2026-04-08 12:45
> 主題編號：FIN-ZTA-003

## 核心摘要

金管會頒佈「金融業導入零信任架構參考指引」，以 NIST SP 800-207 ZTA 為參考框架、CISA ZTMM 2.0 為成熟度盤點工具，並要求六大高風險場域先行施行。Zentera 提供三位一體的零信任平台：SDP/Micro-Segmentation + ZTNA + Central PDP Orchestration。核心優勢是不需變更企業原有網路架構與設定，即可實現微分段與軟體定義邊界防護。

## 關鍵概念

- NIST SP 800-207 [[Zero Trust]] Architecture：零信任架構國家標準
- CISA ZTMM 2.0：五大支柱、四個階段、三個層面的成熟度模型
- PDP（Policy Decision Point）/ PEP（Policy Enforcement Point）：核心管控引擎
- Micro-Segmentation（微分段）：東西向、南北向網路隔離
- SDP（Software Defined Perimeter）：軟體定義邊界
- ZTNA（[[Zero Trust]] Network Access）：零信任網路存取
- 六大高風險場域先行：風險導向的逐步導入策略
- 單一 ZTNA 或單一 Micro-Segmentation 產品面臨整合挑戰，需要三位一體平台
- 每此存取皆須持續監控與驗證，不限內外網邊界

## 關鍵實體

- Zentera Systems（總部位於 Milpitas, CA，2012 年創立，12 項網路安全專利）
- NIST SP 800-207
- CISA [[Zero Trust]] Maturity Model 2.0
- 金管會「金融業導入零信任架構參考指引」
- 台新金控（2024-08-29 簡報）
- Dr. Chase Cunningham（Dr. [[Zero Trust]]，市場零信任專家）
- PCI-DSS v4.0 / v4.0.1（支付卡產業資料安全標準）
- Splunk SOAR（安全編排自動化與回應）

## 參考來源

- Zentera_金融業導入零信任方案介紹_台新金控 2024-08-29.pdf
- PCI-DSS_V4-0_to_V4-0-1_Summary-of-Changes.pdf（台新金 ZTA 專案）
- Splunk SOAR Solution.pdf（台新金 ZTA 專案）


## 相關連結
- [[混合雲AI採用框架_Hybrid_Cloud_AI_Adoption]]
- [[金融客戶雲端遷移與混合雲架構摘要]]

---
*自動領養：Gemini-CLI v11.0*
