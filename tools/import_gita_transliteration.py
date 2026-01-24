#!/usr/bin/env python3
"""
Імпорт транслітерації Bhagavad-gita з ePUB → Supabase

Парсить EN_BG_1972_epub_r2.epub і:
1. Витягує IAST транслітерацію (transliteration_en)
2. Конвертує IAST → українську кирилицю (transliteration_uk)
3. UPSERT в базу verses

Використання:
    python3 import_gita_transliteration.py --epub EN_BG_1972_epub_r2.epub --dry-run
    python3 import_gita_transliteration.py --epub EN_BG_1972_epub_r2.epub --chapter 2
    python3 import_gita_transliteration.py --epub EN_BG_1972_epub_r2.epub

ПРАВИЛА ТРАНСЛІТЕРАЦІЇ (BBT Editorial Guidelines):
==================================================
Правила IAST → Українська кирилиця синхронізовані з:
- tools/translit_normalizer.py - централізовані правила Python
- src/utils/text/transliteration.ts - IAST_TO_CYRILLIC маппінг (TypeScript)
- src/utils/text/textNormalizationRules.ts - правила нормалізації

Критичне правило: ī → ı̄ (dotless i U+0131 + combining macron U+0304)
Заборонені літери в результаті: є, и, ь, ю, я, ы, э

НОРМАЛІЗАЦІЯ ТЕКСТУ:
- tools/translit_normalizer.py - apply_ukrainian_rules()
- tools/pre_import_normalizer.py - mojibake, діакритика, апострофи
- src/utils/text/textNormalizationRules.ts - повний список правил

МАППІНГ ПОЛІВ (для джерел EN + Sanskrit/Bengali):
=================================================
- sanskrit_en / sanskrit_uk — Bengali/Sanskrit (Devanagari script), однаковий вміст
- transliteration_en — IAST транслітерація (латинка з діакритикою)
- transliteration_uk — українська кирилична транслітерація з діакритикою
  (конвертується з IAST за допомогою tools/translit_normalizer.py)
- translation_en / purport_en — англійський переклад та пояснення
- translation_uk / purport_uk — український переклад та пояснення
"""

import argparse
import re
import os
import sys
import zipfile
from dataclasses import dataclass
from typing import List, Optional, Dict
from bs4 import BeautifulSoup

# ============================================================================
# IAST → Українська конвертація
# ============================================================================

def convert_iast_to_ukrainian(text: str) -> str:
    """
    Конвертує IAST транслітерацію в українську кирилицю з діакритикою.
    Базується на textNormalizer.ts
    """
    if not text:
        return text
    
    # Unicode нормалізація
    import unicodedata
    text = unicodedata.normalize('NFC', text)
    
    # Паттерни заміни (від довших до коротших)
    patterns = {
        # 3+ символи
        'nya': 'нйа',
        'nye': 'нйе', 
        'nyi': 'нйі',
        'nyo': 'нйо',
        'nyu': 'нйу',
        'jjh': 'жджх',
        
        # Довгі голосні (precomposed)
        'yā': 'йа̄',
        'yī': 'йı̄',  # yī → йı̄ (dotless i + макрон, БЕЗ крапки!)
        'yū': 'йӯ',
        'ā': 'а̄',
        'ī': 'ı̄',  # ī → ı̄ (dotless i + макрон, БЕЗ крапки!)
        'ū': 'ӯ',
        'ṝ': 'р̣̄',
        'ḹ': 'л̣̄',
        'ṭ': 'т̣',
        'ḍ': 'д̣',
        'ṇ': 'н̣',
        'ṣ': 'ш',
        'ṛ': 'р̣',
        'ś': 'ш́',
        'ñ': 'н̃',
        'ṅ': 'н̇',
        'ṁ': 'м̇',
        'ṃ': 'м̣',
        'ḥ': 'х̣',
        'ḷ': 'л̣',
        
        # Великі літери
        'Ā': 'А̄',
        'Ī': 'Ī',  # Ī → Ī (велика I + макрон, БЕЗ крапки!)
        'Ū': 'Ӯ',
        
        # 2 символи - придихові
        'bh': 'бг',
        'gh': 'ґг',
        'dh': 'дг',
        'th': 'тх',
        'ph': 'пх',
        'kh': 'кх',
        'ch': 'чх',
        'jh': 'джх',
        'sh': 'сх',
        'kṣ': 'кш',
        'jñ': 'джн̃',
        
        # Дифтонги
        'ai': 'аі',
        'au': 'ау',
        
        # Прості приголосні
        'k': 'к',
        'g': 'ґ',
        'c': 'ч',
        'j': 'дж',
        't': 'т',
        'd': 'д',
        'p': 'п',
        'b': 'б',
        'y': 'й',
        'r': 'р',
        'l': 'л',
        'v': 'в',
        'w': 'в',
        'h': 'х',
        'm': 'м',
        'n': 'н',
        's': 'с',
        
        # Великі приголосні
        'K': 'К',
        'G': 'Ґ',
        'C': 'Ч',
        'J': 'Дж',
        'T': 'Т',
        'D': 'Д',
        'P': 'П',
        'B': 'Б',
        'Y': 'Й',
        'R': 'Р',
        'L': 'Л',
        'V': 'В',
        'W': 'В',
        'H': 'Х',
        'M': 'М',
        'N': 'Н',
        'S': 'С',
        
        # Прості голосні
        'a': 'а',
        'i': 'і',
        'u': 'у',
        'e': 'е',
        'o': 'о',
        'A': 'А',
        'I': 'І',
        'U': 'У',
        'E': 'Е',
        'O': 'О',
    }
    
    result = []
    i = 0
    
    while i < len(text):
        matched = False
        
        # Пробуємо найдовші підрядки першими (3, 2, 1)
        for length in [3, 2, 1]:
            if i + length <= len(text):
                substr = text[i:i + length]
                if substr in patterns:
                    result.append(patterns[substr])
                    i += length
                    matched = True
                    break
        
        if not matched:
            result.append(text[i])
            i += 1
    
    return ''.join(result)


