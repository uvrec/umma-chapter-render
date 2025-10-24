#!/usr/bin/env python3
"""
Нормалізатор тексту перед імпортом в vedavoice.org
Виправляє mojibake, діакритику, та застосовує академічні правила транслітерації
"""

import re
import json
from typing import Dict, List

# ============================================================================
# 1. MOJIBAKE і неправильні символи
# ============================================================================

MOJIBAKE_REPLACEMENTS = {
    # Знаки питання замість діакритики
    '�': '',  # Видаляємо невідомі символи
    
    # Windows-1252 → UTF-8
    'â€™': "'",  # right single quotation mark
    'â€œ': '"',  # left double quotation mark
    'â€': '"',  # right double quotation mark
    'â€"': '—',  # em dash
    'â€"': '–',  # en dash
    
    # Подвійні апострофи
    "''": "'",
    '``': '"',
    
    # Інші помилки кодування
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ãº': 'ú',
}

# ============================================================================
# 2. Діакритичні символи (санскрит → українська транслітерація)
# ============================================================================

DIACRITIC_FIXES = {
    # Довгі голосні
    'ā': 'а̄',
    'ī': 'ī', 
    'ū': 'ӯ',
    'ṝ': 'р̣̄',
    
    # Ретрофлексні приголосні
    'ṭ': 'т̣',
    'ḍ': 'д̣',
    'ṇ': 'н̣',
    'ṣ': 'ш',
    'ṛ': 'р̣',
    
    # Палатальні та інші
    'ś': 'ш́',
    'ñ': 'н̃',
    'ṅ': 'н̇',
    'ṁ': 'м̇',
    'ḥ': 'х̣',
    
    # Часті помилки з Gitabase
    'а̣': 'а',  # неправильна крапка під а
    'і̣': 'і',  # неправильна крапка під і
}

# ============================================================================
# 3. Словники замін для української версії
# ============================================================================
# На основі затвердженого списку транслітерації/транскрипції
# Правило: замінюємо ЦІЛІ СЛОВА, не окремі символи
# Апостроф ' зберігаємо там, де він правильний (ачар'я, антар'ямі)

WORD_REPLACEMENTS = {
    # =========================
    # ОСНОВНІ ІМЕНА (правильна транслітерація)
    # =========================
    
    # Чайтанья (виправлення після транслітерації: нйа → ння)
    "Шрі Чайтан'я-чарітамріта": "Шрі Чайтанья-чарітамріта",
    "Чайтан'я-чарітамріта": "Чайтанья-чарітамріта",
    "Чайтан'я-чандродая-натака": "Чайтанья-чандродая-натака",
    "Чайтан'я-бгаґавата": "Чайтанья-бгаґавата",
    "Чайтан'я": "Чайтанья",
    "Чайтан'ї": "Чайтаньї",
    "Чайтан'ю": "Чайтанью",
    "Чайтан'єю": "Чайтаньєю",
    # НОВІ правила для транслітерації нйа → ння
    "чаітанйа": "Чайтанья",
    "Чаітанйа": "Чайтанья",
    "чаітанйі": "Чайтаньї",
    "чаітанйу": "Чайтанью",
    
    # Нітьянанда (апостроф ' → м'який знак ь)
    "Ніт'янанда": "Нітьянанда",
    "Ніт'янанди": "Нітьянанди",
    "Ніт'янанді": "Нітьянанді",
    "Ніт'янанду": "Нітьянанду",
    "Ніт'янандою": "Нітьянандою",
    
    # Махапрабгу → Махапрабху
    "Махапрабгу": "Махапрабху",
    "Махапрабгом": "Махапрабхом",
    
    # Ґопінатга → Ґопінатха
    "Ґопінатга": "Ґопінатха",
    "Ґопінатгу": "Ґопінатху",
    
    # Енергія (ґ → г, правильно без ґ)
    "енерґія": "енергія",
    "енерґії": "енергії",
    "енерґію": "енергію",
    "енерґією": "енергією",
    "енерґіями": "енергіями",
    
    # Інші виправлення придихових
    "Пуруши": "Пуруши",  # якщо було неправильно транскрибовано
}

# ============================================================================
# 4. Виправлення транслітерації (bh→бг, th→тх, тощо)
# ============================================================================

