# ---
title: NSX on ACI 混合架構
type: concept
tags: [NSX, ACI, 微分段, 軟體定義網路, 混合雲, 雙重封裝]
created: 2026-04-09
updated: 2026-04-09
sources: [12_工作_Dynasafe/NSX_on_ACI_白皮書.md]
---

# 概念：NSX on ACI 混合架構

## 核心定義
將 VMware NSX (Overlay) 部署於 Cisco ACI (Underlay) 之上的混合 SDN 架構。ACI 提供 Spine-Leaf 骨幹，NSX 提供微分段與分散式防火牆。

## 關鍵事實
- **雙重 VXLAN 封裝**: NSX overlay 封裝 + ACI underlay 封裝，需關注 MTU 設定
- **L3Out 邊界設計**: ACI Border Leaf 建立 Transit VLAN，External EPG 路由至 NSX Edge
- **EPG 映射原則**: 一個 NSX 分段對應一組 ACI EPG + BD，避免多對多關聯
- **適用情境**: 以虛擬化/安全為核心 → NSX 為主；以網路整合為主 → ACI 為主
- **核心挑戰**: 可視性喪失 (ACI 看不到 overlay 內部)、雙平台維運複雜、錯誤診斷需兩邊協調
- **組織影響**: 需統一網路團隊與虛擬化團隊的管理流程與職責

## 參考來源
- [[Dynasafe工作文件核心摘要|摘要：[[Dynasafe]] 工作文件]]
- [NSX on ACI 白皮書.md](12_工作_Dynasafe/06_技術中心/.../NSX_on_ACI_部署建議白皮書.md)

## 關聯概念
- [[零信任架構實務_Zero_Trust_Practice]]（微分段是零信任實踐）
- [[微分割與API安全_Microsegmentation_API]]
- [[統一標籤治理_Unified_Tag_Governance]]
