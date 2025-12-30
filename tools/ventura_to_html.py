#!/usr/bin/env python3
"""
Ventura Publisher to HTML converter for Bhagavad-gita
Version 5: Complete formatting with proper sizing and centering

ALL Ventura tags:
  <MI>...<D>        - Italic
  <BI>...<D>        - Bold Italic
  <_bt>...<_/bt>    - Bold text (book titles)
  <_qm>...</_qm>    - Quotation marks
  <_dt>...<_/dt>    - Term (italic in synonyms)
  <_dd>...<_/dd>    - Definition
  <_oneletter>X<_N> - Single letter
  <->               - Soft hyphen (join words)
  <&>               - Line continuation
  /<R>              - Line break in Sanskrit (danda)
  <_R><_>           - Line break in transliteration
  <R>               - End of line
  <S>               - Non-breaking dash
  <N>               - Non-breaking space
  //N//             - Verse number
  <mon>N</mon>      - Monospace (skip)
  <u003C>           - Unicode escape for <

Usage:
    python ventura_to_html.py <input.H##> [output.html]

Example:
    python tools/ventura_to_html.py data/BG01.H01 output/chapter01.html
"""

import re
import sys
from pathlib import Path

from balaram_decoder_v4_full import decode, OutputFormat

# === UKRAINIAN PUA DECODING ===
UKRAINIAN_PUA_MAP = {
    '\uf101': 'а̄',   # a-macron
    '\uf121': 'ı̄',   # i-macron (dotless i + macron, БЕЗ крапки!)
    '\uf123': 'ӯ',   # u-macron
    '\uf115': 'р̣',   # r-underdot
    '\uf125': 'р̣̄',  # r-underdot-macron
    '\uf127': 'л̣',   # l-underdot
    '\uf129': 'л̣̄',  # l-underdot-macron
    '\uf10f': 'н̇',   # n-overdot
    '\uf113': 'н̃',   # n-tilde
    '\uf111': 'н̣',   # n-underdot
    '\uf109': 'м̇',   # m-overdot (anusvara)
    '\uf119': 'т̣',   # t-underdot
    '\uf103': 'д̣',   # d-underdot
    '\uf11d': 'ш́',   # s-acute (palatal)
    '\uf11f': 'ш̣',   # s-underdot (retroflex)
    '\uf11b': 'х̣',   # h-underdot (visarga)
}

SANSKRIT_DIGITS = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
}


def decode_ukrainian_pua(text):
    """Decode Private Use Area characters to Ukrainian transliteration."""
    for pua, repl in UKRAINIAN_PUA_MAP.items():
        text = text.replace(pua, repl)
    return text


def to_sanskrit_num(num_str):
    """Convert Arabic numerals to Sanskrit (Devanagari) numerals with double danda."""
    digits = ''.join(SANSKRIT_DIGITS.get(d, d) for d in num_str)
    return f'॥{digits}॥'


# === VENTURA TAG PROCESSING ===

def process_inline_tags(text):
    """Convert ALL Ventura inline tags to HTML."""

    # Unicode escapes
    text = text.replace('<u003C>', '<')

    # Bold text (book titles): <_bt>...<_/bt> -> <strong>...</strong>
    text = re.sub(r'<_bt>([^<]*)<_/bt>', r'<strong>\1</strong>', text)

    # Quotation marks: remove tags, keep content
    text = text.replace('<_qm>', '')
    text = text.replace('</_qm>', '')

    # Bold Italic: <BI>...<D> -> <strong><em>...</em></strong>
    text = re.sub(r'<BI>([^<]*)<D>', r'<strong><em>\1</em></strong>', text)

    # Italic punctuation: <MI>,<D> -> just punctuation
    text = re.sub(r'<MI>([,.\;:\s])<D>', r'\1', text)

    # Italic: <MI>...<D> -> <em>...</em>
    text = re.sub(r'<MI>([^<]+)<D>', r'<em>\1</em>', text)

    # Non-breaking dash: <S> -> en-dash
    text = text.replace('<S>', '–')

    # Non-breaking space: <N> -> space
    text = text.replace('<N>', ' ')

    # Single letter: <_oneletter>X<_N> -> X
    text = re.sub(r'<_oneletter>(.)<_N>', r'\1', text)

    # Monospace: <mon>N</mon> -> remove
    text = re.sub(r'<mon>[^<]*</mon>', '', text)

    # Slash tag: <_slash>/<_/slash> -> /
    text = text.replace('<_slash>/<_/slash>', '/')

    # Clean remaining Ventura tags
    text = re.sub(
        r'<(?:D|R|_R|_|MI|BI|_dd|_/dd|_dt|_/dt|&|->|_oneletter|_N|_qm|/_qm|_bt|_/bt|mon|/mon|S|N|u003C)>',
        '',
        text
    )

    return text


