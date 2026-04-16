# ---
title: 極簡筆記工作項目摘要
type: summary
tags: [Nvidia, Run-ai, Gang Scheduling, AI Factory, 混合雲]
created: 2026-04-08
updated: 2026-04-08
sources: [02_Raw_原始資料/Articles/極簡筆記/筆記/]
---

# 摘要：極簡筆記工作項目

## 核心摘要
極簡筆記工作項目涵蓋Nvidia網路分析(ConnectX/BlueField系列網卡)、Run-ai Gang Scheduling(全有或全無資源調度)、AI Factory架構、混合雲AI數據中心技術、數位韌性架構等。核心洞察：NVIDIA透過ConnectX-8(800G)+BlueField-3 DPU構建AI工廠，Run-ai的Gang Scheduling解決分布式訓練資源碎片化問題。

## 關鍵概念
- *Gang_Scheduling*: Run-ai核心機制，全有或全無(All-or-Nothing)分配邏輯
- *NVIDIA網卡系列*: ConnectX-7(400G NDR)、ConnectX-8(800G X800)、BlueField-3 DPU
- [[AI工廠_AI_Factory|AI Factory Architecture]]: 結合GPU+高速網路+DPU的算力工廠設計
- [[混合雲AI採用框架_Hybrid_Cloud_AI_Adoption|Hybrid Cloud AI DC]]: 地端+雲端混合部署的AI基礎架構

## 關鍵實體
- *Run-ai*: AI工作負載管理與調度平台，解決K8s原生調度不足
- *ConnectX-8*: [[NVIDIA]] 2024-2025最新一代800G網卡
- *BlueField-3*: 卸載安全/儲存/管理任務的數據處理單元

## 文件清單 (部分)
- Nvidia 網路分析 (59行深度分析)
- Gang Scheduling (Run-ai核心機制)
- AI Factory / AI工廠
- Run-ai 混合部署模式
- 混合云AI数据中心技术详解
- 數位韌性架構設計與實施藍圖

## 參考來源
- [極簡筆記/筆記目錄](../../02_Raw_原始資料/Articles/極簡筆記/筆記/)