@dataclass
class ParsedVerse:
    """Структура для вірша"""
    chapter_number: int
    verse_number: str  # "1", "2", "16-18"
    transliteration_en: str
    transliteration_uk: str


def extract_verses_from_chapter(html_content: str, chapter_number: int) -> List[ParsedVerse]:
    """Парсить вірші з HTML глави"""
    soup = BeautifulSoup(html_content, 'html.parser')
    verses = []
    
    # Знаходимо всі блоки TEXT N
    text_divs = soup.find_all('div', class_='text')
    
    for text_div in text_divs:
        # Витягуємо номер вірша
        text_content = text_div.get_text()
        match = re.search(r'TEXT\s+(\d+(?:\s*[-–—]\s*\d+)?)', text_content, re.I)
        if not match:
            continue
        
        verse_number = match.group(1).replace(' ', '').replace('–', '-').replace('—', '-')
        
        # Знаходимо наступний div.sans (транслітерація)
        # Може бути sans-uvaca перед основним sans
        current = text_div.find_next_sibling()
        transliteration_parts = []
        
        while current:
            if current.name == 'div':
                css_class = current.get('class', [])
                
                # Якщо наступний TEXT - зупиняємось
                if 'text' in css_class:
                    break
                
                # sans-uvaca (наприклад "śrī-bhagavān uvāca")
                if 'sans-uvaca' in css_class:
                    uvaca_text = current.get_text().strip()
                    if uvaca_text:
                        transliteration_parts.append(uvaca_text)
                
                # Основний sans блок
                elif 'sans' in css_class:
                    # Витягуємо текст, зберігаючи переноси рядків
                    # Замінюємо <br> на \n
                    for br in current.find_all('br'):
                        br.replace_with('\n')
                    
                    sans_text = current.get_text().strip()
                    # Очищуємо зайві пробіли
                    sans_text = re.sub(r'[\u2002\u2003]+', ' ', sans_text)  # en-space, em-space
                    sans_text = re.sub(r' +', ' ', sans_text)
                    
                    if sans_text:
                        transliteration_parts.append(sans_text)
                    break  # Після основного sans виходимо
            
            current = current.find_next_sibling()
        
        if transliteration_parts:
            transliteration_en = '\n'.join(transliteration_parts)
            transliteration_uk = convert_iast_to_ukrainian(transliteration_en)
            
            verses.append(ParsedVerse(
                chapter_number=chapter_number,
                verse_number=verse_number,
                transliteration_en=transliteration_en,
                transliteration_uk=transliteration_uk,
            ))
    
    return verses


