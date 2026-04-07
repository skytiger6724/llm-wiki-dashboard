import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0', // 強制監聽所有 IP
    cors: true,      // 允許跨域
    strictPort: true // 如果 port 被佔用就報錯，不要亂跳
  }
})
