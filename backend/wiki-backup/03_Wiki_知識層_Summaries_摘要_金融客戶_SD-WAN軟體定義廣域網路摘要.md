# ---
tags: [Wiki, Finance]
date: 2026-04-08
summary: "金融客戶 SD-WAN 軟體定義廣域網路摘要"
---

# 金融客戶 SD-WAN 軟體定義廣域網路摘要

> 建立時間：2026-04-08 12:45
> 主題編號：FIN-SDWAN-002

## 核心摘要

SD-WAN 是金融業優化分支機構網路連線的關鍵技術。透過 Cisco SD-WAN 方案，大型銀行（如 212 家分行的案例）可實現線路費用下降 37%、維運時間降低 80%、維運人員減少 50%。核心架構包含總行 Catalyst 8500 + 分行 ENCS 5412，支援端到端 SLA 監控、SASE 整合、ThousandEyes 端對端可視性。導入成敗三大關鍵：高層支持、完善的 PoC 驗證、以及標準化 SOP。

## 關鍵概念

- SD-WAN 核心元件：vManage（管理）、vSmart（控制）、vBond（編排）、WAN Edge（數據面）
- 集中式政策 vs 本地化政策：路由、QoS、應用感知路由
- TLOC（Transport Locator）：SD-WAN 傳輸層識別碼
- Zero Touch Provisioning (ZTP)：設備開箱即用自動化部署
- Plug and Play (PnP)：Cisco 設備自動上線機制
- SASE 整合：SD-WAN + 雲端安全服務，分行即具備五大防護
- End-to-End SLA：透過 ThousandEyes 實現端到端服務品質監控
- 雙路由器 / TLOC 延伸 / VRRP：高可用分支架構
- IOS XE SD-WAN：新一代 SD-WAN 設備，具備硬體加密、傳輸優化晶片、容器平台
- 導入成敗因素：高層支持、PoC 驗證、標準化 SOP、中轉平台設計

## 關鍵實體

- Cisco SD-WAN（原 Viptela）
- Catalyst 8500（總行核心路由器）
- ENCS 5412（分行企業網路計算系統）
- vManage / vSmart / vBond 控制器
- ThousandEyes（端到端網路可視性）
- SASE（Secure Access Service Edge）
- OSPF / VRRP / BGP（路由協定）
- 中信商銀 212 家分行 SD-WAN 案例
- VMware SD-WAN（Velocloud）、Fortinet SD-WAN（競爭對手）

## 參考來源

- Cisco SD-WAN End-to-End Deployment Guide v18.3.5/16.9.4
- 20230428 CTBC SD-WAN Reference Sharing（Messi Lu）
- SDWAN_compares.pdf（競爭對手比較）
- Cisco_ACI_微分段.md（玉山銀行 ACI 相關）
- 落地簡報部分_V02_備忘稿.txt（ESUN ACI 網路趨勢分享）


## 相關連結
- [[金融客戶雲端遷移與混合雲架構摘要]]
- [[知識TCO_Knowledge_TCO]]

---
*自動領養：Gemini-CLI v11.0*
