#!/bin/bash
# ============================================
# LLM Wiki App 啟動腳本
# ============================================
# 使用方式：
#   1. 打開終端 (Terminal.app)
#   2. 執行: bash ~/Documents/llm-wiki-app/start-app.sh
#   3. 保持終端開啟，瀏覽器訪問 http://localhost:3001
# ============================================

FRONTEND_DIR="$HOME/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app/frontend"
BACKEND_DIR="$HOME/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app/backend"

echo "🚀 啟動 LLM Wiki App..."
echo ""

# 檢查必要檔案
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    echo "❌ 後端依賴未安裝，請執行:"
    echo "   cd $BACKEND_DIR && npm install"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR/dist" ]; then
    echo "⚠️  前端未構建，正在構建..."
    cd "$FRONTEND_DIR" && npm run build 2>/dev/null
fi

# 關閉舊進程
echo "🧹 清理舊進程..."
pkill -f "node.*server.js" 2>/dev/null || true
sleep 1

# 啟動後端（同時服務前端靜態檔案）
echo "📡 啟動伺服器..."
cd "$BACKEND_DIR"
node server.js
