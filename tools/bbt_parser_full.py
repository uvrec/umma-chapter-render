#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
BBT Parser v2.0 — Повний парсер для імпорту на сайт

Можливості:
- Парсинг .H## файлів (UTF-16LE)
- Збереження структури блоків
- Конвертація PUA → Unicode
- Вивід у JSON/HTML/Markdown
- Збереження оригінального Balaram або конвертація

Використання:
    python bbt_parser_full.py input.H## -f json -o output.json
    python bbt_parser_full.py input.H## -f html --structured
    python bbt_parser_full.py --batch input_dir/ -f json output_dir/

НОРМАЛІЗАЦІЯ ТЕКСТУ:
- tools/translit_normalizer.py - apply_ukrainian_rules()
- tools/pre_import_normalizer.py - mojibake, діакритика, апострофи
- src/utils/text/textNormalizationRules.ts - повний список правил

МАППІНГ ПОЛІВ (для джерел EN + Sanskrit/Bengali):
=================================================
- sanskrit_en / sanskrit_ua — Bengali/Sanskrit (Devanagari script), однаковий вміст
- transliteration_en — IAST транслітерація (латинка з діакритикою)
- transliteration_ua — українська кирилична транслітерація з діакритикою
  (конвертується з IAST за допомогою tools/translit_normalizer.py)
