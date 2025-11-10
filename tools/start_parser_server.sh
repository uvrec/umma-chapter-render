#!/bin/bash
# Startup script for Playwright parser server
# This script ensures the server is running for web chapter imports

cd "$(dirname "$0")/.."

echo "🚀 Starting Playwright parser server..."

# Check if requirements are installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "📦 Installing Python dependencies..."
    pip3 install -r tools/requirements.txt --quiet
    playwright install chromium --quiet
fi

# Start server in background
echo "🌐 Server starting on http://127.0.0.1:5003"
nohup python3 tools/parse_server.py > /tmp/parse_server.log 2>&1 &
echo $! > /tmp/parse_server.pid

# Wait and check if server is responding
sleep 2
if curl -s http://127.0.0.1:5003/health > /dev/null 2>&1; then
    echo "✅ Playwright parser server is running"
    echo "📝 Logs: tail -f /tmp/parse_server.log"
    echo "🛑 Stop: kill \$(cat /tmp/parse_server.pid)"
else
    echo "❌ Server failed to start. Check logs: cat /tmp/parse_server.log"
    exit 1
fi