TRANSLIT_FIXES = {
    # Придихові приголосні (h після приголосної)
    "бх": "бг",
    "Бх": "Бг",
    "БХ": "БГ",
    
    "ґх": "ґг",
    "Ґх": "Ґг",
    
    "дх": "дг",
    "Дх": "Дг",
    
    "тх": "тх",  # вже правильно
    "Тх": "Тх",
    
    "кх": "кх",  # вже правильно
    "Кх": "Кх",
    
    "чг": "чх",
    "Чг": "Чх",
    
    # Неправильні з Gitabase
    "тг": "тх",
    "Тг": "Тх",
    "пг": "пх",
    "Пг": "Пх",
    "кг": "кх",
    "Кг": "Кх",
}

# ============================================================================
# 5. Сполучення приголосних (академічні правила)
# ============================================================================

CONSONANT_CLUSTERS = {
    # З правил санскрит→українська
    "kṣ": "кш",
    "ṅg": "н̇ґ",
    "ñi": "н̃і",
    "ṛṣṇ": "р̣шн̣",
    "hy": "хй",
    "ye": "йе",
    "ya": "йа",
    "aya": "айа",
    "āye": "а̄йе",
}

# ============================================================================
# 6. Конвертація англійської транслітерації → українська
# ============================================================================

ENGLISH_TO_UKRAINIAN_TRANSLIT = {
    # Приголосні
    'kh': 'кх',
    'gh': 'ґг',
    'ch': 'ч',
    'jh': 'джх',
    'th': 'тх',
    'dh': 'дг',
    'ph': 'пх',
    'bh': 'бг',
    
    # Палатальні
    'ś': 'ш́',
    'sh': 'ш',
    'ṣ': 'ш',
    
    # Ретрофлексні
    'ṭ': 'т̣',
    'ḍ': 'д̣',
    'ṇ': 'н̣',
    'ṛ': 'р̣',
    
    # Інші
    'ñ': 'н̃',
    'ṅ': 'н̇',
    'ṁ': 'м̇',
    'ḥ': 'х̣',
    
    # Голосні
    'ā': 'а̄',
    'ī': 'ī',
    'ū': 'ӯ',
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
    
    # Прості голосні
    'a': 'а',
    'i': 'і',
    'u': 'у',
    'e': 'е',
    'o': 'о',
}