def process_line_continuations(text):
    """Handle <-> and <&> line continuations."""
    lines = text.split('\n')
    result = []
    buffer = ""

    for line in lines:
        line_stripped = line.rstrip()

        # <-> = soft hyphen, remove hyphen and join
        if line_stripped.endswith('<->'):
            line = line_stripped[:-3]
            if line.endswith('-'):
                line = line[:-1]
            buffer += line
        # -<&> = hyphenated word split, remove hyphen and join
        elif line_stripped.endswith('-<&>'):
            buffer += line_stripped[:-4]  # Remove -<&>
        # <&> = line continuation, just join
        elif line_stripped.endswith('<&>'):
            buffer += line_stripped[:-3]
        else:
            if buffer:
                result.append(buffer + line)
                buffer = ""
            else:
                result.append(line)

    if buffer:
        result.append(buffer)

    return '\n'.join(result)


def process_header(text):
    """Process header text."""
    text = re.sub(r'<[^>]+>', '', text)
    # Convert verse/verses markers to uppercase for consistent styling
    text = text.replace('Вірші', 'ВІРШІ')
    text = text.replace('Вірш', 'ВІРШ')
    return text.strip()


def process_balaram_sanskrit(text):
    """Process Balaram-encoded Sanskrit to Devanagari."""
    text = process_line_continuations(text)

    # Unicode escapes
    text = text.replace('<u003C>', '<')

    # Extract verse number
    verse_match = re.search(r'//[^\d]*(\d+)[^\d]*//', text)
    verse_num = verse_match.group(1) if verse_match else None
    text = re.sub(r'//[^/]*//', '', text)

    # Split by danda marker
    parts = re.split(r'\s*/<R>\s*', text)

    decoded_lines = []
    for i, part in enumerate(parts):
        part = part.strip()
        part = re.sub(r'<[^>]*>', '', part)
        if not part:
            continue

        words = []
        for word in part.split():
            if word:
                try:
                    words.append(decode(word, OutputFormat.DEVANAGARI))
                except Exception:
                    words.append(word)

        if words:
            line = ' '.join(words)
            if i == 0 and len(parts) > 1:
                line += ' ।'
            decoded_lines.append(line)

    if verse_num and decoded_lines:
        decoded_lines[-1] += ' ' + to_sanskrit_num(verse_num)

    return '\n'.join(f'<span class="line">{l}</span>' for l in decoded_lines)


def process_ukrainian_verse(text):
    """Process Ukrainian transliteration."""
    text = process_line_continuations(text)

    text = text.replace('<_R><_>', '\n')
    text = text.replace('<R>', '\n')
    text = text.replace('<_>', '')

    lines = []
    for line in text.split('\n'):
        line = line.strip()
        if line:
            line = decode_ukrainian_pua(line)
            lines.append(line)

    return '\n'.join(f'<span class="line">{l}</span>' for l in lines)


def process_synonyms(text):
    """Process word-for-word synonyms."""
    text = process_line_continuations(text)
    text = ' '.join(text.split('\n'))

    text = re.sub(
        r'<MI><_dt>([^<]*)<_/dt><D>\s*–\s*<_dd>([^<]*)<_/dd>',
        r'<em>\1</em> – \2',
        text
    )

    text = re.sub(r'<_dt>([^<]*)<_/dt>', r'<em>\1</em>', text)
    text = re.sub(r'<_dd>([^<]*)<_/dd>', r'\1', text)

    text = process_inline_tags(text)
    text = re.sub(r'\s+', ' ', text).strip()
    text = decode_ukrainian_pua(text)

    return text


def process_prose(text):
    """Process prose (purport, translation)."""
    text = process_line_continuations(text)
    text = ' '.join(text.split('\n'))
    text = process_inline_tags(text)
    text = re.sub(r'\s+', ' ', text).strip()
    text = decode_ukrainian_pua(text)

    return text


