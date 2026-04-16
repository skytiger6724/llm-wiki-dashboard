# ---
tags: [Wiki, AI, Work]
date: 2026-04-08
summary: "時空權重決策 Agent — 開發計畫"
---

# 時空權重決策 Agent — 開發計畫

> 把 AI 的傳統特徵向量與術數的時空參數進行權重疊加，做出一個「會看時空脈動」的決策引擎。

- 版本：1.0（計畫階段）
- 日期：2026-04-08
- 狀態：Planning

---

## 一、核心概念

### 問題陳述

現有 AI 決策系統（推薦引擎、評分模型、分類器）幾乎全部基於「靜態特徵」——使用者的歷史行為、物品的屬性、內容的 embedding。它們假設「過去的模式會延伸到未來」。

但現實不是這樣。

- 同一個人在早上 8 點和晚上 11 點的消費決策完全不同
- 同一個產品在週一和週五的轉化率有系統性差異
- 季節性、節氣、甚至天氣都會影響決策模式

這些都是「時空維度」的訊號，但傳統模型把它們當成 noise 或乾脆忽略。

### 核心思路

把決策拆解成兩層：

```text
最終權重 = α × 傳統特徵向量 + β × 時空參數向量

α + β = 1（動態調整）
```text

**傳統特徵向量**：使用者 embedding、物品特徵、行為歷史 → 這是你們已经在做的。

**時空參數向量**：從時間和空間維度提取的結構化參數，包含：
- 循環特徵（小時、星期、月份、季節）
- 事件特徵（節日、促銷期、特殊事件）
- 術數特徵（天干地支、節氣、五行時段）← 這是差異化所在
- 環境特徵（天氣、地理位置）

---

## 二、系統架構

```text
┌─────────────────────────────────────────────────┐
│                   決策請求                         │
└─────────────────────┬───────────────────────────┘
                      │
         ┌────────────┴────────────┐
         ▼                         ▼
┌─────────────────┐       ┌──────────────────┐
│  傳統特徵引擎    │       │  時空參數引擎     │
│                 │       │                   │
│ • User Embedding│       │ • 循環編碼         │
│ • Item Features │       │ • 事件標記         │
│ • Behavior Hist │       │ • 術數映射         │
│ • Context       │       │ • 環境特徵         │
└────────┬────────┘       └────────┬──────────┘
         │                         │
         ▼                         ▼
┌─────────────────┐       ┌──────────────────┐
│  Feature Score  │       │ SpatioTemporal   │
│  S_feature      │       │ Score S_st       │
└────────┬────────┘       └────────┬──────────┘
         │                         │
         └────────────┬────────────┘
                      ▼
            ┌─────────────────────┐
            │   權重融合層          │
            │                      │
            │ S_final = α·S_f +   │
            │           β·S_st    │
            │                      │
            │ α/β 由情境動態計算    │
            └────────┬────────────┘
                     ▼
            ┌─────────────────────┐
            │   決策輸出            │
            │   (推薦/評分/分類)    │
            └─────────────────────┘
```text

---

## 三、時空參數向量設計

### 3.1 循環特徵（Cyclical Features）

時間是循環的，不是線性的。用 sin/cos 編碼：

```python
import numpy as np

def encode_cyclic(value, period):
    """將循環值編碼為二維向量"""
    return (
        np.sin(2 * np.pi * value / period),
        np.cos(2 * np.pi * value / period)
    )

# 例：小時編碼
hour_sin, hour_cos = encode_cyclic(14, 24)  # 下午 2 點
# → (0.866, -0.5)  在單位圓上唯一映射
```text

提取的循環維度：
- **小時** (period=24)：2 維
- **星期** (period=7)：2 維
- **月份** (period=12)：2 維
- **季節** (period=4)：2 維

小計：8 維

### 3.2 事件特徵（Event Features）

二元標記 + 強度：

| 事件類型 | 維度 | 說明 |
|---------|------|------|
| 節日 | 二元 + one-hot | 春節、聖誕、雙 11... |
| 促銷期 | 二元 + 倒數天數 | 距促銷結束還有 N 天 |
| 發薪日 | 二元 + 前後±3天 | 薪資週期的消費力波動 |
| 學期週期 | 開學/期末/暑假 | 教育相關決策影響 |

小計：~15 維（取決於事件種類）

### 3.3 術數特徵（Metaphysical Features）

這是與傳統模型真正的差異化所在。不是迷信，是把文化中已驗證的「時間模式」結構化。

#### 天干地支時空映射