def convert_english_to_ukrainian_translit(text: str) -> str:
    """
    Конвертує англійську IAST транслітерацію санскриту в українську
    за академічними правилами
    
    Приклад: 'vande gurūn īśa-bhaktān' → 'ванде ґурӯн īша-бгактāн'
    
    Використовує алгоритм ЖАДІБНОГО ЗБІГУ (greedy matching):
    йде посимвольно, шукає найдовший підрядок що починається з поточної позиції
    """
    if not text:
        return text
    
    # Спочатку видаляємо "Verse text" якщо є
    text = text.replace('Verse text ', '').replace('Verse Text ', '')
    
    # Мапи конвертації (довжина → список шаблонів)
    # КРИТИЧНО: сортуємо за довжиною спадно для жадібного збігу
    patterns = {
        # 3 символи
        'kṣa': 'кша', 'kṣe': 'кше', 'kṣi': 'кші', 'kṣu': 'кшу', 'kṣṇ': 'кшн̣',
        'aya': 'айа', 'aye': 'айе',
        'Kṣa': 'кша', 'Kṣe': 'кше', 'Kṣi': 'кші', 'Kṣu': 'кшу',
        # Сполучення ny + голосні (ПРАВИЛЬНО: нй, а не нь!)
        # Приклад: caitanya → чаітанйа (не чаітанья!)
        'nya': 'нйа', 'nye': 'нйе', 'nyi': 'нйі', 'nyo': 'нйо', 'nyu': 'нйу',
        
        # 2 символи (діграфи та сполучення)
        'bh': 'бг', 'gh': 'ґг', 'dh': 'дг', 'th': 'тх', 'ph': 'пх',
        'kh': 'кх', 'ch': 'ч', 'jh': 'джх', 'sh': 'ш',
        'kṣ': 'кш', 'jñ': 'джн̃',
        'ai': 'аі', 'au': 'ау',
        
        # 1 символ діакритичні
        'ṣ': 'ш', 'ś': 'ш́', 'ṭ': 'т̣', 'ḍ': 'д̣', 'ṇ': 'н̣',
        'ṛ': 'р̣', 'ñ': 'н̃', 'ṅ': 'н̇', 'ṁ': 'м̇', 'ḥ': 'х̣',
        
        # 1 символ довгі голосні (+ великі для початку речень)
        'ā': 'а̄', 'ī': 'ī', 'ū': 'ӯ', 'ṝ': 'р̣̄',
        'Ā': 'а̄', 'Ī': 'ī', 'Ū': 'ӯ', 'Ṝ': 'р̣̄',
        
        # 1 символ прості приголосні (+ великі для початку речень)
        'k': 'к', 'g': 'ґ', 'c': 'ч', 'j': 'дж',
        't': 'т', 'd': 'д', 'p': 'п', 'b': 'б',
        'y': 'й', 'r': 'р', 'l': 'л', 'v': 'в',
        'w': 'в', 'h': 'х', 'm': 'м', 'n': 'н', 's': 'с',
        'K': 'к', 'G': 'ґ', 'C': 'ч', 'J': 'дж',
        'T': 'т', 'D': 'д', 'P': 'п', 'B': 'б',
        'Y': 'й', 'R': 'р', 'L': 'л', 'V': 'в',
        'W': 'в', 'H': 'х', 'M': 'м', 'N': 'н', 'S': 'с',
        
        # 1 символ прості голосні (+ великі для початку речень)
        'a': 'а', 'i': 'і', 'u': 'у', 'e': 'е', 'o': 'о',
        'A': 'а', 'I': 'і', 'U': 'у', 'E': 'е', 'O': 'о',
    }
    
    result = []
    i = 0
    
    while i < len(text):
        # Пробуємо найдовші підрядки першими (3, потім 2, потім 1)
        matched = False
        
        for length in [3, 2, 1]:
            if i + length <= len(text):
                substr = text[i:i+length]
                if substr in patterns:
                    result.append(patterns[substr])
                    i += length
                    matched = True
                    break
        
        if not matched:
            # Символ не в мапі (дефіс, пробіл, лапки) - залишаємо як є
            result.append(text[i])
            i += 1
    
    return ''.join(result)


# ============================================================================
# ФУНКЦІЇ НОРМАЛІЗАЦІЇ
# ============================================================================

def normalize_mojibake(text: str) -> str:
    """Виправляє mojibake та неправильні символи"""
    if not text:
        return text
    
    result = text
    for old, new in MOJIBAKE_REPLACEMENTS.items():
        result = result.replace(old, new)
    
    return result


def normalize_diacritics(text: str) -> str:
    """Виправляє діакритичні символи"""
    if not text:
        return text
    
    result = text
    for old, new in DIACRITIC_FIXES.items():
        result = result.replace(old, new)
    
    return result


def normalize_word_replacements(text: str) -> str:
    """Застосовує словникові заміни"""
    if not text:
        return text
    
    result = text
    for old, new in WORD_REPLACEMENTS.items():
        result = result.replace(old, new)
    
    return result


def normalize_transliteration(text: str) -> str:
    """Виправляє транслітерацію (bh→бг, тощо)"""
    if not text:
        return text
    
    result = text
    
    # Спочатку сполучення
    for old, new in CONSONANT_CLUSTERS.items():
        result = result.replace(old, new)
    
    # Потім окремі виправлення
    for old, new in TRANSLIT_FIXES.items():
        result = result.replace(old, new)
    
    return result


def remove_gitabase_artifacts(text: str) -> str:
    """Видаляє артефакти Gitabase (номери віршів, зайві пробіли)"""
    if not text:
        return text
    
    # Видаляємо "Текст 1:", "18:" на початку
    result = re.sub(r'^\s*\d+\s*:\s*', '', text)
    result = re.sub(r'^\s*Текст\s+\d+\s*:\s*', '', text, flags=re.IGNORECASE)
    
    # Множинні пробіли → один пробіл
    result = re.sub(r'\s+', ' ', result)
    
    # Видаляємо зайві пробіли навколо знаків пунктуації
    result = re.sub(r'\s+([,.;:!?])', r'\1', result)
    
    return result.strip()


