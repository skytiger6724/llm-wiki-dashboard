# ---
title: AI工廠 (AI Factory)
type: concept
tags: [AI工廠, [[NVIDIA]], 數據中心, 網路架構]
created: 2026-04-07
updated: 2026-04-07
sources: [02_Raw_原始資料/Articles/20260318_NVIDIA_AI_Networking_Analysis.md]
---

# 概念：AI工廠 (AI Factory)

## 核心定義
AI工廠是NVIDIA提出的新一代數據中心架構理念。在AI時代，整個數據中心就是一台電腦，網路效能直接決定GPU算力的有效利用率。傳統乙太網面對AI突發流量時會導致嚴重GPU閒置，需要專用AI網路架構。

## 關鍵事實
- **網路即計算**: 大模型時代網路不再是連接工具，而是計算的一部分
- **Spectrum-X革命**: 自適應路由+SuperNIC將頻寬利用率從60%提升至95%
- **InfiniBand霸主地位**: 緊耦合訓練任務依然依賴IB的超低延遲
- **SHARP技術**: 在交換機端完成數據聚合，減輕GPU通信負擔
- **落地建議**: 網路預算應與算力預算同步考慮，優先支持RDMA和RoCE v2

## 參考來源
- [[Articles技術分析與市場趨勢摘要|摘要：Articles技術分析與市場趨勢]]
- [20260318_NVIDIA_AI_Networking_Analysis.md](../../02_Raw_原始資料/Articles/20260318_NVIDIA_AI_Networking_Analysis.md)

## 關聯概念
- [[混合雲AI算力調度_Hybrid_AI_Orchestration]]
- [[知識複利系統_Knowledge_Compounding]]
- [[工業AI大腦_Industrial_AI_Brain]]
