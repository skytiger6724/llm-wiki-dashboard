#!/bin/bash
# LLM Wiki App 啟動腳本
# 使用方式: 在終端機執行 bash start-wiki-app.sh

set -e

BASE_DIR="/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app"

echo "🚀 LLM Wiki App 啟動中..."

# 清理舊程序
pkill -9 -f "llm-wiki-app/backend/server.js" 2>/dev/null || true
pkill -9 -f "llm-wiki-app/frontend.*vite" 2>/dev/null || true
sleep 1

# 啟動 API Server
echo "📡 啟動 API Server (port 3001)..."
cd "$BASE_DIR/backend"
node server.js &
API_PID=$!
disown $API_PID 2>/dev/null || true
sleep 1

# 等待 API 就緒
if curl -s http://localhost:3001/api/tree > /dev/null 2>&1; then
    echo "✅ API Server 已就緒"
else
    echo "❌ API Server 啟動失敗"
    exit 1
fi

# 啟動 Vite 前端
echo "🎨 啟動前端 (port 5173)..."
cd "$BASE_DIR/frontend"
node node_modules/.bin/vite --host --port 5173 --strictPort &
VITE_PID=$!
disown $VITE_PID 2>/dev/null || true
sleep 3

# 等待前端就緒
if curl -s http://localhost:5173/ > /dev/null 2>&1; then
    echo "✅ 前端已就緒"
else
    echo "❌ 前端啟動失敗"
    exit 1
fi

echo ""
echo "============================================"
echo "  LLM Wiki App 已啟動"
echo "  打開瀏覽器: http://localhost:5173/"
echo "  API: http://localhost:3001/api/tree"
echo "  按 Ctrl+C 關閉所有服務"
echo "============================================"
echo ""

# 等待用戶中斷
trap "kill $API_PID $VITE_PID 2>/dev/null; echo '已關閉'; exit" INT
wait
