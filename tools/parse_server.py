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
      "gitabase_base": "https://gitabase.com/uk/CC/1/1"
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

# Import BBT Ukrainian importer
try:
    from tools import bg_ukrainian_importer
except Exception as e:
    bg_ukrainian_importer = None
    BBT_IMPORT_ERROR = str(e)
else:
    BBT_IMPORT_ERROR = None

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
      "gitabase_base": "https://gitabase.com/uk/CC/1/1"              // optional
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
        # Default: https://gitabase.com/uk/CC/{lila}/{chapter}
        gitabase_base = f"https://gitabase.com/uk/CC/{lila}/{chapter}"
    
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

@app.route('/admin/parse-bbt', methods=['GET', 'POST'])
def parse_bbt():
    """
    Parse BBT Bhagavad-gita files (Ventura format).

    GET: Returns list of available files
    POST: Parse specific files

    POST JSON:
    {
      "mode": "chapters" | "intro" | "all",
      "chapter": 2  // optional: specific chapter number
    }
    """
    if BBT_IMPORT_ERROR:
        return jsonify({"error": "bg_ukrainian_importer not importable", "detail": BBT_IMPORT_ERROR}), 500

    docs_dir = os.path.join(repo_root, 'docs')

    if request.method == 'GET':
        # List available files
        chapters = []
        intros = []

        import glob
        for f in sorted(glob.glob(os.path.join(docs_dir, 'UKBG*XT.H*'))):
            fname = os.path.basename(f)
            chapters.append(fname)

        for f in sorted(glob.glob(os.path.join(docs_dir, 'UKBG00*.H*'))):
            fname = os.path.basename(f)
            prefix = fname[:8]
            if prefix in bg_ukrainian_importer.INTRO_FILE_MAP:
                slug, title, order = bg_ukrainian_importer.INTRO_FILE_MAP[prefix]
                intros.append({'file': fname, 'slug': slug, 'title': title, 'order': order})

        return jsonify({
            'chapters': chapters,
            'intros': intros,
            'docs_dir': docs_dir
        })

    # POST: parse files
    data = request.get_json() or {}
    mode = data.get('mode', 'all')
    specific_chapter = data.get('chapter')

    results = {
        'chapters': [],
        'intros': [],
        'errors': []
    }

    try:
        import glob
        from pathlib import Path

        # Parse chapters
        if mode in ('chapters', 'all'):
            for h_file in sorted(glob.glob(os.path.join(docs_dir, 'UKBG*XT.H*'))):
                try:
                    text = bg_ukrainian_importer.read_file(Path(h_file))
                    chapter = bg_ukrainian_importer.parse_ventura(text)

                    if specific_chapter and chapter.chapter_number != specific_chapter:
                        continue

                    if chapter.verses:
                        results['chapters'].append(chapter.to_dict())
                except Exception as e:
                    results['errors'].append({
                        'file': os.path.basename(h_file),
                        'error': str(e)
                    })

        # Parse intro pages
        if mode in ('intro', 'all'):
            for h_file in sorted(glob.glob(os.path.join(docs_dir, 'UKBG00*.H*'))):
                fname = os.path.basename(h_file)
                prefix = fname.split('.')[0][:8]

                if prefix not in bg_ukrainian_importer.INTRO_FILE_MAP:
                    continue

                try:
                    text = bg_ukrainian_importer.read_file(Path(h_file))
                    intro = bg_ukrainian_importer.parse_intro_page(text, prefix)

                    if intro:
                        results['intros'].append(intro.to_dict())
                except Exception as e:
                    results['errors'].append({
                        'file': fname,
                        'error': str(e)
                    })

        results['summary'] = {
            'total_chapters': len(results['chapters']),
            'total_verses': sum(c.get('verse_count', 0) for c in results['chapters']),
            'total_intros': len(results['intros']),
            'errors': len(results['errors'])
        }

    except Exception as e:
        tb = traceback.format_exc()
        return jsonify({
            'error': 'parse_failed',
            'detail': str(e),
            'trace': tb
        }), 500

    return jsonify(results)


@app.route('/health')
def health():
    status = {'status': 'ok'}
    if IMPORT_ERROR:
        status['playwright_error'] = IMPORT_ERROR
    if BBT_IMPORT_ERROR:
        status['bbt_error'] = BBT_IMPORT_ERROR
    if IMPORT_ERROR or BBT_IMPORT_ERROR:
        status['status'] = 'partial'
    return jsonify(status)

if __name__ == '__main__':
    print('Starting parse_server on http://127.0.0.1:5003')
    app.run(port=5003, host='127.0.0.1')