```python
# 天干（10）→ one-hot 編碼
HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

# 地支（12）→ one-hot 編碼
EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

# 年、月、日、時四柱 → 4 × (10 + 12) = 88 維（sparse）
# 實際使用 embedding 降維到 16 維
```text

#### 二十四節氣

```python
SOLAR_TERMS = [
    '立春', '雨水', '驚蟄', '春分', '清明', '穀雨',
    '立夏', '小滿', '芒種', '夏至', '小暑', '大暑',
    '立秋', '處暑', '白露', '秋分', '寒露', '霜降',
    '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
]
# one-hot 編碼 → 24 維，或用 embedding 降到 8 維
```text

#### 五行時段

傳統術數把一天分為十二時辰，每個時辰對應不同的五行屬性：

| 時辰 | 時間 | 五行 | 行為假設 |
|-----|------|------|---------|
| 子時 | 23:00-01:00 | 水 | 深夜決策偏感性、衝動 |
| 丑時 | 01:00-03:00 | 土 |  inactive |
| 寅時 | 03:00-05:00 | 木 |  inactive |
| 卯時 | 05:00-07:00 | 木 | 早晨決策偏理性 |
| 辰時 | 07:00-09:00 | 土 | 通勤時間、快速決策 |
| 巳時 | 09:00-11:00 | 火 | 工作時段、高認知資源 |
| 午時 | 11:00-13:00 | 火 | 午休、注意力分散 |
| 未時 | 13:00-15:00 | 土 | 午后低谷、需要刺激 |
| 申時 | 15:00-17:00 | 金 | 下午高峰、效率決策 |
| 酉時 | 17:00-19:00 | 金 | 下班、放鬆決策 |
| 戌時 | 19:00-21:00 | 土 | 黃金娛樂時段 |
| 亥時 | 21:00-23:00 | 水 | 夜間、感性消費高峰 |

五行 → one-hot 5 維
時辰 → 12 維
五行×時辰互動 → 5 維

小計：~35 維（經 embedding 壓縮到 16 維）

### 3.4 環境特徵（Environmental Features）

| 特徵 | 維度 | 來源 |
|-----|------|------|
| 天氣 | 3 維（溫度、降雨、季節體感） | Weather API |
| 地理位置 | 2 維（緯度 sin/cos） | User profile |
| 城市等級 | one-hot 3 維 | 一線/二線/其他 |

小計：8 維

### 維度總計

| 模組 | 原始維度 | 壓縮後 |
|-----|---------|--------|
| 循環特徵 | 8 | 8 |
| 事件特徵 | ~15 | 15 |
| 術數特徵 | ~35 | 16 |
| 環境特徵 | 8 | 8 |
| **總計** | **~66** | **47** |

---

## 四、權重融合機制

### 4.1 基礎公式

```text
S_final = α × S_feature + β × S_st
其中 α + β = 1
```text

### 4.2 動態 α/β 計算

α 和 β 不是固定的，而是由「情境確定度」動態計算：

```text
# 情境確定度：歷史行為數據是否足以支撐可靠預測
certainty = f(
    data_volume,      # 用戶歷史數據量
    pattern_strength,  # 行為模式的統計顯著性
    recency           # 最近一次互動的時間
)

α = sigmoid(certainty × temperature)
β = 1 - α
```text

直覺解釋：
- **數據充足、模式明顯** → α 大，相信傳統特徵
- **冷啟動、模式混亂、重大節日** → β 大，依賴時空參數

### 4.3 溫度參數

```text
temperature = 1.0 + γ × event_magnitude

event_magnitude：當前是否有重大事件（雙 11、春節...）
γ：事件敏感度係數（可學習）
```text

重大事件發生時，temperature 上升，α/β 的過渡更陡峭，系統更快速切換到時空模式。

---

## 五、實施路線圖

### Phase 1：基礎建設（MVP）

**目標**：驗證時空參數是否提供額外訊號

- [ ] 實現循環特徵編碼（小時、星期、月份）
- [ ] 實現事件特徵（節日、促銷）
- [ ] 在現有模型中加入時空特徵作為额外輸入
- [ ] A/B 測試：有 vs 沒有時空特徵的模型表現

**成功標準**：時空特徵模型在至少 2 個指標上顯著優於 baseline（p < 0.05）

### Phase 2：術數模組

**目標**：驗證術數特徵的增量價值

- [ ] 實現天干地支、二十四節氣、五行時段編碼
- [ ] 設計術數特徵的 embedding 層
- [ ] 與 Phase 1 模型整合
- [ ] A/B 測試：基礎時空 vs 基礎時空+術數

**成功標準**：術數特徵在特定場景（如節日期間）提供 > 5% 的增量提升

