#!/usr/bin/env python3
"""
Імпорт транслітерації Bhagavad-gita з ePUB → Supabase

Парсить EN_BG_1972_epub_r2.epub і:
1. Витягує IAST транслітерацію (transliteration_en)
2. Конвертує IAST → українську кирилицю (transliteration_ua)
3. UPSERT в базу verses

Використання:
    python3 import_gita_transliteration.py --epub EN_BG_1972_epub_r2.epub --dry-run
    python3 import_gita_transliteration.py --epub EN_BG_1972_epub_r2.epub --chapter 2
    python3 import_gita_transliteration.py --epub EN_BG_1972_epub_r2.epub
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
        'yī': 'йī',
        'yū': 'йӯ',
        'ā': 'а̄',
        'ī': 'ī',
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
        'Ī': 'Ī',
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
    transliteration_ua: str


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
            transliteration_ua = convert_iast_to_ukrainian(transliteration_en)
            
            verses.append(ParsedVerse(
                chapter_number=chapter_number,
                verse_number=verse_number,
                transliteration_en=transliteration_en,
                transliteration_ua=transliteration_ua,
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
    import requests

    if dry_run:
        print("\n🔍 DRY RUN - зміни не будуть збережені в БД")
        print("\nПриклади (перші 5 віршів):")
        for v in verses[:5]:
            print(f"\n--- Глава {v.chapter_number}, Вірш {v.verse_number} ---")
            print(f"EN: {v.transliteration_en[:100]}...")
            print(f"UA: {v.transliteration_ua[:100]}...")
        return

    SUPABASE_URL = os.getenv('SUPABASE_URL', '')
    SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY', '')

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Встановіть змінні середовища SUPABASE_URL та SUPABASE_SERVICE_KEY")
        sys.exit(1)

    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }

    # Отримуємо book_id для gita
    resp = requests.get(
        f"{SUPABASE_URL}/rest/v1/books?slug=eq.gita&select=id",
        headers=headers
    )
    if resp.status_code != 200 or not resp.json():
        print(f"❌ Книга 'gita' не знайдена в БД: {resp.text}")
        sys.exit(1)

    book_id = resp.json()[0]['id']
    print(f"📚 Книга gita: {book_id}")

    # Отримуємо всі глави
    resp = requests.get(
        f"{SUPABASE_URL}/rest/v1/chapters?book_id=eq.{book_id}&select=id,chapter_number",
        headers=headers
    )
    chapters_map = {ch['chapter_number']: ch['id'] for ch in resp.json()}

    updated = 0
    errors = 0

    for verse in verses:
        chapter_id = chapters_map.get(verse.chapter_number)
        if not chapter_id:
            print(f"⚠️  Глава {verse.chapter_number} не знайдена")
            errors += 1
            continue

        # UPSERT: оновлюємо тільки transliteration_en та transliteration_ua
        try:
            # Знаходимо вірш за chapter_id та verse_number
            resp = requests.get(
                f"{SUPABASE_URL}/rest/v1/verses?chapter_id=eq.{chapter_id}&verse_number=eq.{verse.verse_number}&select=id",
                headers=headers
            )

            if resp.status_code == 200 and resp.json():
                # Оновлюємо існуючий
                verse_id = resp.json()[0]['id']
                update_resp = requests.patch(
                    f"{SUPABASE_URL}/rest/v1/verses?id=eq.{verse_id}",
                    headers=headers,
                    json={
                        'transliteration_en': verse.transliteration_en,
                        'transliteration_ua': verse.transliteration_ua,
                    }
                )
                if update_resp.status_code in [200, 204]:
                    updated += 1
                    print(f"✅ Оновлено: {verse.chapter_number}.{verse.verse_number}")
                else:
                    print(f"❌ Помилка оновлення {verse.chapter_number}.{verse.verse_number}: {update_resp.text}")
                    errors += 1
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
