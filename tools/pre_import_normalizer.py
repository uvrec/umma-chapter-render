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
    
    # ДОДАТКОВІ з textNormalizer.ts
    '\ufeff': '',  # BOM (byte order mark)
    '\u00A0': ' ',  # non-breaking space
    '\u2018': "'",  # left single quotation mark
    '\u2019': "'",  # right single quotation mark
    '\u201C': '"',  # left double quotation mark
    '\u201D': '"',  # right double quotation mark
    '\u2013': '-',  # en dash
    '\u2014': '—',  # em dash
    '\r\n': '\n',   # Windows line endings
    '\r': '\n',     # Mac line endings
    '\t': ' ',      # tabs to spaces
}

# ============================================================================
# 2. Діакритичні символи (санскрит → українська транслітерація)
# ============================================================================

DIACRITIC_FIXES = {
    # Довгі голосні
    'ā': 'а̄',
    'ī': 'ı̄',  # ī → ı̄ (латинська dotless i + макрон, БЕЗ крапки!)
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

    # ❌ ВИДАЛЕНО неправильні правила видалення діакритичних крапок
    # Gitabase повертає чистий текст з HTML, без помилок діакритики
    # Правила типу 'а̣': 'а' псують правильну транслітерацію (наприклад чаран̣а → чарана)
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
    
    # Чайтанья (виправлення після транслітерації: нйа → нья)
    "Шрі Чайтан'я-чарітамріта": "Шрі Чайтанья-чарітамріта",
    "Чайтан'я-чарітамріта": "Чайтанья-чарітамріта",
    "Чайтан'я-чандродая-натака": "Чайтанья-чандродая-натака",
    "Чайтан'я-бгаґавата": "Чайтанья-бгаґавата",
    "Чайтан'я": "Чайтанья",
    "Чайтан'ї": "Чайтаньї",
    "Чайтан'ю": "Чайтанью",
    "Чайтан'єю": "Чайтаньєю",
    # НОВІ правила для транслітерації нйа → нья
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
    
    "Махапрабху": "Махапрабгу",
    
    # Ґопінатга → Ґопінатха
    "Ґопінатга": "Ґопінатха",
    "Ґопінатгу": "Ґопінатху",
    
    # Енергія (ґ → г, правильно без ґ)
    "енерґія": "енергія",
    "енерґії": "енергії",
    "енерґію": "енергію",
    "енерґією": "енергією",
    "енерґіями": "енергіями",
    
    # Санньясі (специфічне правило з SQL функції)
    "санн'ясі": "санньясі",
    "Санн'ясі": "Санньясі",
    "санн'яса": "саньяса",
    "Санн'яса": "Саньяса",
    "санн'ясу": "саньясу",
    "санн'ясою": "саньясою",
    "санн'ясам": "саньясам",
    "санн'ясами": "саньясами",
    
    # Специфічні виправлення
    "проджджгіта": "проджджхіта",
    "Проджджгіта": "Проджджхіта",
    
    # ДОДАТКОВІ з textNormalizer.ts
    "Ачйута": "Ачьюта",
    "Адвайта": "Адваіта",
    "Джгарікханда": "Джхарікханда",
    
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
    
    "тг": "тх",
    "Тг": "Тх",
    
    "кг": "кх",
    "Кг": "Кх",
    
    "чг": "чх",
    "Чг": "Чх",
    
    # Неправильні з Gitabase
    "пг": "пх",
    "Пг": "Пх",
    
    # ДОДАТКОВІ ПРАВИЛА з normalize_ukrainian_cc_texts (SQL функція)
    # Придихові приголосні (складні випадки)
    "джг": "джх",
    "Джг": "Джх",
    "джджг": "джджх",
    "Джджг": "Джджх",
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
    "jjh": "жджх",
    # ❌ ВИДАЛЕНО "jh": "жх" - конфліктує з convert_english_to_ukrainian_translit
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
    'sh': 'сх',
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
    'ī': 'ı̄',  # ī → ı̄ (латинська dotless i + макрон, БЕЗ крапки!)
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
        'cch': 'ччх', 'jjh': 'жджх','kṣa': 'кша', 'kṣe': 'кше', 'kṣi': 'кші', 'kṣu': 'кшу', 'kṣṇ': 'кшн̣',
        'aya': 'айа', 'aye': 'айе', 'hye': 'хйе',
        'Kṣa': 'кша', 'Kṣe': 'кше', 'Kṣi': 'кші', 'Kṣu': 'кшу',
        # Сполучення ny + голосні (ПРАВИЛЬНО: нй, а не нь!)
        # Приклад: caitanya → чаітанйа (не чаітанья!)
        'nya': 'нйа', 'nye': 'нйе', 'nyi': 'нйі', 'nyo': 'нйо', 'nyu': 'нйу',
        
        # 2 символи (діграфи та сполучення)
        'bh': 'бг', 'gh': 'ґг', 'dh': 'дг', 'th': 'тх', 'ph': 'пх',
        'kh': 'кх', 'ch': 'чх', 'jh': 'джх', 'sh': 'сх',
        'kṣ': 'кш', 'jñ': 'джн̃',
        'ai': 'аі', 'au': 'ау',
        
        # 1 символ діакритичні
        'ṣ': 'ш', 'ś': 'ш́', 'ṭ': 'т̣', 'ḍ': 'д̣', 'ṇ': 'н̣',
        'ṛ': 'р̣', 'ñ': 'н̃', 'ṅ': 'н̇', 'ṁ': 'м̇', 'ḥ': 'х̣',
        
        # 1 символ довгі голосні (+ великі для початку речень)
        'ā': 'а̄', 'ī': 'ı̄', 'ū': 'ӯ', 'ṝ': 'р̣̄',  # ī → ı̄ (dotless i + макрон)
        'Ā': 'а̄', 'Ī': 'Ī', 'Ū': 'ӯ', 'Ṝ': 'р̣̄',  # Ī → Ī (велика без крапки)
        
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


def normalize_apostrophe_after_n(text: str) -> str:
    """
    Замінює апостроф після "н" на м'який знак "ь"
    За винятком випадків де апостроф правильний (ачар'я, антар'ямі)
    
    Правило з SQL функції normalize_ukrainian_cc_texts:
    н' → нь (крім випадків де апостроф правильний)
    """
    if not text:
        return text
    
    # Виключення - слова де апостроф після н правильний
    exceptions = [
        "ачар'я", "Ачар'я",
        "антар'ямі", "Антар'ямі",
        "антар'ям", "Антар'ям",
        # Додайте інші виключення якщо потрібно
    ]
    
    result = text
    
    # Замінюємо н' на нь (case-insensitive для різних регістрів)
    # Використовуємо regex для точнішого контролю
    import re
    
    # Спочатку зберігаємо виключення (заміняємо тимчасовим placeholder)
    placeholders = {}
    for idx, exception in enumerate(exceptions):
        placeholder = f"__EXCEPTION_{idx}__"
        if exception in result:
            placeholders[placeholder] = exception
            result = result.replace(exception, placeholder)
    
    # Тепер робимо заміну н' → нь
    result = result.replace("н'", "нь")
    result = result.replace("Н'", "Нь")
    
    # Відновлюємо виключення
    for placeholder, original in placeholders.items():
        result = result.replace(placeholder, original)
    
    return result


def normalize_sanskrit_line_breaks(text: str) -> str:
    """Додає правильні розриви рядків у санскриті/бенгалі за дандами.
    
    Формат:
    - Перший рядок: до । (single daṇḍa)
    - Другий рядок: після । до ॥ (double daṇḍa з номером віршу)
    
    Приклад:
    ДО:  বন্দে গুরূন্‌ । তৎপ্রকাশাংশ্চ ॥ ১ ॥
    ПІСЛЯ: বন্দে গুরূন্‌ ।\nতৎপ্রকাশাংশ্চ ॥ ১ ॥
    """
    if not text:
        return text
    
    # Видаляємо існуючі \n щоб почати з чистого тексту
    text = text.replace('\n', ' ')
    
    # Видаляємо зайві пробіли
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Розбиваємо на рядки за । (single daṇḍa)
    # Формат: "текст । текст ॥ N ॥"
    # ВАЖЛИВО: зберігаємо । в кінці першого рядка
    if '।' in text:
        # Знаходимо ПЕРШУ single daṇḍa (може бути кілька в довгих віршах)
        parts = text.split('।', 1)  # Split на 2 частини
        if len(parts) == 2:
            first_line = parts[0].strip() + ' ।'
            second_line = parts[1].strip()
            return f'{first_line}\n{second_line}'
    
    return text


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


def convert_synonyms_from_english(synonyms_en: str) -> str:
    """
    Конвертує synonyms_en → synonyms_uk
    
    Обробляє тільки санскритські/бенгальські терміни (IAST → українська з діакритикою),
    а українські переклади залишає без змін.
    
    Приклад:
    EN: "caitanya — of Lord Caitanya; caraṇa-ambhoja — lotus feet"
    UA: "чаітанйа — Господа Чайтаньї; чаран̣а-амбгоджа — лотосові стопи"
    """
    if not synonyms_en:
        return ''
    
    result_pairs = []
    
    for pair in synonyms_en.split(';'):
        pair = pair.strip()
        if not pair:
            continue
        
        if '—' not in pair and '-' not in pair:
            result_pairs.append(pair)
            continue
        
        # Розділяємо на санскритський термін та переклад
        parts = pair.split('—', 1)
        if len(parts) == 2:
            sanskrit_term = parts[0].strip()
            english_meaning = parts[1].strip()
            
            # Конвертуємо ТІЛЬКИ санскритський термін (IAST → українська)
            ukrainian_term = convert_english_to_ukrainian_translit(sanskrit_term)
            ukrainian_term = normalize_diacritics(ukrainian_term)
            
            # Переклад залишаємо як є (він буде замінений парсером на український)
            result_pairs.append(f'{ukrainian_term} — {english_meaning}')
        else:
            # Немає роздільника —, просто конвертуємо
            converted = convert_english_to_ukrainian_translit(pair)
            converted = normalize_diacritics(converted)
            result_pairs.append(converted)
    
    return '; '.join(result_pairs)


def restore_diacritics_in_synonyms(synonyms_text: str, transliteration_text: str) -> str:
    """
    Відновлює діакритику в synonyms_uk на основі transliteration_uk
    
    Gitabase має діакритику, але вона губиться при копіюванні/імпорті.
    Використовуємо transliteration_uk як джерело правильних форм з діакритикою.
    
    Приклад:
    synonyms: "чараа — біля стіп"
    translit: "чаран̣а̄"
    result: "чаран̣а̄ — біля стіп"
    """
    if not synonyms_text or not transliteration_text:
        return synonyms_text
    
    import unicodedata
    
    def remove_combining_marks(text):
        """Видаляє combining діакритичні знаки для порівняння"""
        nfd = unicodedata.normalize('NFD', text)
        without = ''.join(ch for ch in nfd if unicodedata.category(ch) != 'Mn')
        return unicodedata.normalize('NFC', without)
    
    # Створюємо словник: слово_без_діакритики → слово_з_діакритикою
    translit_map = {}
    for word in transliteration_text.replace('-', ' ').replace('  ', ' ').split():
        clean_word = remove_combining_marks(word).lower()
        if clean_word and len(clean_word) > 1:  # Ігноруємо одиночні символи
            translit_map[clean_word] = word
    
    # Обробляємо synonyms
    result_pairs = []
    for pair in synonyms_text.split(';'):
        pair = pair.strip()
        if not pair:
            continue
            
        if '—' not in pair:
            result_pairs.append(pair)
            continue
        
        parts = pair.split('—', 1)
        sanskrit_word = parts[0].strip()
        ukrainian_meaning = parts[1].strip() if len(parts) > 1 else ''
        
        # Для складених слів (наприклад: "чараа-амбгоджа")
        if '-' in sanskrit_word:
            # Обробляємо кожну частину окремо
            word_parts = sanskrit_word.split('-')
            restored_parts = []
            for part in word_parts:
                clean_part = remove_combining_marks(part).lower()
                restored_parts.append(translit_map.get(clean_part, part))
            restored_word = '-'.join(restored_parts)
        else:
            # Одне слово
            clean_word = remove_combining_marks(sanskrit_word).lower()
            restored_word = translit_map.get(clean_word, sanskrit_word)
        
        result_pairs.append(f'{restored_word} — {ukrainian_meaning}')
    
    return '; '.join(result_pairs)


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
        # Санскрит - діакритика + розриви рядків за дандами
        result = normalize_diacritics(result)
        result = normalize_sanskrit_line_breaks(result)
    
    elif field_type == 'transliteration_en':
        # Англійська транслітерація з Vedabase - ЗАЛИШАЄМО БЕЗ ЗМІН (оригінальний IAST)
        # Тільки видаляємо артефакти
        pass
    
    elif field_type == 'transliteration':
        # Транслітерація - IAST→українська, діакритика, виправлення сполучень, БЕЗ заміни слів!
        # ВАЖЛИВО: НЕ застосовуємо normalize_word_replacements - залишаємо "нйа" як є
        result = convert_english_to_ukrainian_translit(result)  # IAST → українська!
        result = normalize_diacritics(result)
        result = normalize_transliteration(result)
        # НЕ: result = normalize_word_replacements(result)
    
    elif field_type in ['synonyms', 'translation', 'commentary']:
        # Українські тексти - всі правила нормалізації
        result = normalize_diacritics(result)  # Виправляє санскритську діакритику
        result = normalize_word_replacements(result)  # чаітанйа → Чайтанья (нйа → нья)
        result = normalize_apostrophe_after_n(result)  # н' → нь
        # Виправляємо тільки неправильні поєднання (тг→тх, джг→джх, тощо)
        for old, new in TRANSLIT_FIXES.items():
            # Застосовуємо всі правила з TRANSLIT_FIXES включно з джг→джх, джджг→джджх
            result = result.replace(old, new)
    
    return result


def normalize_verse(verse: dict) -> dict:
    """Нормалізує всі поля одного віршу"""
    normalized = verse.copy()
    
    # Нормалізуємо кожне поле
    # sanskrit містить Bengali/Sanskrit текст (назва не важлива)
    normalized['sanskrit'] = normalize_verse_field(verse.get('sanskrit', ''), 'sanskrit')
    
    # transliteration_en - ЗАЛИШАЄМО БЕЗ ЗМІН (оригінальний IAST з Vedabase)
    normalized['transliteration_en'] = normalize_verse_field(verse.get('transliteration_en', ''), 'transliteration_en')
    
    # transliteration_uk - конвертуємо transliteration_en → українська
    if normalized.get('transliteration_en'):
        # Беремо IAST з Vedabase і конвертуємо в українську транслітерацію
        ua_translit = convert_english_to_ukrainian_translit(normalized['transliteration_en'])
        ua_translit = normalize_diacritics(ua_translit)
        normalized['transliteration_uk'] = ua_translit
    else:
        # Fallback: якщо немає transliteration_en, беремо що є
        normalized['transliteration_uk'] = normalize_verse_field(verse.get('transliteration_uk', ''), 'transliteration')
    
    # Підтримка старого формату (deprecated)
    normalized['transliteration'] = normalized.get('transliteration_uk', '')
    
    # synonyms_en - залишаємо БЕЗ ЗМІН (оригінал з Vedabase)
    normalized['synonyms_en'] = normalize_verse_field(verse.get('synonyms_en', ''), 'transliteration_en')

    # synonyms_uk - MERGE Vedabase IAST terms + Gitabase UA meanings
    if verse.get('synonyms_uk') and verse.get('synonyms_en'):
        # ✅ ПРАВИЛЬНИЙ ПІДХІД:
        # Парсер повертає з Gitabase ТІЛЬКИ ЗНАЧЕННЯ (БЕЗ термінів!)
        # Формат Gitabase synonyms_uk: "в той час; країни; один; мусульманин; ..." (тільки переклади)
        # Формат Vedabase synonyms_en: "hena-kāle — at this time; mulukera — of the country; ..."
        #
        # Треба MERGE:
        #   1. Витягнути IAST терміни з Vedabase synonyms_en
        #   2. Конвертувати їх в українську транслітерацію з діакритикою (ISTA2Ukrainian)
        #   3. Взяти українські значення з Gitabase synonyms_uk (вже без термінів!)
        #   4. Об'єднати: vedabase_ukrainian_term — gitabase_meaning
        
        # Gitabase synonyms_uk містить ТІЛЬКИ ЗНАЧЕННЯ (розділені ;)
        gitabase_meanings = [m.strip() for m in verse['synonyms_uk'].split(';') if m.strip()]
        
        # Розбиваємо Vedabase pairs на список
        vedabase_pairs = [p.strip() for p in verse['synonyms_en'].split(';') if p.strip()]
        
        result_pairs = []
        for idx, vb_pair in enumerate(vedabase_pairs):
            if '—' in vb_pair:
                # Витягуємо IAST термін (перша частина до —)
                iast_term = vb_pair.split('—', 1)[0].strip()
                
                # Конвертуємо IAST → українська транслітерація з діакритикою
                ua_term = convert_english_to_ukrainian_translit(iast_term)
                
                # Об'єднуємо з українським значенням (якщо є)
                if idx < len(gitabase_meanings):
                    ua_meaning = gitabase_meanings[idx]
                    result_pairs.append(f'{ua_term} — {ua_meaning}')
                else:
                    # Fallback: немає українського значення, беремо англійське
                    en_meaning = vb_pair.split('—', 1)[1].strip() if '—' in vb_pair else ''
                    if en_meaning:
                        result_pairs.append(f'{ua_term} — {en_meaning}')
        
        if result_pairs:
            normalized['synonyms_uk'] = normalize_verse_field('; '.join(result_pairs), 'synonyms')
        else:
            normalized['synonyms_uk'] = ''
    elif verse.get('synonyms_en'):
        # Fallback: конвертуємо з EN якщо немає UA
        ua_synonyms = convert_synonyms_from_english(verse['synonyms_en'])
        normalized['synonyms_uk'] = normalize_verse_field(ua_synonyms, 'synonyms')
    else:
        normalized['synonyms_uk'] = ''
    normalized['translation_uk'] = normalize_verse_field(verse.get('translation_uk', ''), 'translation')
    normalized['translation_en'] = normalize_verse_field(verse.get('translation_en', ''), 'translation')
    normalized['commentary_uk'] = normalize_verse_field(verse.get('commentary_uk', ''), 'commentary')
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
    fields = ['sanskrit', 'transliteration', 'synonyms_uk', 'translation_uk', 'commentary_uk']
    for field in fields:
        filled = sum(1 for v in normalized['verses'] if v.get(field))
        print(f"  {field}: {filled}/{total}")