def parse_epub(epub_path: str, chapter_filter: Optional[int] = None) -> List[ParsedVerse]:
    """Парсить ePUB і повертає список віршів"""
    all_verses = []
    
    with zipfile.ZipFile(epub_path, 'r') as zf:
        # Шукаємо файли глав: ENBG01XT.XML ... ENBG18XT.XML
        for i in range(1, 19):
            if chapter_filter and i != chapter_filter:
                continue
            
            filename = f'OEBPS/ENBG{i:02d}XT.XML'
            
            try:
                with zf.open(filename) as f:
                    html_content = f.read().decode('utf-8')
                    verses = extract_verses_from_chapter(html_content, i)
                    all_verses.extend(verses)
                    print(f"📖 Глава {i}: знайдено {len(verses)} віршів")
            except KeyError:
                print(f"⚠️  Файл {filename} не знайдено")
    
    return all_verses


def save_to_supabase(verses: List[ParsedVerse], dry_run: bool = False):
    """Зберігає вірші в Supabase"""
    
    if dry_run:
        print("\n🔍 DRY RUN - зміни не будуть збережені в БД")
        print("\nПриклади (перші 5 віршів):")
        for v in verses[:5]:
            print(f"\n--- Глава {v.chapter_number}, Вірш {v.verse_number} ---")
            print(f"EN: {v.transliteration_en[:100]}...")
            print(f"UA: {v.transliteration_uk[:100]}...")
        return
    
    # Імпорт Supabase
    try:
        from supabase import create_client
    except ImportError:
        print("❌ Встановіть supabase: pip install supabase")
        sys.exit(1)
    
    SUPABASE_URL = os.getenv('SUPABASE_URL', '')
    SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY', '')
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Встановіть змінні середовища SUPABASE_URL та SUPABASE_SERVICE_KEY")
        sys.exit(1)
    
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Отримуємо book_id для gita
    book_result = supabase.table('books').select('id').eq('slug', 'gita').single().execute()
    if not book_result.data:
        print("❌ Книга 'gita' не знайдена в БД")
        sys.exit(1)
    
    book_id = book_result.data['id']
    print(f"📚 Книга gita: {book_id}")
    
    # Отримуємо всі глави
    chapters_result = supabase.table('chapters').select('id, chapter_number').eq('book_id', book_id).execute()
    chapters_map = {ch['chapter_number']: ch['id'] for ch in chapters_result.data}
    
    updated = 0
    errors = 0
    
    for verse in verses:
        chapter_id = chapters_map.get(verse.chapter_number)
        if not chapter_id:
            print(f"⚠️  Глава {verse.chapter_number} не знайдена")
            errors += 1
            continue
        
        # UPSERT: оновлюємо тільки transliteration_en та transliteration_uk
        try:
            # Знаходимо вірш за chapter_id та verse_number
            verse_result = supabase.table('verses').select('id').eq('chapter_id', chapter_id).eq('verse_number', verse.verse_number).execute()
            
            if verse_result.data:
                # Оновлюємо існуючий
                verse_id = verse_result.data[0]['id']
                supabase.table('verses').update({
                    'transliteration_en': verse.transliteration_en,
                    'transliteration_uk': verse.transliteration_uk,
                }).eq('id', verse_id).execute()
                updated += 1
                print(f"✅ Оновлено: {verse.chapter_number}.{verse.verse_number}")
            else:
                print(f"⚠️  Вірш {verse.chapter_number}.{verse.verse_number} не знайдено в БД")
                errors += 1
        except Exception as e:
            print(f"❌ Помилка для {verse.chapter_number}.{verse.verse_number}: {e}")
            errors += 1
    
    print(f"\n✅ Оновлено: {updated}")
    print(f"❌ Помилок: {errors}")


def main():
    parser = argparse.ArgumentParser(description='Імпорт транслітерації Gita з ePUB')
    parser.add_argument('--epub', required=True, help='Шлях до ePUB файлу')
    parser.add_argument('--chapter', type=int, help='Номер глави (1-18), якщо не вказано - всі')
    parser.add_argument('--dry-run', action='store_true', help='Тільки парсинг без збереження в БД')
    
    args = parser.parse_args()
    
    if not os.path.exists(args.epub):
        print(f"❌ Файл не знайдено: {args.epub}")
        sys.exit(1)
    
    print(f"📚 Парсинг ePUB: {args.epub}")
    
    verses = parse_epub(args.epub, args.chapter)
    
    print(f"\n✅ Всього знайдено {len(verses)} віршів з транслітерацією")
    
    save_to_supabase(verses, args.dry_run)
    
    print("\n✅ Готово!")


if __name__ == '__main__':
    main()