def normalize_verse_field(text: str, field_type: str) -> str:
    """
    Нормалізує одне поле віршу
    
    field_type: 'sanskrit', 'transliteration', 'transliteration_en', 'synonyms', 'translation', 'commentary'
    """
    if not text:
        return text
    
    # 1. Видаляємо mojibake
    result = normalize_mojibake(text)
    
    # 2. Видаляємо артефакти Gitabase
    result = remove_gitabase_artifacts(result)
    
    # 3. Залежно від типу поля
    if field_type == 'sanskrit':
        # Санскрит - тільки діакритика
        result = normalize_diacritics(result)
    
    elif field_type == 'transliteration_en':
        # Англійська транслітерація з Vedabase → українська
        result = convert_english_to_ukrainian_translit(result)
        result = normalize_diacritics(result)
        result = normalize_word_replacements(result)
    
    elif field_type == 'transliteration':
        # Транслітерація - IAST→українська, діакритика, виправлення сполучень, БЕЗ заміни слів!
        # ВАЖЛИВО: НЕ застосовуємо normalize_word_replacements - залишаємо "нйа" як є
        result = convert_english_to_ukrainian_translit(result)  # IAST → українська!
        result = normalize_diacritics(result)
        result = normalize_transliteration(result)
        # НЕ: result = normalize_word_replacements(result)
    
    elif field_type in ['synonyms', 'translation', 'commentary']:
        # Українські тексти - всі правила окрім транслітерації consonant clusters
        result = normalize_diacritics(result)
        result = normalize_word_replacements(result)
        # Виправляємо тільки неправильні поєднання (тг→тх)
        for old, new in TRANSLIT_FIXES.items():
            if old in ['тг', 'пг', 'кг', 'Тг', 'Пг', 'Кг', 'чг', 'Чг']:
                result = result.replace(old, new)
    
    return result


def normalize_verse(verse: dict) -> dict:
    """Нормалізує всі поля одного віршу"""
    normalized = verse.copy()
    
    # Нормалізуємо кожне поле
    normalized['sanskrit'] = normalize_verse_field(verse.get('sanskrit', ''), 'sanskrit')
    # КРИТИЧНО: transliteration БЕЗ normalize_word_replacements - залишаємо "чайтанйа" як є!
    normalized['transliteration'] = normalize_verse_field(verse.get('transliteration', ''), 'transliteration')
    normalized['synonyms_ua'] = normalize_verse_field(verse.get('synonyms_ua', ''), 'synonyms')
    normalized['synonyms_en'] = normalize_verse_field(verse.get('synonyms_en', ''), 'synonyms')
    normalized['translation_ua'] = normalize_verse_field(verse.get('translation_ua', ''), 'translation')
    normalized['translation_en'] = normalize_verse_field(verse.get('translation_en', ''), 'translation')
    normalized['commentary_ua'] = normalize_verse_field(verse.get('commentary_ua', ''), 'commentary')
    normalized['commentary_en'] = normalize_verse_field(verse.get('commentary_en', ''), 'commentary')
    
    return normalized


def normalize_parsed_data(data: dict) -> dict:
    """
    Нормалізує повний parsed JSON
    
    Args:
        data: dict з ключами 'verses' та 'summary'
    
    Returns:
        normalized dict
    """
    normalized_verses = []
    
    for verse in data.get('verses', []):
        normalized = normalize_verse(verse)
        normalized_verses.append(normalized)
    
    return {
        'verses': normalized_verses,
        'summary': data.get('summary', {}),
    }


# ============================================================================
# CLI
# ============================================================================

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python3 pre_import_normalizer.py <input.json> [output.json]")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else input_file.replace('.json', '_normalized.json')
    
    print(f"📖 Читаю: {input_file}")
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"🔧 Нормалізую {len(data.get('verses', []))} віршів...")
    normalized = normalize_parsed_data(data)
    
    print(f"💾 Зберігаю: {output_file}")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(normalized, f, ensure_ascii=False, indent=2)
    
    print("✅ Готово!")
    
    # Статистика
    total = len(normalized['verses'])
    print(f"\n📊 Статистика:")
    print(f"  Всього віршів: {total}")
    
    # Підрахунок заповнених полів
    fields = ['sanskrit', 'transliteration', 'synonyms_ua', 'translation_ua', 'commentary_ua']
    for field in fields:
        filled = sum(1 for v in normalized['verses'] if v.get(field))
        print(f"  {field}: {filled}/{total}")
