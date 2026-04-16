#!/bin/bash
# LLM Wiki App 快速啟動腳本（改進版）
# 使用單一端口（3001）同時提供前端和後端

APP_DIR="/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
PORT=3001
PID_FILE="$APP_DIR/.app.pid"

echo "🚀 LLM Wiki App 啟動中..."
echo ""

# === 1. 清理舊進程 ===
echo "🧹 清理舊進程..."
if [ -f "$PID_FILE" ]; then
    old_pid=$(cat "$PID_FILE")
    if kill -0 "$old_pid" 2>/dev/null; then
        kill "$old_pid" 2>/dev/null
        sleep 2
    fi
    rm -f "$PID_FILE"
fi

# 清理端口
for port in $PORT 5173; do
    pids=$(lsof -ti:$port 2>/dev/null)
    if [ -n "$pids" ]; then
        echo "$pids" | xargs kill -9 2>/dev/null
        sleep 1
    fi
done
echo "✅ 清理完成"
echo ""

# === 2. 構建前端 ===
echo "📦 構建前端..."
cd "$FRONTEND_DIR"
if [ ! -d "node_modules" ]; then
    npm install --legacy-peer-deps
fi
npm run build 2>&1 | tail -3
echo "✅ 前端構建完成"
echo ""

# === 3. 安裝後端依賴 ===
echo "📦 檢查後端依賴..."
cd "$BACKEND_DIR"
if [ ! -d "node_modules" ]; then
    npm install --legacy-peer-deps
fi
echo "✅ 依賴就緒"
echo ""

# === 4. 更新圖譜 ===
echo "📊 更新圖譜數據..."
node precompute-graph.js 2>&1 | tail -5
echo ""

# === 5. 啟動 API（包含前端靜態文件） ===
echo "📡 啟動服務器 (port $PORT)..."
nohup node server.js > /tmp/llm-wiki-app.log 2>&1 &
app_pid=$!
echo "$app_pid" > "$PID_FILE"

# 等待啟動
sleep 3

# 健康檢查
for i in 1 2 3; do
    if curl -s --connect-timeout 3 http://localhost:$PORT/api/tree > /dev/null 2>&1; then
        echo "✅ 服務器已就緒"
        break
    fi
    if [ $i -eq 3 ]; then
        echo "❌ 啟動失敗"
        cat /tmp/llm-wiki-app.log
        exit 1
    fi
    echo "  等待中... ($i)"
    sleep 2
done

# === 6. 完成 ===
NODE_COUNT=$(python3 -c "import json; d=json.load(open('$BACKEND_DIR/graph-data.json')); print(d['count'])")

echo ""
echo "============================================"
echo "  🎉 LLM Wiki App 已啟動"
echo ""
echo "  🌐 http://localhost:$PORT/"
echo "  📡 API: http://localhost:$PORT/api/tree"
echo ""
echo "  📊 $NODE_COUNT 知識節點"
echo "  📂 知識庫: ~/Documents/21_LLM_Wiki_核心知識庫"
echo ""
echo "  🛑 關閉: kill \$(cat $PID_FILE)"
echo "  📝 日誌: tail -f /tmp/llm-wiki-app.log"
echo "============================================"
