#!/bin/bash

# Vedavoice Local LLM Startup Script

set -e

echo "========================================"
echo "  Vedavoice Local LLM"
echo "========================================"
echo ""

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "Error: Ollama is not installed."
    echo "Install it from: https://ollama.ai"
    exit 1
fi

# Check if required models are available
echo "Checking models..."

if ! ollama list | grep -q "qwen2.5"; then
    echo "Downloading LLM model (qwen2.5:14b)..."
    ollama pull qwen2.5:14b
fi

if ! ollama list | grep -q "nomic-embed-text"; then
    echo "Downloading embedding model..."
    ollama pull nomic-embed-text
fi

echo "Models ready!"
echo ""

# Activate virtual environment if exists
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "Virtual environment activated."
fi

# Check if index exists
if [ ! -d "chroma_db" ]; then
    echo ""
    echo "Vector database not found."
    echo "Please run: python indexer.py"
    echo ""
    exit 1
fi

# Start the server
echo ""
echo "Starting server on http://localhost:8000"
echo "Press Ctrl+C to stop"
echo ""

python server.py
