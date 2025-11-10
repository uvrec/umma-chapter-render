#!/bin/bash
# Stop Playwright parser server

if [ -f /tmp/parse_server.pid ]; then
    PID=$(cat /tmp/parse_server.pid)
    if ps -p $PID > /dev/null 2>&1; then
        echo "🛑 Stopping Playwright parser server (PID: $PID)..."
        kill $PID
        rm /tmp/parse_server.pid
        echo "✅ Server stopped"
    else
        echo "⚠️  Server is not running (PID file exists but process not found)"
        rm /tmp/parse_server.pid
    fi
else
    # Try to find and kill by port
    PID=$(lsof -ti:5003 2>/dev/null)
    if [ -n "$PID" ]; then
        echo "🛑 Stopping server on port 5003 (PID: $PID)..."
        kill $PID
        echo "✅ Server stopped"
    else
        echo "ℹ️  Server is not running"
    fi
fi