### Phase 3：動態權重融合

**目標**：實現 α/β 動態調整

- [ ] 實現情境確定度函數
- [ ] 實現溫度參數機制
- [ ] 訓練 α/β 預測模型（可以用 meta-learner）
- [ ] 線上 A/B 測試

**成功標準**：動態融合優於固定權重（α=β=0.5）

### Phase 4：生產部署

**目標**：全量上線

- [ ] 效能優化（時空特徵預計算 + 快取）
- [ ] 監控面板（α/β 分佈、時空特徵重要性）
- [ ] 降級策略（時空服務不可用時回退到純特徵模型）
- [ ] 全量發布

---

## 六、技術細節

### 6.1 資料管道

```text
定時任務（每小時）
    │
    ├── 更新循環特徵
    ├── 更新事件特徵
    ├── 計算術數特徵
    └── 寫入 Redis 快取
              │
              ▼
        線上推理時直接讀取
```text

### 6.2 術數計算模組

```python
from datetime import datetime

class SpaceTimeEncoder:
    def __init__(self):
        self.lunar_converter = LunarCalendar()  # 農曆轉換
        self.solar_term_map = self._build_solar_term_map()
    
    def encode(self, timestamp: datetime, location: dict) -> np.ndarray:
        parts = []
        
        # 1. 循環特徵
        parts.append(self._encode_cyclic(timestamp))
        
        # 2. 事件特徵
        parts.append(self._encode_events(timestamp))
        
        # 3. 術數特徵
        parts.append(self._encode_metaphysical(timestamp))
        
        # 4. 環境特徵
        parts.append(self._encode_environment(location))
        
        return np.concatenate(parts)
    
    def _encode_metaphysical(self, dt: datetime) -> np.ndarray:
        """術數特徵編碼"""
        # 天干地支
        stem, branch = self.lunar_converter.to_ganzhi(dt)
        ganzhi = self._one_hot_stem_branch(stem, branch)
        
        # 二十四節氣
        solar_term = self._get_current_solar_term(dt)
        term_vec = self._one_hot_solar_term(solar_term)
        
        # 五行時段
        wuxing = self._get_wuxing_for_hour(dt.hour)
        wuxing_vec = self._one_hot_wuxing(wuxing)
        
        # Embedding 壓縮
        combined = np.concatenate([ganzhi, term_vec, wuxing_vec])
        return self.metaphysical_embedding(combined)
```text

### 6.3 融合層

```python
class WeightFusion:
    def __init__(self, temperature_base=1.0, gamma=0.5):
        self.temperature_base = temperature_base
        self.gamma = gamma
    
    def compute_weights(self, certainty: float, event_magnitude: float):
        temperature = self.temperature_base + self.gamma * event_magnitude
        alpha = self._sigmoid(certainty * temperature)
        beta = 1 - alpha
        return alpha, beta
    
    def fuse(self, s_feature, s_st, certainty, event_magnitude):
        alpha, beta = self.compute_weights(certainty, event_magnitude)
        return alpha * s_feature + beta * s_st
```text

---

## 七、風險與緩解

| 風險 | 影響 | 緩解 |
|-----|------|------|
| 術數特徵被視為不科學 | 團隊/外部信任問題 | 用數據說話——A/B 測試證明增量價值 |
| 特徵維度過高導致過擬合 | 模型效能下降 | Embedding 壓縮 + 正則化 |
| 線上推理延遲增加 | 使用者體驗 | 預計算 + Redis 快取 |
| α/β 不穩定 | 決策震盪 | 加入平滑項（移動平均） |

---

## 八、評估指標

### 主要指標

- **CTR / CVR**：點擊率 / 轉化率提升
- **NDCG@K**：排序質量
- **AUC**：分類能力

### 診斷指標

- **α/β 分佈**：確認系統在適當地切換模式
- **時空特徵重要性**：SHAP values 確認哪些時空維度真正有用
- **情境分層效果**：在不同時段/事件下的效果差異

---

## 九、為什麼這件事情值得做

說真的，市面上沒人把「術數」當成 ML 特徵。不是因為它沒用，是因為沒有人認真做過結構化。

這件事情的 bottom line 很簡單：

- 如果術數特徵在 A/B 測試中沒有顯著效果 → 砍掉，損失很小
- 如果有效果 → 你就有了一個別人抄不走的差異化優勢

風險不對稱，下行有限，上行可能很大。這就是為什麼值得做。

---

*這份計畫是起點。每個 Phase 完成後，根據數據結果決定 Go / No-Go / Pivot。*
