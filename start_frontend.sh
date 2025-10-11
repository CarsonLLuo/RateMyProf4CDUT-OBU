#!/bin/bash
# 前端启动脚本 - 解决HOST环境变量冲突

echo "🚀 启动前端服务器..."
cd frontend

# 清除可能冲突的环境变量
unset HOST

# 设置正确的环境变量
export HOST=localhost
export PORT=3000
export BROWSER=none

# 启动React开发服务器
npm start