def process_first_paragraph(text):
    """Process first paragraph with drop cap."""
    text = process_prose(text)

    # Add drop cap to first letter
    if text and len(text) > 0:
        first_char = text[0]
        rest = text[1:]
        return f'<span class="drop-cap">{first_char}</span>{rest}'

    return text


# === TAG CONFIGURATION ===
TAG_MAP = {
    '@h1-number':    {'tag': 'h1', 'class': 'chapter-number', 'process': process_header},
    '@h1':           {'tag': 'h1', 'class': 'chapter-title', 'process': process_header},
    '@h2-number':    {'tag': 'h2', 'class': 'verse-number', 'process': process_header},
    '@h2-number-2':  {'tag': 'h2', 'class': 'verse-number', 'process': process_header},
    '@h3-synonyms':  {'tag': 'h3', 'class': 'section-header', 'process': process_header},
    '@h3-trans':     {'tag': 'h3', 'class': 'section-header', 'process': process_header},

    '@d-uvaca':      {'tag': 'div', 'class': 'sanskrit', 'process': process_balaram_sanskrit},
    '@d-anustubh':   {'tag': 'div', 'class': 'sanskrit', 'process': process_balaram_sanskrit},
    '@d-tristubh':   {'tag': 'div', 'class': 'sanskrit', 'process': process_balaram_sanskrit},

    '@v-uvaca':      {'tag': 'div', 'class': 'transliteration', 'process': process_ukrainian_verse},
    '@v-anustubh':   {'tag': 'div', 'class': 'transliteration', 'process': process_ukrainian_verse},
    '@v-tristubh':   {'tag': 'div', 'class': 'transliteration', 'process': process_ukrainian_verse},

    '@eqs':          {'tag': 'div', 'class': 'synonyms', 'process': process_synonyms},
    '@term-txt':     {'tag': 'div', 'class': 'synonyms', 'process': process_synonyms},

    '@translation':  {'tag': 'div', 'class': 'translation', 'process': process_prose},
    '@trans-txt':    {'tag': 'div', 'class': 'translation', 'process': process_prose},

    '@p-purport':    {'tag': 'p', 'class': 'purport-title', 'process': process_header},
    '@p-indent':     {'tag': 'p', 'class': 'purport first', 'process': process_first_paragraph},
    '@p':            {'tag': 'p', 'class': 'purport', 'process': process_prose},
    '@p-outro':      {'tag': 'p', 'class': 'purport-outro', 'process': process_prose},

    '@text-rh':      {'skip': True},
    '@special':      {'skip': True},
    '@logo':         {'skip': True},
    '@rh-verso':     {'skip': True},
    '@rh-recto':     {'skip': True},
}


