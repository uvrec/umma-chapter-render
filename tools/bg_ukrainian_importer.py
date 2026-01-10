#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Бгаґавад-ґіта імпортер — ТІЛЬКИ українська частина
НЕ чіпаємо санскрит (деванаґарі) та англійську!

Витягує:
- transliteration_ua (з @v-uvaca, @v-anustubh, @v-tristubh)
- synonyms_ua (з @eqs)
- translation_ua (з @translation)
- commentary_ua (з @p-indent, @p, @p0, @p1)

Використання:
    python bg_ukrainian_importer.py docs/UKBG02XT.H93 -o chapter2.json
    python bg_ukrainian_importer.py --batch docs/ -o output/

ПРАВИЛА ТРАНСЛІТЕРАЦІЇ (BBT Editorial Guidelines):
==================================================
PUA_MAP нижче конвертує Private Use Area символи в українську діакритику.
Правила синхронізовані з:
- tools/translit_normalizer.py - централізовані правила Python
- src/utils/text/transliteration.ts - IAST_TO_CYRILLIC маппінг (TypeScript)

Критичне правило: ī → ı̄ (dotless i U+0131 + combining macron U+0304)
Заборонені літери в результаті: є, и, ь, ю, я, ы, э

НОРМАЛІЗАЦІЯ ТЕКСТУ:
- tools/translit_normalizer.py - apply_ukrainian_rules()
- tools/pre_import_normalizer.py - mojibake, діакритика, апострофи
- src/utils/text/textNormalizationRules.ts - повний список правил
"""

import re
import json
import argparse
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field

# =============================================================================
# PUA MAPPING — українська транслітерація з діакритикою
# =============================================================================

UKRAINIAN_PUA_MAP: Dict[str, str] = {
    '\uf101': 'а̄',   # ā → а з макроном
    '\uf102': 'ı̄',   # ī → ı̄ (dotless i + макрон, БЕЗ крапки!)
    '\uf121': 'ı̄',   # ī → ı̄ (dotless i + макрон, БЕЗ крапки!)
    '\uf123': 'ӯ',   # ū → у з макроном
    '\uf115': 'р̣',   # ṛ → р з точкою знизу
    '\uf125': 'р̣̄',  # ṝ → р з точкою знизу та макроном
    '\uf127': 'л̣',   # ḷ → л з точкою знизу
    '\uf129': 'л̣̄',  # ḹ → л з точкою знизу та макроном
    '\uf10f': 'н̇',   # ṅ → н з точкою зверху
    '\uf113': 'н̃',   # ñ → н з тильдою
    '\uf111': 'н̣',   # ṇ → н з точкою знизу
    '\uf109': 'м̇',   # ṁ → м з точкою зверху (анусвара)
    '\uf119': 'т̣',   # ṭ → т з точкою знизу
    '\uf103': 'д̣',   # ḍ → д з точкою знизу
    '\uf11d': 'ш́',   # ś → ш з акутом (палатальний)
    '\uf11f': 'ш̣',   # ṣ → ш з точкою знизу (ретрофлексний)
    '\uf11b': 'х̣',   # ḥ → х з точкою знизу (вісарга)
    '\uf11c': 'Ш́',   # Ś → Ш з акутом (велика)
}

# =============================================================================
# DATA STRUCTURES
# =============================================================================

@dataclass
class Verse:
    """Вірш — тільки українські поля"""
    verse_number: str
    transliteration_ua: Optional[str] = None
    synonyms_ua: Optional[str] = None
    translation_ua: Optional[str] = None
    commentary_ua: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        d = {'verse_number': self.verse_number}
        if self.transliteration_ua:
            d['transliteration_ua'] = self.transliteration_ua
        if self.synonyms_ua:
            d['synonyms_ua'] = self.synonyms_ua
        if self.translation_ua:
            d['translation_ua'] = self.translation_ua
        if self.commentary_ua:
            d['commentary_ua'] = self.commentary_ua
        return d

@dataclass
class Chapter:
    """Глава"""
    chapter_number: int
    title_ua: str
    verses: List[Verse] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            'chapter_number': self.chapter_number,
            'title_ua': self.title_ua,
            'verses': [v.to_dict() for v in self.verses],
            'verse_count': len(self.verses)
        }


@dataclass
class IntroPage:
    """Вступна сторінка (Про автора, Передмова тощо)"""
    slug: str
    title_ua: str
    content_ua: str
    display_order: int = 0

    def to_dict(self) -> Dict[str, Any]:
        return {
            'slug': self.slug,
            'title_ua': self.title_ua,
            'content_ua': self.content_ua,
            'display_order': self.display_order
        }


# Маппінг файлів на slug та порядок відображення
# Порядок відповідає структурі книги BBT
INTRO_FILE_MAP = {
    # Передня частина
    'UKBG00DC': ('dedication', 'Посвята', 1),
    'UKBG00SS': ('background', 'Передісторія «Бгаґавад-ґіти»', 2),
    'UKBG00PF': ('preface', 'Передмова до англійського видання', 3),
    'UKBG00NT': ('note', 'Коментар до другого англійського видання', 4),
    'UKBG00ID': ('introduction', 'Вступ', 5),
    # Після глав
    'UKBG00DS': ('disciplic-succession', 'Ланцюг учнівської послідовності', 100),
    'UKBG00AU': ('about-author', 'Про автора', 101),
    'UKBG00KU': ('reviews', 'Відгуки про «Бгаґавад-ґіту як вона є»', 102),
    'UKBG00PG': ('pronunciation', 'Як читати санскрит', 103),
    'UKBG00GL': ('glossary', 'Словничок імен і термінів', 104),
    'UKBG00QV': ('verse-index', 'Покажчик цитованих віршів', 105),
    'UKBG00XS': ('sanskrit-index', 'Покажчик санскритських віршів', 106),
    'UKBG00RF': ('references', 'Список цитованої літератури', 107),
    'UKBG00BL': ('books', 'Книги Його Божественної Милості', 108),
    # Технічні сторінки (пропускаємо):
    # 'UKBG00HT': Half-title page
    # 'UKBG00TP': Title page
    # 'UKBG00PI': Publication info
    # 'UKBG00CR': Copyright
    # 'UKBG00TC': Зміст (динамічно на сайті)
    # 'UKBG00AP': Appendix/Додатки
    # 'UKBG00BB': порожній
}

# =============================================================================
# TEXT PROCESSING
# =============================================================================

def decode_pua(text: str) -> str:
    """Замінює PUA символи на українську діакритику"""
    for pua, uni in UKRAINIAN_PUA_MAP.items():
        text = text.replace(pua, uni)
    return text


def process_line_continuations(text: str) -> str:
    """Обробляє <-> та <&> теги переносу"""
    lines = text.split('\n')
    result = []
    buffer = ""

    for line in lines:
        line_stripped = line.rstrip()

        # <-> = м'який перенос
        if line_stripped.endswith('<->'):
            line = line_stripped[:-3]
            if line.endswith('-'):
                line = line[:-1]
            buffer += line
        # -<&> = перенос з дефісом
        elif line_stripped.endswith('-<&>'):
            buffer += line_stripped[:-4]
        # <&> = простий перенос
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


def process_inline_tags(text: str, keep_html: bool = False) -> str:
    """
    Обробляє Ventura теги розмітки.

    Args:
        text: вхідний текст
        keep_html: якщо True, зберігає HTML теги <em> та <strong>
    """

    # Переноси рядків
    text = process_line_continuations(text)

    # Unicode escapes
    text = text.replace('<u003C>', '<')

    # Пробіли та переноси
    text = re.sub(r'<->\s*', '', text)
    text = re.sub(r'<&>\s*', '', text)
    text = re.sub(r'<_?R>', '\n', text)
    text = re.sub(r'<N\|?>', '', text)
    text = re.sub(r'<S>', ' ', text)
    text = re.sub(r'<_>', ' ', text)

    # Однобуквенні прийменники
    text = re.sub(r'<_oneletter>([^<]*)<_N>', r'\1 ', text)

    if keep_html:
        # Bold + Italic → <strong><em>...</em></strong>
        text = re.sub(r'<BI>([^<]*)</?D>', r'<strong><em>\1</em></strong>', text)

        # Bold → <strong>...</strong>
        text = re.sub(r'<B>([^<]*)</?D>', r'<strong>\1</strong>', text)
        text = re.sub(r'<B>', '<strong>', text)

        # Italic → <em>...</em>
        text = re.sub(r'<MI>([^<]*)</?D>', r'<em>\1</em>', text)
        text = re.sub(r'<MI>', '<em>', text)
        text = re.sub(r'</?D>', '</em>', text)

        # Прибираємо italic/bold з розділових знаків
        # </em> <em>, → ,  (виносимо кому за тег)
        text = re.sub(r'</em>\s*<em>([,.\;:])', r'</em>\1', text)
        text = re.sub(r'</strong>\s*<strong>([,.\;:])', r'</strong>\1', text)

        # Прибираємо пусті теги
        text = re.sub(r'<em></em>', '', text)
        text = re.sub(r'<strong></strong>', '', text)
        text = re.sub(r'</em>\s*<em>', ' ', text)
        text = re.sub(r'</strong>\s*<strong>', ' ', text)

        # Прибираємо пробіли перед закриваючими тегами
        text = re.sub(r'\s+</em>', '</em>', text)
        text = re.sub(r'\s+</strong>', '</strong>', text)

        # Видаляємо пусті теги знову
        text = re.sub(r'<em></em>', '', text)
        text = re.sub(r'<strong></strong>', '', text)
    else:
        # Bold + Italic → просто текст
        text = re.sub(r'<BI>([^<]*)</?D>', r'\1', text)

        # Bold → просто текст
        text = re.sub(r'<B>([^<]*)</?D>', r'\1', text)
        text = re.sub(r'<B>', '', text)

        # Italic → просто текст
        text = re.sub(r'<MI>([^<]*)</?D>', r'\1', text)
        text = re.sub(r'<MI>', '', text)
        text = re.sub(r'</?D>', '', text)

    # Заголовки книг <_bt>...<_/bt> → «...»
    text = re.sub(r'<_bt>([^<]*)<_/bt>', r'«\1»', text)

    # Лапки <_qm>...</_qm> → просто прибираємо теги, лапки вже є в тексті
    text = re.sub(r'<_qm>', '', text)
    text = re.sub(r'</_qm>', '', text)

    # Терміни (для синонімів)
    text = re.sub(r'<_dt>([^<]*)<_/dt>', r'\1', text)
    text = re.sub(r'<_dt>|<_/dt>', '', text)
    text = re.sub(r'<_dd>|<_/dd>', '', text)

    # Слеш
    text = re.sub(r'<_slash>/<_/slash>', '/', text)

    # Monospace — ігноруємо
    text = re.sub(r'<mon>[^<]*</mon>', '', text)

    # Decode PUA
    text = decode_pua(text)

    # Прибираємо залишкові Ventura теги (але не HTML якщо keep_html)
    if keep_html:
        # Прибираємо тільки Ventura теги, не HTML
        text = re.sub(r'<(?!/?(?:em|strong|br))[^>]*>', '', text)
    else:
        text = re.sub(r'<[^>]*>', '', text)

    # Нормалізація пробілів
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n', '\n\n', text)

    return text.strip()


def process_synonyms(text: str) -> str:
    """
    Обробляє синоніми (послівний переклад).
    Формат виводу: термін — переклад; термін — переклад; ...
    """
    text = process_line_continuations(text)

    # Об'єднуємо рядки в один
    text = ' '.join(text.split('\n'))

    # Конвертуємо структуру <_dt>...<_/dt> <_dd>...<_/dd> → термін — переклад
    # Pattern: <MI><_dt>term<_/dt><D> <_dd>meaning<_/dd>
    text = re.sub(
        r'<MI><_dt>([^<]*)<_/dt><D>\s*<_dd>([^<]*)<_/dd>',
        r'\1 — \2',
        text
    )
    # Pattern: <_dt>term<_/dt> <_dd>meaning<_/dd>
    text = re.sub(
        r'<_dt>([^<]*)<_/dt>\s*<_dd>([^<]*)<_/dd>',
        r'\1 — \2',
        text
    )

    # Загальна обробка тегів
    text = process_inline_tags(text, keep_html=False)

    # Нормалізація пробілів
    text = re.sub(r'\s+', ' ', text).strip()

    # Замінюємо різні дефіси на em-dash
    text = text.replace(' – ', ' — ')
    text = text.replace(' - ', ' — ')

    return text


def process_prose(text: str, keep_html: bool = False) -> str:
    """Обробляє прозу (переклад, коментар)"""
    text = process_line_continuations(text)

    # Об'єднуємо рядки в один
    text = ' '.join(text.split('\n'))

    # Загальна обробка тегів
    text = process_inline_tags(text, keep_html=keep_html)

    # Нормалізація пробілів
    text = re.sub(r'\s+', ' ', text).strip()

    return text


def process_transliteration(text: str) -> str:
    """Обробляє транслітерацію (віршові рядки)"""
    text = process_line_continuations(text)

    # Переноси рядків у вірші
    text = text.replace('<_R><_>', '\n')
    text = text.replace('<R>', '\n')
    text = text.replace('<_>', ' ')

    # Загальна обробка тегів
    text = process_inline_tags(text)

    # Зберігаємо рядки окремо
    lines = [line.strip() for line in text.split('\n') if line.strip()]

    return '\n'.join(lines)


def extract_verse_number(text: str) -> str:
    """Витягує номер вірша з тексту"""
    # "Вірш 1" → "1"
    # "Вірші 5-6" → "5-6"
    match = re.search(r'(?:Вірш[иі]?|ВІРШ[ИІ]?)\s*(\d+(?:\s*[-–]\s*\d+)?)', text, re.IGNORECASE)
    if match:
        return re.sub(r'\s+', '', match.group(1))

    # Якщо просто число
    match = re.search(r'(\d+(?:\s*[-–]\s*\d+)?)', text)
    if match:
        return re.sub(r'\s+', '', match.group(1))

    return text.strip()


def extract_chapter_number(text: str) -> int:
    """Витягує номер глави"""
    # Нормалізуємо апострофи
    text_norm = text.upper()
    text_norm = text_norm.replace('ʼ', "'")  # U+02BC → '
    text_norm = text_norm.replace('\u2019', "'")  # U+2019 → '
    text_norm = text_norm.replace('`', "'")  # backtick → '

    # Порядкові числівники (від довших до коротших, щоб уникнути помилок типу ВІСІМНАДЦЯТА → СІМНАДЦЯТА)
    ordinals = [
        ('ВІСІМНАДЦЯТА', 18), ('СІМНАДЦЯТА', 17), ('ШІСТНАДЦЯТА', 16), ("П'ЯТНАДЦЯТА", 15),
        ('ЧОТИРНАДЦЯТА', 14), ('ТРИНАДЦЯТА', 13), ('ДВАНАДЦЯТА', 12), ('ОДИНАДЦЯТА', 11),
        ('ДЕСЯТА', 10), ("ДЕВ'ЯТА", 9), ('ВОСЬМА', 8), ("С'ОМА", 7), ('СЬОМА', 7),
        ('ШОСТА', 6), ("П'ЯТА", 5), ('ЧЕТВЕРТА', 4), ('ТРЕТЯ', 3), ('ДРУГА', 2), ('ПЕРША', 1)
    ]

    for name, num in ordinals:
        if name in text_norm:
            return num

    # Арабські числа
    match = re.search(r'(\d+)', text)
    if match:
        return int(match.group(1))

    return 0


# =============================================================================
# PARSER
# =============================================================================

# Теги, які пропускаємо
SKIP_TAGS = {'rh-verso', 'rh-recto', 'logo', 'text-rh', 'special'}

# Теги деванаґарі — НЕ ЧІПАЄМО!
DEVANAGARI_TAGS = {'d-uvaca', 'd-anustubh', 'd-tristubh'}


def read_file(filepath: Path) -> str:
    """Читає файл з автовизначенням кодування"""
    with open(filepath, 'rb') as f:
        content = f.read()

    # Спроба UTF-16LE (типовий формат BBT)
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


def parse_ventura(text: str) -> Chapter:
    """Парсить Ventura файл і витягує тільки українські дані"""

    lines = text.split('\n')

    chapter_number = 0
    chapter_title = ""
    verses: List[Verse] = []
    current_verse: Optional[Verse] = None

    current_tag = None
    current_content: List[str] = []

    def flush_block():
        nonlocal chapter_number, chapter_title, current_verse

        if not current_tag or current_tag in SKIP_TAGS:
            return

        # Деванаґарі — пропускаємо!
        if current_tag in DEVANAGARI_TAGS:
            return

        content = ' '.join(current_content).strip()
        if not content:
            return

        # Номер глави
        if current_tag == 'h1-number':
            chapter_number = extract_chapter_number(content)

        # Назва глави
        elif current_tag == 'h1':
            chapter_title = process_inline_tags(content)

        # Номер вірша
        elif current_tag in ('h2-number', 'h2-number-2', 'ch'):
            if current_verse:
                verses.append(current_verse)
            verse_num = extract_verse_number(content)
            current_verse = Verse(verse_number=verse_num)

        # Транслітерація (українська!)
        elif current_tag in ('v-uvaca', 'v-anustubh', 'v-tristubh'):
            if current_verse:
                translit = process_transliteration(content)
                if current_verse.transliteration_ua:
                    current_verse.transliteration_ua += '\n' + translit
                else:
                    current_verse.transliteration_ua = translit

        # Синоніми
        elif current_tag == 'eqs':
            if current_verse:
                synonyms = process_synonyms(content)
                if current_verse.synonyms_ua:
                    current_verse.synonyms_ua += ' ' + synonyms
                else:
                    current_verse.synonyms_ua = synonyms

        # Переклад
        elif current_tag == 'translation':
            if current_verse:
                current_verse.translation_ua = process_prose(content, keep_html=False)

        # Коментар — зберігаємо HTML форматування
        elif current_tag in ('p-indent', 'p', 'p0', 'p1'):
            if current_verse:
                para = process_prose(content, keep_html=True)
                if para:
                    if current_verse.commentary_ua:
                        current_verse.commentary_ua += '\n\n' + para
                    else:
                        current_verse.commentary_ua = para

    # Парсимо рядки
    for line in lines:
        line = line.rstrip()

        if line.startswith('@') and ' = ' in line:
            # Зберігаємо попередній блок
            flush_block()

            # Новий блок
            match = re.match(r'@([\w-]+)\s*=\s*(.*)', line)
            if match:
                current_tag = match.group(1)
                c = match.group(2).strip()
                current_content = [c] if c else []
        elif current_tag and line:
            current_content.append(line)

    # Останній блок
    flush_block()

    # Останній вірш
    if current_verse:
        verses.append(current_verse)

    return Chapter(
        chapter_number=chapter_number,
        title_ua=chapter_title,
        verses=verses
    )


def parse_intro_page(text: str, file_prefix: str) -> Optional[IntroPage]:
    """Парсить вступну сторінку (Про автора, Передмова тощо)"""

    # Отримуємо інформацію з маппінгу
    if file_prefix not in INTRO_FILE_MAP:
        return None

    slug, default_title, display_order = INTRO_FILE_MAP[file_prefix]

    lines = text.split('\n')
    title = default_title
    paragraphs: List[str] = []

    # Для нумерованих списків
    current_list_number = None

    current_tag = None
    current_content: List[str] = []

    def flush_block():
        nonlocal title, paragraphs, current_list_number

        if not current_tag:
            return

        content = ' '.join(current_content).strip()
        if not content:
            return

        # Заголовки (різні варіанти)
        if current_tag in ('h1-fb', 'h1', 'h1-pg', 'h1-rv', 'h1-bl', 'h1-ds'):
            title = process_prose(content, keep_html=False)
            # Прибираємо можливі переноси рядків у заголовку
            title = ' '.join(title.split())

        # Підзаголовки
        elif current_tag in ('h2', 'h2-gl', 'h2-rv'):
            sub = process_prose(content, keep_html=True)
            if sub:
                paragraphs.append(f'<strong>{sub}</strong>')

        # Абзаци — зберігаємо HTML
        elif current_tag in ('p0', 'p', 'p1', 'p-indent', 'p-gl', 'p-au', 'p-rv', 'p-bl', 'p0-ku', 'p1-ku'):
            para = process_prose(content, keep_html=True)
            if para:
                paragraphs.append(para)

        # Підписи (відгуки)
        elif current_tag == 'ku-signature':
            sig = process_prose(content, keep_html=True)
            if sig:
                # Замінюємо переноси рядків на <br>
                sig = sig.replace('\n', '<br>')
                paragraphs.append(f'<p class="signature"><em>{sig}</em></p>')

        # Посвята (dc тег)
        elif current_tag == 'dc':
            # Спеціальне форматування для посвяти
            para = process_prose(content, keep_html=True)
            if para:
                # Замінюємо переноси рядків на <br>
                para = para.replace('\n', '<br>')
                paragraphs.append(f'<p class="dedication">{para}</p>')

        # Нумеровані списки (ланцюг учнівської послідовності)
        elif current_tag in ('li-number', 'li-number-0'):
            # Зберігаємо номер для наступного li-p
            num = process_prose(content, keep_html=False).strip()
            # Витягуємо тільки число
            num_match = re.search(r'(\d+)', num)
            current_list_number = num_match.group(1) if num_match else num

        elif current_tag == 'li-p':
            item = process_prose(content, keep_html=True)
            if item:
                if current_list_number:
                    paragraphs.append(f'{current_list_number}. {item}')
                else:
                    paragraphs.append(f'• {item}')
            current_list_number = None

        # Словникові статті (glossary)
        elif current_tag == 'li-gl':
            # Формат: <_dt>термін<_/dt><D> <_dd>значення<_/dd>
            item = process_synonyms(content)
            if item:
                paragraphs.append(item)

        # Список книг
        elif current_tag == 'li-bl':
            item = process_prose(content, keep_html=True)
            if item:
                paragraphs.append(f'• {item}')

        # Вступ до покажчика
        elif current_tag in ('intro-qv', 'intro-xs'):
            intro_text = process_prose(content, keep_html=True)
            if intro_text:
                paragraphs.append(intro_text)

        # Покажчик цитованих віршів та санскритських віршів
        elif current_tag in ('li-qv', 'li-xs'):
            item = process_prose(content, keep_html=True)
            if item:
                paragraphs.append(item)

        # Блоки цитат
        elif current_tag in ('ql', 'q', 'q-p'):
            quote = process_prose(content, keep_html=True)
            if quote:
                paragraphs.append(f'<blockquote>{quote}</blockquote>')

    # Парсимо рядки
    for line in lines:
        line = line.rstrip()

        if line.startswith('@') and ' = ' in line:
            flush_block()

            match = re.match(r'@([\w-]+)\s*=\s*(.*)', line)
            if match:
                current_tag = match.group(1)
                c = match.group(2).strip()
                current_content = [c] if c else []
        elif current_tag and line:
            current_content.append(line)

    # Останній блок
    flush_block()

    if not paragraphs:
        return None

    # Об'єднуємо параграфи з \n\n
    content_ua = '\n\n'.join(paragraphs)

    return IntroPage(
        slug=slug,
        title_ua=title,
        content_ua=content_ua,
        display_order=display_order
    )


# =============================================================================
# CLI
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description='Бгаґавад-ґіта імпортер — ТІЛЬКИ українська частина',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Приклади:
  %(prog)s docs/UKBG02XT.H93                      # Глава - вивід у stdout
  %(prog)s docs/UKBG02XT.H93 -o chapter2.json     # Зберегти у файл
  %(prog)s --batch docs/ -o output/               # Batch конвертація глав
  %(prog)s --intro docs/UKBG00PF.H29              # Вступна сторінка
  %(prog)s --batch --intro docs/ -o output/       # Batch конвертація intro
  %(prog)s --batch --all docs/ -o output/         # Все (глави + intro)
'''
    )

    parser.add_argument('input', nargs='?', help='Вхідний .H## файл')
    parser.add_argument('-o', '--output', help='Вихідний файл або директорія')
    parser.add_argument('--batch', action='store_true', help='Batch режим')
    parser.add_argument('--intro', action='store_true', help='Обробляти intro файли (UKBG00*.H*)')
    parser.add_argument('--all', action='store_true', help='Обробляти всі файли (глави + intro)')
    parser.add_argument('--format', choices=['json', 'sql'], default='json',
                        help='Формат виводу (default: json)')
    parser.add_argument('--pretty', action='store_true', help='Гарне форматування JSON')
    parser.add_argument('--stats', action='store_true', help='Показати статистику')

    args = parser.parse_args()

    if args.batch:
        # Batch режим
        input_dir = Path(args.input) if args.input else Path('docs')
        output_dir = Path(args.output) if args.output else input_dir / 'output'
        output_dir.mkdir(parents=True, exist_ok=True)

        total_verses = 0
        total_intro = 0

        # Обробка глав (якщо не --intro або --all)
        if not args.intro or args.all:
            for h_file in sorted(input_dir.glob('UKBG*XT.H*')):
                text = read_file(h_file)
                chapter = parse_ventura(text)

                if chapter.verses:
                    out_file = output_dir / f'chapter{chapter.chapter_number:02d}.json'
                    indent = 2 if args.pretty else None
                    with open(out_file, 'w', encoding='utf-8') as f:
                        json.dump(chapter.to_dict(), f, ensure_ascii=False, indent=indent)

                    print(f"✓ {h_file.name} → {out_file.name} ({len(chapter.verses)} віршів)")
                    total_verses += len(chapter.verses)

            if total_verses:
                print(f"\nГлави: {total_verses} віршів")

        # Обробка intro файлів (якщо --intro або --all)
        if args.intro or args.all:
            intro_dir = output_dir / 'intro_pages'
            intro_dir.mkdir(parents=True, exist_ok=True)

            for h_file in sorted(input_dir.glob('UKBG00*.H*')):
                # Витягуємо префікс файлу (UKBG00XX)
                file_prefix = h_file.stem.split('.')[0]
                if len(file_prefix) > 8:
                    file_prefix = file_prefix[:8]

                text = read_file(h_file)
                intro = parse_intro_page(text, file_prefix)

                if intro:
                    out_file = intro_dir / f'{intro.slug}.json'
                    indent = 2 if args.pretty else None
                    with open(out_file, 'w', encoding='utf-8') as f:
                        json.dump(intro.to_dict(), f, ensure_ascii=False, indent=indent)

                    para_count = intro.content_ua.count('\n\n') + 1
                    print(f"✓ {h_file.name} → intro_pages/{intro.slug}.json ({para_count} параграфів)")
                    total_intro += 1
                else:
                    if file_prefix in INTRO_FILE_MAP:
                        print(f"⚠ {h_file.name} — порожній контент")
                    # Файли не в маппінгу просто пропускаємо

            if total_intro:
                print(f"\nВступні сторінки: {total_intro} файлів")

        if args.all:
            print(f"\n=== ГОТОВО ===")
            print(f"Глави: {total_verses} віршів")
            print(f"Intro: {total_intro} сторінок")

    else:
        # Одиночний файл
        if not args.input:
            parser.print_help()
            return

        input_path = Path(args.input)
        text = read_file(input_path)

        if args.intro:
            # Intro файл
            file_prefix = input_path.stem.split('.')[0]
            if len(file_prefix) > 8:
                file_prefix = file_prefix[:8]

            intro = parse_intro_page(text, file_prefix)

            if not intro:
                print(f"Помилка: файл {file_prefix} не знайдено в INTRO_FILE_MAP")
                return

            if args.stats:
                print(f"Slug: {intro.slug}")
                print(f"Заголовок: {intro.title_ua}")
                print(f"Порядок: {intro.display_order}")
                print(f"Параграфів: {intro.content_ua.count(chr(10)+chr(10)) + 1}")
                print(f"\n--- Контент (перші 500 символів) ---")
                print(intro.content_ua[:500])
                return

            indent = 2 if args.pretty else None
            output = json.dumps(intro.to_dict(), ensure_ascii=False, indent=indent)

            if args.output:
                with open(args.output, 'w', encoding='utf-8') as f:
                    f.write(output)
                print(f"✓ Збережено: {args.output}")
            else:
                print(output)

        else:
            # Глава
            chapter = parse_ventura(text)

            if args.stats:
                print(f"Глава {chapter.chapter_number}: {chapter.title_ua}")
                print(f"Віршів: {len(chapter.verses)}")
                for v in chapter.verses:
                    print(f"  {v.verse_number}: ", end='')
                    parts = []
                    if v.transliteration_ua:
                        parts.append('транслітерація')
                    if v.synonyms_ua:
                        parts.append('синоніми')
                    if v.translation_ua:
                        parts.append('переклад')
                    if v.commentary_ua:
                        parts.append(f'коментар ({len(v.commentary_ua)} символів)')
                    print(', '.join(parts) if parts else '(порожній)')
                return

            indent = 2 if args.pretty else None
            output = json.dumps(chapter.to_dict(), ensure_ascii=False, indent=indent)

            if args.output:
                with open(args.output, 'w', encoding='utf-8') as f:
                    f.write(output)
                print(f"✓ Збережено: {args.output}")
            else:
                print(output)


if __name__ == '__main__':
    main()
