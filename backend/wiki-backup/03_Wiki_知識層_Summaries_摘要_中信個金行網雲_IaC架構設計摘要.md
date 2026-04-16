# ---
tags: [Wiki, Work, [[Dynasafe]], IaC, AWS, CTBC]
date: 2026-04-13
summary: "摘要：中信個金行網雲 IaC 架構設計 (GC_IAC_v2)"
---

# 摘要：中信個金行網雲 IaC 架構設計 (GC_IAC_v2)

## 核心摘要
本摘要整合了中國信託「個人金融行動網雲端建置案」的 Infrastructure as Code (IaC) 專案架構文件。該專案使用模組化的 IaC 設計，將雲端基礎設施分為 **7 個獨立模組**，涵蓋安全、網路、AI、資料庫、身分驗證、運算與堡壘機。這代表了金融業雲端轉型的現代化部署最佳實踐。

## IaC 模組架構

| 模組 | 目錄 | 核心職責 |
|:---|:---|:---|
| **000-security** | 安全層 | 安全群組、WAF、加密策略、合規檢查 |
| **001-network** | 網路層 | VPC、Subnet、Route Table、NAT Gateway、Transit Gateway |
| **002-ai** | AI 層 | SageMaker / Bedrock 整合、ML Pipeline、模型部署 |
| **003-database** | 資料庫層 | RDS/Aurora、備援策略、讀取副本、加密 |
| **004-auth** | 身分驗證層 | IAM Roles、OIDC、AD Connector、MFA 整合 |
| **005-ecs** | 運算層 | ECS 叢集、Task Definition、Auto Scaling、Load Balancer |
| **006-bastion** | 堡壘機層 | SSM Session Manager、存取控制、稽核日誌 |

## 架構設計原則

1. **模組化**：每個模組獨立部署，可單獨測試與回滾
2. **最小權限**：每個模組僅申請所需的 IAM 權限
3. **安全預設**：所有資源預設加密、私有 Subnet、無 Public IP
4. **合規優先**：符合金融監督管理委員會的雲端服務規範

## 部署流程

```text
terraform init → terraform plan → terraform apply
    ↓
000-security → 001-network → 004-auth → 003-database → 005-ecs → 002-ai → 006-bastion
```text

## 與 Wiki 的連結
- [[中信_ROSA_HCP雲端架構設計摘要|摘要：中信 ROSA HCP 雲端架構]] — 同一客戶的容器化平台，IaC 是基礎設施層
- [[混合雲AI採用框架_Hybrid_Cloud_AI_Adoption|概念：混合雲 AI 採用]] — IaC 是混合雲部署的自動化工具
- [[Dynasafe_AI算力調度與零信任實務摘要|摘要：AI 算力調度與零信任]] — 002-ai 模組承載 AI 工作負載

## 商業價值
1. **部署時間從週縮短到小時**：IaC 模組化設計讓新環境部署從手動 1-2 週縮短到數小時
2. **合規自動化**：安全模組 (000-security) 內建金融合規檢查清單
3. **可複製到客戶**：此 IaC 框架可封裝為「金融業雲端建置參考架構」產品

## 參考來源
- `12_工作_Dynasafe/05_業務與提案/05_Customer_Accounts/01_Financial_Sector/中信商銀/CTBC_個金行網雲/文件/GC_IAC_v2/` (7 個 README 檔案)

---
- **編譯時間**：2026-04-13 12:30 (UTC+8)
- **編譯方式**：MD 全文提取 + 結構化摘要
- **編譯員**：[[LLM Wiki]] Compiler
