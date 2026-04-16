#!/bin/bash
# LLM Wiki App 一鍵啟動腳本
# 路徑: /Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app

APP_DIR="/Users/dwaynejohnson/Library/CloudStorage/OneDrive-個人/Documents/llm-wiki-app"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

echo "🚀 LLM Wiki App 啟動中..."
echo ""

# === 1. 清理舊進程 ===
echo "🧹 清理舊進程..."
# 強制終止所有相關進程
screen -S llm-wiki-api -X quit 2>/dev/null
screen -S llm-wiki-fe -X quit 2>/dev/null

# 徹底清理端口佔用（給 3 次機會）
for port in 3001 5173; do
    for i in 1 2 3; do
        pids=$(lsof -ti:$port 2>/dev/null)
        if [ -n "$pids" ]; then
            echo "  清理端口 $port (嘗試 $i)..."
            echo "$pids" | xargs kill -9 2>/dev/null
            sleep 1
        else
            break
        fi
    done
done

# 驗證端口已釋放
if lsof -ti:3001 2>/dev/null; then
    echo "❌ 端口 3001 仍被佔用，手動處理："
    lsof -i:3001
    exit 1
fi
sleep 1
echo "✅ 清理完成"
echo ""

# === 2. 檢查並安裝依賴 ===
echo "📦 檢查依賴..."
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    echo "  安裝後端依賴..."
    cd "$BACKEND_DIR" && npm install --legacy-peer-deps
fi
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "  安裝前端依賴..."
    cd "$FRONTEND_DIR" && npm install --legacy-peer-deps
fi
echo "✅ 依賴就緒"
echo ""

# === 3. 更新圖譜 ===
echo "📊 更新圖譜數據..."
cd "$BACKEND_DIR" && node precompute-graph.js
echo ""

# === 4. 啟動 API (screen) ===
echo "📡 啟動 API Server (port 3001)..."
screen -dmS llm-wiki-api bash -c "cd $BACKEND_DIR && exec node server.js"
sleep 2

if curl -s http://localhost:3001/api/tree > /dev/null 2>&1; then
    echo "✅ API Server 已就緒"
else
    echo "❌ API Server 啟動失敗"
    exit 1
fi
echo ""

# === 5. 啟動前端 (screen + 本地 vite) ===
echo "🎨 啟動前端 (port 5173)..."
screen -dmS llm-wiki-fe bash -c "cd $FRONTEND_DIR && exec node ./node_modules/.bin/vite --host --port 5173"
sleep 5

# 驗證前端
for i in 1 2 3 4 5; do
    if curl -s --connect-timeout 3 http://localhost:5173/ > /dev/null 2>&1; then
        echo "✅ 前端已就緒"
        break
    fi
    if [ $i -eq 5 ]; then
        echo "❌ 前端啟動失敗"
        echo "=== Vite Log ==="
        screen -S llm-wiki-fe -p 0 -X hardcopy /tmp/llm-wiki-fe-log.txt 2>/dev/null
        cat /tmp/llm-wiki-fe-log.txt 2>/dev/null
        exit 1
    fi
    echo "  等待前端啟動... ($i)"
    sleep 2
done
echo ""

# === 6. 健康檢查 ===
echo "🏥 健康檢查..."
for i in 1 2 3; do
    if curl -s --connect-timeout 3 http://localhost:3001/api/tree > /dev/null 2>&1; then
        echo "✅ API 健康檢查通過"
        break
    fi
    if [ $i -eq 3 ]; then
        echo "❌ API 健康檢查失敗"
        echo "=== API Log ==="
        screen -S llm-wiki-api -p 0 -X hardcopy /tmp/llm-wiki-api-log.txt 2>/dev/null
        cat /tmp/llm-wiki-api-log.txt 2>/dev/null
        exit 1
    fi
    echo "  等待 API 就緒... ($i)"
    sleep 2
done

# === 6. 完成 ===
NODE_COUNT=$(cat "$BACKEND_DIR/graph-data.json" | python3 -c 'import sys,json; print(json.load(sys.stdin)["count"])')

echo "============================================"
echo "  🎉 LLM Wiki App 已啟動"
echo ""
echo "  🌐 http://localhost:5173/"
echo "  📡 API: http://localhost:3001/api/tree"
echo ""
echo "  📊 $NODE_COUNT 知識節點"
echo "  📂 知識庫: ~/Documents/21_LLM_Wiki_核心知識庫"
echo ""
echo "  🛑 關閉:"
echo "     screen -S llm-wiki-api -X quit"
echo "     screen -S llm-wiki-fe -X quit"
echo "============================================"
