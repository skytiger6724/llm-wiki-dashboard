#!/bin/bash
# LLM Wiki 質量定期檢查腳本
# 用法：./quality-check.sh
# 建議添加到 crontab：0 9 * * 1 /path/to/quality-check.sh  # 每週一 9:00

BACKEND_DIR="/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app/backend"
TREND_DIR="$BACKEND_DIR/quality"
REPORT_DIR="/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/00_KM_核心知識庫/20_Work_Logs_工作紀錄"
TIMESTAMP=$(date "+%Y-%m-%d-%H%M")
REPORT_FILE="$REPORT_DIR/$TIMESTAMP-Wiki質量定期檢查報告.md"

echo "📊 LLM Wiki 質量定期檢查"
echo "時間: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 1. 記錄質量快照
echo "📝 記錄質量快照..."
cd "$BACKEND_DIR"
node quality/quality-trend-tracker.js 2>&1 | tail -15

# 2. 獲取趨勢
echo ""
echo "📈 質量趨勢..."
curl -s --connect-timeout 10 http://localhost:3001/api/quality-trend 2>/dev/null | python3 -c "
import sys, json
d = json.load(sys.stdin)
t = d.get('trend', {})
c = t.get('current', {})
p = t.get('previous', {})
ch = t.get('change', {})

print(f'當前平均質量: {c.get(\"avgScore\", \"?\")}%')
if ch:
    sign = '+' if ch.get('avgScore', 0) >= 0 else ''
    print(f'較上次變化: {sign}{ch.get(\"avgScore\", 0)}%')
print(f'總節點數: {c.get(\"totalNodes\", \"?\")}')
print(f'需要審核: {c.get(\"needsReview\", \"?\")}')
print()
print('分佈:')
for r, n in c.get('distribution', {}).items():
    total = c.get('totalNodes', 1)
    print(f'  {r}: {n} ({round(n/total*100)}%)')
" 2>/dev/null || echo "⚠️  API 未就緒，跳過趨勢分析"

# 3. 生成報告
echo ""
echo "📝 生成報告..."

cat > "$REPORT_FILE" << REPORT_EOF
# Wiki 質量定期檢查報告

**時間**: $(date '+%Y-%m-%d %H:%M:%S')
**類型**: 自動化質量檢查

---

## 質量摘要

$(curl -s --connect-timeout 10 http://localhost:3001/api/quality-trend 2>/dev/null | python3 -c "
import sys, json
d = json.load(sys.stdin)
t = d.get('trend', {})
c = t.get('current', {})
ch = t.get('change', {})
print(f'- 平均質量: {c.get(\"avgScore\", \"?\")}%')
if ch:
    sign = '+' if ch.get('avgScore', 0) >= 0 else ''
    print(f'- 較上次變化: {sign}{ch.get(\"avgScore\", 0)}%')
print(f'- 總節點: {c.get(\"totalNodes\", \"?\")}')
print(f'- 需要審核: {c.get(\"needsReview\", \"?\")}')
" 2>/dev/null || echo "- API 未就緒")

## 質量分佈

$(curl -s --connect-timeout 10 http://localhost:3001/api/quality-trend 2>/dev/null | python3 -c "
import sys, json
d = json.load(sys.stdin)
c = d.get('trend', {}).get('current', {})
for r, n in c.get('distribution', {}).items():
    total = c.get('totalNodes', 1)
    print(f'- {r}: {n} ({round(n/total*100)}%)')
" 2>/dev/null || echo "- 無數據")

## 建議

- 持續監控質量趨勢
- 優先處理 [Needs Review] 頁面
- 定期運行批量修復工具
- 新頁面必須通過質量門控

---

*本報告由質量趨勢追蹤器自動生成*
REPORT_EOF

echo "✅ 報告已生成: $REPORT_FILE"
echo ""
echo "========================================"
echo "📊 檢查完成"
echo "========================================"