- translation_en / purport_en — англійський переклад та пояснення
- translation_ua / purport_ua — український переклад та пояснення
"""

import re
import json
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, field
from enum import Enum
import unicodedata

# =============================================================================
# CONSTANTS
# =============================================================================

VERSION = "2.0"

# Довга і (правильна форма)
LONG_I = '\u0131\u0304'  # ı̄ (dotless i + macron)

# PUA → Unicode (виправлена таблиця v2.1)
PUA_MAP: Dict[str, str] = {
    '\uf101': 'а̄',    # ā
    '\uf102': LONG_I,  # ī
    '\uf103': 'д̣',    # ḍ
    '\uf109': 'м̇',    # ṁ
    '\uf10f': 'н̇',    # ṅ
    '\uf111': 'н̣',    # ṇ
    '\uf113': 'н̃',    # ñ
    '\uf115': 'р̣',    # ṛ
    '\uf119': 'т̣',    # ṭ
    '\uf11c': 'Ш́',    # Ś
    '\uf11d': 'ш́',    # ś
    '\uf121': LONG_I,  # ī
}

# Balaram → Unicode Devanagari (базова таблиця)
BALARAM_TO_DEVANAGARI = {
    # Голосні
    'a': 'अ', 'A': 'आ', 'aa': 'आ',
    'i': 'इ', 'I': 'ई', 'ii': 'ई',
    'u': 'उ', 'U': 'ऊ', 'uu': 'ऊ',
    'e': 'ए', 'E': 'ऐ', 'ai': 'ऐ',
    'o': 'ओ', 'O': 'औ', 'au': 'औ',

    # Приголосні
    'k': 'क', 'K': 'ख', 'kh': 'ख',
    'g': 'ग', 'G': 'घ', 'gh': 'घ',
    'c': 'च', 'C': 'छ', 'ch': 'छ',
    'j': 'ज', 'J': 'झ', 'jh': 'झ',
    't': 'त', 'T': 'थ', 'th': 'थ',
    'd': 'द', 'D': 'ध', 'dh': 'ध',
    'n': 'न', 'N': 'ण',
    'p': 'प', 'P': 'फ', 'ph': 'फ',
    'b': 'ब', 'B': 'भ', 'bh': 'भ',
    'm': 'म', 'M': 'ं',  # anusvara
    'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व',
    's': 'स', 'S': 'ष', 'z': 'श', 'Z': 'श',
    'h': 'ह', 'H': 'ः',  # visarga
}

# =============================================================================
# BLOCK TYPES
# =============================================================================

class BlockType(Enum):
    CHAPTER_NUMBER = "chapter_number"
    CHAPTER_TITLE = "chapter_title"
    VERSE_NUMBER = "verse_number"
    DEVANAGARI = "devanagari"
    TRANSLITERATION = "transliteration"
    SPEAKER = "speaker"
    SYNONYMS_HEADER = "synonyms_header"
    SYNONYMS = "synonyms"
    TRANSLATION_HEADER = "translation_header"
    TRANSLATION = "translation"
    PURPORT_HEADER = "purport_header"
    PURPORT = "purport"
    PURPORT_FIRST = "purport_first"
    VERSE_QUOTE = "verse_quote"
    REFERENCE = "reference"
    OUTRO = "outro"
    PARAGRAPH = "paragraph"
    GLOSSARY_ITEM = "glossary_item"
    PUBLICATION_INFO = "publication_info"
    UNKNOWN = "unknown"

TAG_TO_TYPE: Dict[str, BlockType] = {
    'h1-number': BlockType.CHAPTER_NUMBER,
    'h1': BlockType.CHAPTER_TITLE,
    'h1-fb': BlockType.CHAPTER_TITLE,
    'h2-number': BlockType.VERSE_NUMBER,
    'h2-number-2': BlockType.VERSE_NUMBER,
    'ch': BlockType.VERSE_NUMBER,
    'd-uvaca': BlockType.DEVANAGARI,
    'd-anustubh': BlockType.DEVANAGARI,
    'v-uvaca': BlockType.SPEAKER,
    'v-anustubh': BlockType.TRANSLITERATION,
    'h3-synonyms': BlockType.SYNONYMS_HEADER,
    'eqs': BlockType.SYNONYMS,
    'h3-trans': BlockType.TRANSLATION_HEADER,
    'translation': BlockType.TRANSLATION,
    'p-purport': BlockType.PURPORT_HEADER,
    'p-indent': BlockType.PURPORT_FIRST,
    'p': BlockType.PURPORT,
    'p0': BlockType.PURPORT,
    'p1': BlockType.PURPORT,
    'p-anustubh': BlockType.VERSE_QUOTE,
    'p-reference-h': BlockType.REFERENCE,
    'p-outro': BlockType.OUTRO,
    'li-gl': BlockType.GLOSSARY_ITEM,
    'p-pi': BlockType.PUBLICATION_INFO,
    'p-pi1': BlockType.PUBLICATION_INFO,
}

SKIP_TAGS = {'rh-verso', 'rh-recto', 'logo', 'text-rh', 'special'}

# =============================================================================
# DATA STRUCTURES
# =============================================================================

@dataclass
class TextBlock:
    """Один блок тексту"""
    type: str
    content: str           # Чистий текст
    html: str             # HTML-форматований текст
    raw_tag: str          # Оригінальний тег
    original: str = ""    # Оригінальний текст (до обробки)

    def to_dict(self) -> Dict[str, Any]:
        return {
            'type': self.type,
            'content': self.content,
            'html': self.html,
            'tag': self.raw_tag,
        }

@dataclass
class Verse:
    """Вірш із усіма компонентами"""
    number: str
    devanagari: Optional[str] = None
    transliteration: Optional[str] = None
    speaker: Optional[str] = None
    synonyms: Optional[str] = None
    translation: Optional[str] = None
    purport: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        d = {
            'number': self.number,
            'transliteration': self.transliteration,
            'translation': self.translation,
        }
        if self.devanagari:
            d['devanagari'] = self.devanagari
        if self.speaker:
            d['speaker'] = self.speaker
        if self.synonyms:
            d['synonyms'] = self.synonyms
        if self.purport:
            d['purport'] = self.purport
        return d

@dataclass
class Chapter:
    """Глава"""
    number: str
    title: str
    verses: List[Verse]

    def to_dict(self) -> Dict[str, Any]:
        return {
            'chapter_number': self.number,
            'chapter_title': self.title,
            'verses': [v.to_dict() for v in self.verses],
            'verse_count': len(self.verses)
        }

# =============================================================================
# TEXT PROCESSING
# =============================================================================

def replace_pua(text: str) -> str:
    """Замінює PUA символи на Unicode"""
    for pua, uni in PUA_MAP.items():
        text = text.replace(pua, uni)
    return text


def process_inline_tags(text: str) -> Tuple[str, str]:
    """
    Обробляє інлайнові теги розмітки.
    Повертає (plain_text, html_text)
    """
    html = text
    plain = text

    # Soft hyphen, line continuation
    html = re.sub(r'<->\s*', '', html)
    html = re.sub(r'<&>\s*', '', html)
    plain = re.sub(r'<->\s*', '', plain)
    plain = re.sub(r'<&>\s*', '', plain)

    # Line breaks
    html = re.sub(r'<_?R>', '<br>\n', html)
    plain = re.sub(r'<_?R>', '\n', plain)

    # Spaces
    html = re.sub(r'<N\|?>', '', html)
    html = re.sub(r'<S>', ' ', html)
    html = re.sub(r'<_>', ' ', html)
    plain = re.sub(r'<N\|?>', '', plain)
    plain = re.sub(r'<S>', ' ', plain)
    plain = re.sub(r'<_>', ' ', plain)

    # Single letter prepositions
    html = re.sub(r'<_oneletter>([^<]*)<_N>', r'\1 ', html)
    plain = re.sub(r'<_oneletter>([^<]*)<_N>', r'\1 ', plain)

    # Bold + Italic
    html = re.sub(r'<BI>([^<]*)</?D>', r'<strong><em>\1</em></strong>', html)
    plain = re.sub(r'<BI>([^<]*)</?D>', r'\1', plain)

    # Bold
    html = re.sub(r'<B>([^<]*)</?D>', r'<strong>\1</strong>', html)
    html = re.sub(r'<B>', '<strong>', html)
    html = re.sub(r'</D>', '</strong>', html)
    plain = re.sub(r'<B>([^<]*)</?D>', r'\1', plain)
    plain = re.sub(r'<B>', '', plain)

    # Italic
    html = re.sub(r'<MI>([^<]*)</?D>', r'<em>\1</em>', html)
    html = re.sub(r'<MI>', '<em>', html)
    html = re.sub(r'</?D>', '</em>', html)
    plain = re.sub(r'<MI>([^<]*)</?D>', r'\1', plain)
    plain = re.sub(r'<MI>', '', plain)
    plain = re.sub(r'</?D>', '', plain)

    # Book titles
    html = re.sub(r'<_bt>([^<]*)<_/bt>', r'<cite>\1</cite>', html)
    plain = re.sub(r'<_bt>([^<]*)<_/bt>', r'«\1»', plain)

    # Quotes - Ukrainian style
    html = re.sub(r'<_qm>([^<]*)</_qm>', r'«\1»', html)
    html = re.sub(r'<_qm>', '«', html)
    html = re.sub(r'</_qm>', '»', html)
    plain = re.sub(r'<_qm>([^<]*)</_qm>', r'«\1»', plain)
    plain = re.sub(r'<_qm>', '«', plain)
    plain = re.sub(r'</_qm>', '»', plain)

    # Other quotes
    html = re.sub(r'<_q>([^<]*)<_/q>', r'«\1»', html)
    plain = re.sub(r'<_q>([^<]*)<_/q>', r'«\1»', plain)

    # Definition terms (glossary)
    html = re.sub(r'<_dt>([^<]*)<_/dt>', r'<dfn>\1</dfn>', html)
    html = re.sub(r'<_dt>', '<dfn>', html)
    html = re.sub(r'<_/dt>', '</dfn>', html)
    html = re.sub(r'<_dd>|<_/dd>', '', html)
    plain = re.sub(r'<_dt>([^<]*)<_/dt>', r'\1', plain)
    plain = re.sub(r'<_dt>|<_/dt>|<_dd>|<_/dd>', '', plain)

    # Slash
    html = re.sub(r'<_slash>/<_/slash>', '/', html)
    plain = re.sub(r'<_slash>/<_/slash>', '/', plain)

    # Mon (ignore)
    html = re.sub(r'<mon>[^<]*</mon>', '', html)
    plain = re.sub(r'<mon>[^<]*</mon>', '', plain)

    # Replace PUA
    html = replace_pua(html)
    plain = replace_pua(plain)

    # Cleanup
    html = re.sub(r'</em>\s*<em>', ' ', html)
    html = re.sub(r'</strong>\s*<strong>', ' ', html)
    html = re.sub(r'\s+', ' ', html).strip()
    plain = re.sub(r'\s+', ' ', plain).strip()

    return plain, html


def read_file(filepath: Path) -> str:
    """Читає файл з автовизначенням кодування"""
    with open(filepath, 'rb') as f:
        content = f.read()

    # Спроба UTF-16LE
    try:
        text = content.decode('utf-16-le')
        if text.startswith('\ufeff'):
            text = text[1:]
        return text
    except UnicodeDecodeError:
        pass

    # Спроба UTF-8
    try:
        text = content.decode('utf-8')
        if text.startswith('\ufeff'):
            text = text[1:]
        return text
    except UnicodeDecodeError:
        pass

    # Fallback
    return content.decode('latin-1')


def parse_blocks(text: str) -> List[TextBlock]:
    """Парсить текст на блоки"""
    lines = text.split('\n')
    blocks = []
    current_tag = None
    current_content = []

    for line in lines:
        line = line.rstrip()

        if line.startswith('@') and ' = ' in line:
            # Зберігаємо попередній блок
            if current_tag and current_tag not in SKIP_TAGS:
                content = ' '.join(current_content)
                if content.strip():
                    block_type = TAG_TO_TYPE.get(current_tag, BlockType.UNKNOWN)
                    plain, html = process_inline_tags(content)
                    blocks.append(TextBlock(
                        type=block_type.value,
                        content=plain,
                        html=html,
                        raw_tag=current_tag,
                        original=content
                    ))

            # Новий блок
            match = re.match(r'@([\w-]+)\s*=\s*(.*)', line)
            if match:
                current_tag = match.group(1)
                c = match.group(2).strip()
                current_content = [c] if c else []
        elif current_tag and line:
            current_content.append(line)

    # Останній блок
    if current_tag and current_tag not in SKIP_TAGS:
        content = ' '.join(current_content)
        if content.strip():
            block_type = TAG_TO_TYPE.get(current_tag, BlockType.UNKNOWN)
            plain, html = process_inline_tags(content)
            blocks.append(TextBlock(
                type=block_type.value,
                content=plain,
                html=html,
                raw_tag=current_tag,
                original=content
            ))

    return blocks


def blocks_to_chapter(blocks: List[TextBlock]) -> Chapter:
    """Конвертує блоки в структуру глави"""
    chapter_number = ""
    chapter_title = ""
    verses = []
    current_verse = None

    for block in blocks:
        btype = block.type

        if btype == BlockType.CHAPTER_NUMBER.value:
            chapter_number = block.content
        elif btype == BlockType.CHAPTER_TITLE.value:
            chapter_title = block.content
        elif btype == BlockType.VERSE_NUMBER.value:
            if current_verse:
                verses.append(current_verse)
            current_verse = Verse(number=block.content)
        elif current_verse:
            if btype == BlockType.DEVANAGARI.value:
                if current_verse.devanagari:
                    current_verse.devanagari += ' ' + block.content
                else:
                    current_verse.devanagari = block.content
            elif btype == BlockType.TRANSLITERATION.value:
                if current_verse.transliteration:
                    current_verse.transliteration += ' ' + block.content
                else:
                    current_verse.transliteration = block.content
            elif btype == BlockType.SPEAKER.value:
                current_verse.speaker = block.content
            elif btype == BlockType.SYNONYMS.value:
                if current_verse.synonyms:
                    current_verse.synonyms += ' ' + block.content
                else:
                    current_verse.synonyms = block.content
            elif btype == BlockType.TRANSLATION.value:
                current_verse.translation = block.content
            elif btype in (BlockType.PURPORT.value, BlockType.PURPORT_FIRST.value):
                current_verse.purport.append(block.content)

    if current_verse:
        verses.append(current_verse)

    return Chapter(number=chapter_number, title=chapter_title, verses=verses)

# =============================================================================
# OUTPUT FORMATTERS
# =============================================================================

def to_json(blocks: List[TextBlock], structured: bool = False) -> str:
    """Вивід у JSON"""
    if structured:
        chapter = blocks_to_chapter(blocks)
        return json.dumps(chapter.to_dict(), ensure_ascii=False, indent=2)
    else:
        return json.dumps([b.to_dict() for b in blocks], ensure_ascii=False, indent=2)


def to_html(blocks: List[TextBlock], include_devanagari: bool = False) -> str:
    """Вивід у HTML"""

    css = '''<style>
:root { --primary: #8b4513; --bg: #fffef9; --text: #2a2a2a; --muted: #666; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    font-family: "Noto Serif", Georgia, serif;
    max-width: 760px; margin: 0 auto; padding: 32px 40px;
    line-height: 1.9; color: var(--text); background: var(--bg);
}
.chapter-number { text-align: center; font-size: 0.9em; margin-top: 48px; letter-spacing: 6px; color: var(--muted); text-transform: uppercase; }
.chapter-title { text-align: center; font-size: 1.5em; margin: 16px 0 56px; font-weight: 400; line-height: 1.4; }
.verse-number { text-align: center; font-size: 0.85em; margin: 48px 0 16px; color: var(--muted); font-weight: 600; letter-spacing: 1px; }
.devanagari { font-size: 1.1em; text-align: center; margin: 12px 0; color: #555; font-family: "Noto Sans Devanagari", sans-serif; }
.transliteration, .speaker { font-style: italic; text-align: center; margin: 10px 0 20px; color: #555; line-height: 1.8; }
.synonyms-header, .translation-header, .purport-header { font-weight: 600; margin: 28px 0 10px; font-size: 0.8em; color: var(--muted); text-transform: uppercase; letter-spacing: 1.5px; }
.synonyms { margin: 10px 0 24px; font-size: 0.92em; line-height: 2.1; color: #444; }
.translation { margin: 12px 0 28px; font-size: 1.05em; background: linear-gradient(135deg, #f8f7f2 0%, #faf9f4 100%); padding: 20px 24px; border-left: 4px solid var(--primary); border-radius: 0 8px 8px 0; }
.purport, .purport-first { margin: 16px 0; text-align: justify; }
.purport-first::first-letter { font-size: 1.4em; font-weight: 600; color: var(--primary); }
.verse-quote { text-align: center; font-style: italic; margin: 24px 0; line-height: 1.8; color: #555; padding: 16px; background: #f9f8f4; border-radius: 8px; }
.reference { text-align: right; font-size: 0.8em; color: #999; margin: 4px 0 24px; }
.outro { text-align: center; margin-top: 64px; font-style: italic; color: var(--muted); padding: 28px; border-top: 2px solid #e8e6e0; }
.glossary-item { margin: 16px 0; padding: 12px 0; border-bottom: 1px solid #eee; }
.glossary-item dfn { font-weight: 600; color: var(--primary); font-style: normal; }
.publication-info { text-align: center; font-size: 0.9em; color: var(--muted); margin: 16px 0; }
cite { font-style: italic; }
em { font-style: italic; }
strong { font-weight: 600; }
</style>'''

    type_to_class = {
        'chapter_number': 'chapter-number',
        'chapter_title': 'chapter-title',
        'verse_number': 'verse-number',
        'devanagari': 'devanagari',
        'transliteration': 'transliteration',
        'speaker': 'speaker',
        'synonyms_header': 'synonyms-header',
        'synonyms': 'synonyms',
        'translation_header': 'translation-header',
        'translation': 'translation',
        'purport_header': 'purport-header',
        'purport': 'purport',
        'purport_first': 'purport-first',
        'verse_quote': 'verse-quote',
        'reference': 'reference',
        'outro': 'outro',
        'glossary_item': 'glossary-item',
        'publication_info': 'publication-info',
        'paragraph': 'paragraph',
    }

    type_to_tag = {
        'chapter_title': 'h1',
        'purport': 'p',
        'purport_first': 'p',
        'paragraph': 'p',
    }

    html_parts = [f'''<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Бгаґавад-ґіта</title>
{css}
</head>
<body>
''']

    for block in blocks:
        # Пропускаємо деванагарі якщо не потрібно
        if block.type == 'devanagari' and not include_devanagari:
            continue

        css_class = type_to_class.get(block.type, 'unknown')
        tag = type_to_tag.get(block.type, 'div')
        html_parts.append(f'<{tag} class="{css_class}">{block.html}</{tag}>\n')

    html_parts.append('</body>\n</html>')
    return ''.join(html_parts)


def to_markdown(blocks: List[TextBlock]) -> str:
    """Вивід у Markdown"""
    md_parts = []

    for block in blocks:
        btype = block.type
        content = block.content

        if btype == 'chapter_number':
            md_parts.append(f'\n## {content}\n')
        elif btype == 'chapter_title':
            md_parts.append(f'# {content}\n')
        elif btype == 'verse_number':
            md_parts.append(f'\n---\n\n### {content}\n')
        elif btype in ('transliteration', 'speaker'):
            md_parts.append(f'\n*{content}*\n')
        elif btype == 'synonyms':
            md_parts.append(f'\n{content}\n')
        elif btype == 'translation':
            md_parts.append(f'\n> {content}\n')
        elif btype in ('purport', 'purport_first'):
            md_parts.append(f'\n{content}\n')
        elif btype == 'verse_quote':
            md_parts.append(f'\n> *{content}*\n')
        elif btype == 'glossary_item':
            md_parts.append(f'\n- {content}\n')
        elif btype == 'publication_info':
            md_parts.append(f'\n{content}\n')

    return '\n'.join(md_parts)

# =============================================================================
# CLI
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description=f'BBT Parser v{VERSION} — Парсер для імпорту на сайт',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Приклади:
  %(prog)s input.H34 -f json                    # JSON блоків
  %(prog)s input.H34 -f json -s                 # Структурований JSON
  %(prog)s input.H34 -f html -o chapter.html    # HTML файл
  %(prog)s input.H34 -f html --devanagari       # HTML з деванагарі
  %(prog)s --batch input_dir/ -f json out_dir/  # Batch конвертація
'''
    )

    parser.add_argument('input', help='Вхідний .H## файл або директорія')
    parser.add_argument('output', nargs='?', help='Вихідний файл або директорія (для batch)')

    parser.add_argument('-f', '--format',
                       choices=['json', 'html', 'markdown', 'md'],
                       default='json',
                       help='Формат виводу (default: json)')

    parser.add_argument('-s', '--structured',
                       action='store_true',
                       help='Структурований вивід (глави/вірші) для JSON')

    parser.add_argument('-o', '--output-file',
                       help='Вихідний файл')

    parser.add_argument('--devanagari',
                       action='store_true',
                       help='Включити деванагарі (Balaram) в HTML')

    parser.add_argument('--batch',
                       action='store_true',
                       help='Batch конвертація директорії')

    parser.add_argument('-v', '--version',
                       action='version',
                       version=f'%(prog)s {VERSION}')

    args = parser.parse_args()

    input_path = Path(args.input)

    # Визначаємо розширення
    ext_map = {'json': '.json', 'html': '.html', 'markdown': '.md', 'md': '.md'}
    ext = ext_map[args.format]

    if args.batch:
        # Batch режим
        output_dir = Path(args.output) if args.output else input_path.parent / 'output'
        output_dir.mkdir(parents=True, exist_ok=True)

        for h_file in sorted(input_path.glob('*.H*')):
            text = read_file(h_file)
            blocks = parse_blocks(text)

            if args.format == 'json':
                output = to_json(blocks, args.structured)
            elif args.format == 'html':
                output = to_html(blocks, args.devanagari)
            else:
                output = to_markdown(blocks)

            out_file = output_dir / (h_file.stem + ext)
            with open(out_file, 'w', encoding='utf-8') as f:
                f.write(output)
            print(f"✓ {h_file.name} → {out_file.name}")

        print(f"\nГотово! Файли збережено в {output_dir}")

    else:
        # Одиночний файл
        text = read_file(input_path)
        blocks = parse_blocks(text)

        if args.format == 'json':
            output = to_json(blocks, args.structured)
        elif args.format == 'html':
            output = to_html(blocks, args.devanagari)
        else:
            output = to_markdown(blocks)

        # Вивід
        out_file = args.output_file or args.output
        if out_file:
            with open(out_file, 'w', encoding='utf-8') as f:
                f.write(output)
            print(f"✓ Збережено: {out_file}")
        else:
            print(output)


if __name__ == '__main__':
    main()
