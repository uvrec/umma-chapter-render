"""Small Flask server that exposes a parse endpoint using Playwright parser with normalization.

This server uses the new playwright_parser.py which:
- Fetches verses from Vedabase (English IAST) + Gitabase (Ukrainian)
- Applies pre_import_normalizer.py for transliteration conversion
- Returns normalized JSON ready for import

Endpoints:
- POST /admin/parse-web-chapter
    JSON body: { 
      "lila": 1, 
      "chapter": 1, 
      "verse_count": 1, 
      "vedabase_base": "https://vedabase.io/en/library/cc/adi/1/1/",
      "gitabase_base": "https://gitabase.com/ukr/CC/1/1"
    }
    Returns: { 
      "verses": [ ...verse objects with transliteration... ], 
      "summary": { total: N, vedabase_base: ..., gitabase_base: ... }
    }

Run:
    python3 tools/parse_server.py

"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import traceback
import asyncio
import json

# Ensure repo root is on sys.path
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if repo_root not in sys.path:
    sys.path.insert(0, repo_root)

# Import the new Playwright parser
try:
    from tools import playwright_parser
except Exception as e:
    playwright_parser = None
    IMPORT_ERROR = str(e)
else:
    IMPORT_ERROR = None

app = Flask(__name__)
CORS(app)

@app.route('/admin/parse-web-chapter', methods=['POST'])
def parse_web_chapter():
    """
    Parse chapter using Playwright with normalization.
    
    Request JSON:
    {
      "lila": 1,
      "chapter": 1, 
      "verse_ranges": "1-64,65-66,67-110",
      "vedabase_base": "https://vedabase.io/en/library/cc/adi/1/",  // optional
      "gitabase_base": "https://gitabase.com/ukr/CC/1/1"              // optional
    }
    """
    if IMPORT_ERROR:
        return jsonify({"error": "playwright_parser not importable", "detail": IMPORT_ERROR}), 500
    
    data = request.get_json() or {}
    lila = int(data.get('lila', 1))
    chapter = int(data.get('chapter', 1))
    verse_ranges = data.get('verse_ranges', '1-1')
    
    # Optional: custom base URLs
    vedabase_base = data.get('vedabase_base')
    gitabase_base = data.get('gitabase_base')
    
    # Build default URLs if not provided
    if not vedabase_base:
        # Default: https://vedabase.io/en/library/cc/adi/{chapter}/
        lila_names = {1: 'adi', 2: 'madhya', 3: 'antya'}
        lila_name = lila_names.get(lila, 'adi')
        vedabase_base = f"https://vedabase.io/en/library/cc/{lila_name}/{chapter}/"
    
    if not gitabase_base:
        # Default: https://gitabase.com/ukr/CC/{lila}/{chapter}
        gitabase_base = f"https://gitabase.com/ukr/CC/{lila}/{chapter}"
    
    try:
        # Run async parser
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(
            playwright_parser.parse_chapter_async(
                verse_ranges=verse_ranges,
                vedabase_base=vedabase_base,
                gitabase_base=gitabase_base,
                lila_num=lila,
                chapter_num=chapter
            )
        )
        loop.close()
        
    except Exception as e:
        tb = traceback.format_exc()
        return jsonify({
            'error': 'parser_failed', 
            'detail': str(e), 
            'trace': tb
        }), 500
    
    # Save output for debugging
    try:
        os.makedirs('tools/outputs', exist_ok=True)
        output_path = f'tools/outputs/parsed_l{lila}_c{chapter}_ranges_{verse_ranges.replace(",", "_")}.json'
        with open(output_path, 'w', encoding='utf8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
    except Exception:
        pass
    
    return jsonify(result)

@app.route('/health')
def health():
    if IMPORT_ERROR:
        return jsonify({'status': 'error', 'import_error': IMPORT_ERROR}), 500
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    print('Starting parse_server on http://127.0.0.1:5003')
    app.run(port=5003, host='127.0.0.1')