# === HTML TEMPLATE ===
HTML_HEAD = """<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Бгаґавад-ґіта</title>
<style>
:root {
    --text-color: #333;
    --accent-color: #8B4513;
    --bg-light: #fefefe;
    --font-size-base: 1.15em;
}

body {
    font-family: 'Georgia', serif;
    font-size: var(--font-size-base);
    line-height: 1.8;
    max-width: 900px;
    margin: 40px auto;
    padding: 0 20px;
    color: var(--text-color);
    background: var(--bg-light);
}

/* === HEADERS === */
.chapter-number {
    font-size: 1.2em;
    text-align: center;
    color: #666;
    margin-bottom: 0;
    letter-spacing: 0.3em;
}
.chapter-title {
    font-size: 2.2em;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 40px;
    font-weight: bold;
    color: var(--accent-color);
}
.verse-number {
    font-size: 1.4em;
    text-align: center;
    margin-top: 50px;
    margin-bottom: 20px;
    color: var(--accent-color);
    border-bottom: 2px solid #DEB887;
    padding-bottom: 5px;
}
.section-header {
    font-size: 1.1em;
    font-weight: bold;
    color: #666;
    margin: 25px 0 15px 0;
    text-align: center;
}

/* === SANSKRIT - CENTERED === */
.sanskrit {
    font-family: 'Noto Sans Devanagari', 'Siddhanta', serif;
    font-size: 1.3em;
    line-height: 2;
    margin: 15px 0;
    padding: 15px 20px;
    background: linear-gradient(to right, #FFF8DC, #FFFAF0);
    border-left: 4px solid #DAA520;
    text-align: center;
}
.sanskrit .line {
    display: block;
}
/* Merge consecutive Sanskrit blocks visually */
.sanskrit + .sanskrit {
    margin-top: -30px;
    padding-top: 0;
}

/* === TRANSLITERATION - CENTERED, ITALIC === */
.transliteration {
    font-family: 'Georgia', serif;
    font-style: italic;
    font-size: 1.1em;
    line-height: 1.9;
    margin: 10px 0 20px 0;
    padding: 10px 20px;
    color: #555;
    text-align: center;
}
.transliteration .line {
    display: block;
}
/* Merge consecutive transliteration blocks visually */
.transliteration + .transliteration {
    margin-top: -30px;
    padding-top: 0;
}

/* === SYNONYMS (same size as translation) === */
.synonyms {
    font-size: 1em;
    color: #444;
    background-color: #f9f9f9;
    padding: 15px 20px;
    border-radius: 5px;
    margin: 15px 0;
    border: 1px solid #e0e0e0;
    line-height: 1.8;
}
.synonyms em {
    font-style: italic;
    color: var(--accent-color);
}

/* === TRANSLATION === */
.translation {
    font-size: 1em;
    font-weight: bold;
    margin: 20px 0;
    padding: 15px;
    background: #f0f8ff;
    border-radius: 5px;
    line-height: 1.7;
}

/* === PURPORT === */
.purport-title {
    font-weight: bold;
    margin: 30px 0 20px 0;
    text-align: center;
    font-size: 1.1em;
    letter-spacing: 0.1em;
}

.purport {
    font-size: 1em;
    text-align: justify;
    margin-bottom: 15px;
    text-indent: 25px;
    line-height: 1.8;
}
.purport em { font-style: italic; }
.purport strong { font-weight: bold; }

/* === DROP CAP === */
.drop-cap {
    float: left;
    font-size: 3.5em;
    line-height: 0.8;
    padding-right: 8px;
    padding-top: 4px;
    color: var(--accent-color);
    font-weight: bold;
}
.purport.first {
    text-indent: 0;
}

.purport-outro {
    text-align: center;
    font-style: italic;
    margin-top: 30px;
    color: #666;
}

em { font-style: italic; }
strong { font-weight: bold; }
</style>
</head>
<body>
"""

HTML_FOOT = "</body></html>"


def parse_ventura_to_html(content):
    """Parse Ventura file to HTML."""
    html_parts = [HTML_HEAD]

    current_config = None
    buffer = []
    prev_class = None  # Track previous block's class for merging

    def flush_buffer():
        nonlocal current_config, buffer, prev_class
        if not buffer or not current_config:
            buffer = []
            return ""

        if current_config.get('skip'):
            buffer = []
            return ""

        raw_text = "\n".join(buffer)
        buffer = []

        if not raw_text.strip():
            return ""

        processor = current_config.get('process')
        if processor:
            processed = processor(raw_text)
        else:
            processed = raw_text.strip()

        if not processed:
            return ""

        tag = current_config['tag']
        css_class = current_config['class']

        result = f'<{tag} class="{css_class}">{processed}</{tag}>\n'
        prev_class = css_class
        return result

    for line in content.splitlines():
        match = re.match(r'^(@[\w-]+)\s*=\s*(.*)', line)

        if match:
            html_parts.append(flush_buffer())

            tag_name = match.group(1)
            content_start = match.group(2)

            current_config = TAG_MAP.get(tag_name)

            if current_config and content_start:
                buffer.append(content_start)
        else:
            if current_config and line:
                buffer.append(line)

    html_parts.append(flush_buffer())
    html_parts.append(HTML_FOOT)

    return "".join(html_parts)


def main():
    if len(sys.argv) < 2:
        print("Ventura Publisher to HTML Converter")
        print("Usage: python ventura_to_html.py <input.H##> [output.html]")
        print()
        print("Examples:")
        print("  python tools/ventura_to_html.py data/BG01.H01")
        print("  python tools/ventura_to_html.py data/BG01.H01 output/chapter01.html")
        sys.exit(1)

    input_file = Path(sys.argv[1])
    output_file = Path(sys.argv[2]) if len(sys.argv) > 2 else input_file.with_suffix('.html')

    if not input_file.exists():
        print(f"Error: File {input_file} not found")
        sys.exit(1)

    content = input_file.read_text(encoding='utf-8')
    html = parse_ventura_to_html(content)
    output_file.write_text(html, encoding='utf-8')

    print(f"Converted: {input_file} -> {output_file}")


if __name__ == '__main__':
    main()
