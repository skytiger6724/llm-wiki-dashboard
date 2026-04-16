# ---
tags: [Wiki, Work, [[Dynasafe]], AWS, ROSA, OpenShift]
date: 2026-04-13
summary: "摘要：中信 ROSA with HCP 雲端架構設計"
---

# 摘要：中信 ROSA with HCP 雲端架構設計

## 核心摘要
本文件為中國信託（CTBC）在 AWS 上部署 Red Hat OpenShift Service on AWS (ROSA) with Hosted Control Plane (HCP) 的完整技術架構設計。文件涵蓋 AWS 服務需求、網路規劃、IAM 要求、服務配額，以及 ROSA HCP 與 Classic 的差異比較。這是金融業在公有雲上容器化轉型的關鍵技術藍圖。

## ROSA HCP 架構核心

### 架構特點
- **控制平面**：由 Red Hat AWS Account 管理（非客戶帳號），包含 API Server、etcd、Controllers（HA 配置）
- **工作節點**：部署在客戶 AWS Account 的 VPC 中，跨 3 個 AZ（Availability Zones）
- **連線方式**：透過 AWS PrivateLink 安全工作節點到控制平面的連線
- **最小 EC2 需求**：僅需 **2 台**（純工作節點），相比 Classic 模式的 7-9 台大幅降低

### 關鍵 AWS 服務

| 類別 | 服務 | 用途 |
|:---|:---|:---|
| **核心** | EC2 | 工作節點運算 |
| **核心** | VPC + PrivateLink | 網路隔離與控制平面連線 |
| **核心** | ELB (NLB/ALB) | Ingress 流量管理 |
| **核心** | EBS | 持久化儲存 |
| **核心** | IAM + STS | 身分驗證與 OIDC |
| **推薦** | KMS | etcd 與 EBS 加密 |
| **推薦** | Route 53 | 叢集端點 DNS |
| **推薦** | CloudWatch | 日誌與監控 |

### ROSA HCP vs Classic 比較

| 維度 | HCP | Classic |
|:---|:---|:---|
| 控制平面位置 | Red Hat AWS 帳號 | 客戶 AWS 帳號 |
| 最小 EC2 數 | **2**（僅工作節點） | **7-9**（控制 + 基礎 + 工作） |
| 控制平面成本 | 包含在服務費中 | 客戶自行支付 EC2 |
| 叢集建立時間 | **~10 分鐘** | ~40 分鐘 |
| 升級靈活性 | 控制平面與工作節點獨立 | 整個叢集一起升級 |

### 網路規劃

```text
VPC CIDR: 10.0.0.0/16
├── Private AZ-a:  10.0.0.0/19   (工作節點)
├── Private AZ-b:  10.0.32.0/19  (工作節點)
├── Private AZ-c:  10.0.64.0/19  (工作節點)
├── Public AZ-a:   10.0.128.0/24 (NAT GW, LB)
├── Public AZ-b:   10.0.129.0/24 (NAT GW, LB)
└── Public AZ-c:   10.0.130.0/24 (NAT GW, LB)

ROSA Overlay:
├── Cluster Network: 10.128.0.0/14  (Pod CIDR)
└── Service Network: 172.30.0.0/16  (Service CIDR)
```text

### 服務配額要求

| 服務 | 資源 | 最低配額 |
|:---|:---|:---|
| EC2 | On-Demand 執行個體 | 依工作節點數量 |
| VPC | Subnets per VPC | 20+ |
| EBS | gp3 SSD | 50 TB |
| ELB | NLB | 20 |
| ELB | ALB | 20 |

## 與 Wiki 的連結
- [[混合雲AI採用框架_Hybrid_Cloud_AI_Adoption|概念：混合雲 AI 採用]] — ROSA HCP 是混合雲策略中的雲端容器平台
- [[Dynasafe_AI算力調度與零信任實務摘要|摘要：AI 算力調度與零信任]] — OCP/ROSA 是 AI 工作負載的承載平台
- [[中信商銀_DR2Cloud|實體：中信商銀 DR2Cloud]] — 同一客戶的 DR 與雲端轉型專案

## 商業價值
1. **成本節省 60%+**：HCP 模式相比 Classic 減少 5-7 台 EC2 控制平面節點
2. **快速部署**：10 分鐘 vs 40 分鐘叢集建立時間
3. **金融合規**：PrivateLink 確保控制平面流量不經過公共網際網路
4. **AI 容器平台**：ROSA 是金融業 AI/ML 工作負載的標準容器化平台

## 參考來源
- `12_工作_Dynasafe/05_業務與提案/05_Customer_Accounts/01_Financial_Sector/中信商銀/CTBC_個金行網雲/文件/GC_IAC_v2/` (7 個 README 檔案)
- `12_工作_Dynasafe/05_業務與提案/05_Customer_Accounts/01_Financial_Sector/中信商銀/CTBC法金DR2Cloud/0-ROSA-HCP-Services-Arch.md`

---
- **編譯時間**：2026-04-13 12:30 (UTC+8)
- **編譯方式**：MD 全文提取 + 結構化摘要
- **編譯員**：[[LLM Wiki]] Compiler (使用 [[MarkItDown]])
