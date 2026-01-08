#!/usr/bin/env python3
"""Normalize transliteration and Ukrainian text fields produced by the parser.

Usage:
  python3 tools/translit_normalizer.py --in /tmp/parsed_l1_c1_v19_v3.json --out /tmp/parsed_l1_c1_v19_v3.clean.json

The script will:
 - Unicode-normalize strings
 - Remove private-use / control glyphs often introduced by site scrapers
 - Apply a set of configurable substring replacements for common mojibake
 - Apply Ukrainian word replacements (WORD_REPLACEMENTS_UKR) when requested
 - Print a small before/after sample for inspection
"""
import argparse
import json
import re
import unicodedata
from typing import Dict, Any

# Heuristics: remove private-use area characters and odd control glyphs
PRIVATE_USE_RE = re.compile(r"[\uE000-\uF8FF\uFFF0-\uFFFF]")
CONTROL_CHARS_RE = re.compile(r"[\u200B-\u200F\u202A-\u202E]")

# Example replacements to fix mojibake observed in Gitabase downloads.
# This list should be expanded iteratively based on observed inputs.
MOJIBAKE_REPLACEMENTS = {
    '\uF0A0': '',
    '': "'",
    '': '',
    '': '',
    '': '',
    '': '',
    '�': '',
    '\ufeff': '',
}

# ============================================================================
# УКРАЇНСЬКІ ПРАВИЛА ТРАНСЛІТЕРАЦІЇ
# Базуються на документі:
# https://docs.google.com/spreadsheets/d/1YZT4-KaQBeEZu7R9qysirdt8yb-9psOIkXCalDPLuwY
# ============================================================================

# Імена/слова БЕЗ фінальної -а
NAMES_WITHOUT_FINAL_A = {
    # -nātha → -натх
    "Раґгунатха": "Раґгунатх",
    "Джаґаннатха": "Джаґаннатх",
    "Вішванатха": "Вішванатх",
    "Ґопінатха": "Ґопінатх",
    "Радганатха": "Радганатх",

    # -dāsa → -дас
    "Харідаса": "Харідас",
    "даса": "дас",
    "Даса": "Дас",

    # -vinoda → -вінод
    "Бгактівінода": "Бгактівінод",
    "вінода": "вінод",

    # -vana → -ван
    "Вріндавана": "Вріндаван",
    "Ґовардгана": "Ґовардган",
    "Бгадравана": "Бгадраван",
    "Білвавана": "Білваван",
    "Талавана": "Талаван",

    # -kumāra → -кумар
    "кумара": "кумар",
    "Кумара": "Кумар",

    # -sandeśa → -сандеш
    "сандеша": "сандеш",
    "Сандеша": "Сандеш",

    # Інші закінчення без -а
    "брахмана": "брахман",
    "Брахмана": "Брахман",
    "вайшнава": "вайшнав",
    "Вайшнава": "Вайшнав",
    "ґандгарва": "ґандгарв",
    "Ґандгарва": "Ґандгарв",
    "ракшаса": "ракшас",
    "Ракшаса": "Ракшас",
    "Пандава": "Пандав",
    "пандава": "пандав",
    "кшатріа": "кшатрій",
    "чандала": "чандал",

    # Географічні
    "Навадвіпа": "Навадвіп",
    "Хастінапура": "Хастінапур",

    # Титули
    "Тхакура": "Тхакур",
    "Махараджа": "Махарадж",
    "пандіта": "пандіт",
    "Пандіта": "Пандіт",

    # Терміни
    "бгаджана": "бгаджан",
    "Бгаджана": "Бгаджан",
    "прасада": "прасад",
    "Прасада": "Прасад",
    "махапрасада": "махапрасад",
    "тілака": "тілак",
    "матха": "матх",
    "Матха": "Матх",
    "ґгата": "ґгат",

    # Імена на -man/-bar/-gar
    "Лакшмана": "Лакшман",
    "Нароттама": "Нароттам",
    "Дамодара": "Дамодар",
    "Шрідгара": "Шрідгар",
    "Вішвамбара": "Вішвамбар",
    "Ніламбара": "Ніламбар",
    "Ґопала": "Ґопал",
    "Субала": "Субал",
    "Лочана": "Лочан",
    "Ішана": "Ішан",
    "саґара": "саґар",
}

# Імена/слова З фінальною -а (залишаємо)
NAMES_WITH_FINAL_A = {
    # -deva (завжди з -а)
    "Шукадев": "Шукадева",
    "Васудев": "Васудева",
    "Баладев": "Баладева",
    "Нрісімхадев": "Нрісімхадева",
    "Махадев": "Махадева",
    "Камадев": "Камадева",
    "ґурудев": "ґурудева",

    # -ratha (завжди з -а)
    "Дашаратх": "Дашаратха",
    "Чітраратх": "Чітраратха",
    "Бріхадратх": "Бріхадратха",

    # -āsura (завжди з -а)
    "Врітрасур": "Врітрасура",
    "Денукасур": "Денукасура",

    # -ava (завжди з -а)
    "Уддгав": "Уддгава",
    "Мадгав": "Мадгава",

    # -pāda (Прабгупада)
    "Прабгупад": "Прабгупада",
}

# Правила апострофа (р'я, д'я, ш'я замість рья, дья, шья)
APOSTROPHE_FIXES = {
    # р + я → р'я
    "ачарья": "ачар'я",
    "Ачарья": "Ачар'я",
    "мадгурья": "мадгур'я",
    "Мадгурья": "Мадгур'я",
    "антарьямі": "антар'ямі",
    "вайшья": "вайш'я",
    "Вайшья": "Вайш'я",
    "відья": "від'я",
    "Відья": "Від'я",

    # Виняток: нья → нья (м'який знак, не апостроф)
    # Чайтанья, Нітьянанда - правильно з ь
}

# М'який знак (нь замість н')
SOFT_SIGN_FIXES = {
    "Чайтан'я": "Чайтанья",
    "чайтан'я": "чайтанья",
    "Ніт'янанда": "Нітьянанда",
    "ніт'янанда": "нітьянанда",
    "сан'ясі": "санньясі",
    "Сан'ясі": "Санньясі",
    "сан'яса": "саньяса",
    "Сан'яса": "Саньяса",
}

# Придихові приголосні (виправлення помилкових транслітерацій)
ASPIRATED_CONSONANTS = {
    # bh → бг (НЕ бх!)
    "бх": "бг",
    "Бх": "Бг",
    # gh → ґг (НЕ ґх!)
    "ґх": "ґг",
    "Ґх": "Ґг",
    # dh → дг (НЕ дх!)
    "дх": "дг",
    "Дх": "Дг",
}

# Загальні словникові заміни
WORD_REPLACEMENTS_UKR = {
    # Чайтанья-чарітамріта
    "Шрі Чайтан'я-чарітамріта": "Шрі Чайтанья-чарітамріта",
    "Чайтан'я-чарітамріта": "Чайтанья-чарітамріта",
    "Чайтан'я-бгаґавата": "Чайтанья-бгаґавата",
    "Чайтан'я": "Чайтанья",

    # Нітьянанда
    "Ніт'янанда": "Нітьянанда",
    "Ніт'янанди": "Нітьянанди",

    # Інші
    "енерґія": "енергія",
    "енерґії": "енергії",
    "енерґію": "енергію",

    # Ґопінатх
    "Ґопінатга": "Ґопінатха",

    # Санньясі
    "санн'ясі": "санньясі",
    "Санн'ясі": "Санньясі",
}


def clean_string(s: str, apply_ukr: bool = False) -> str:
    if s is None:
        return s
    # Normalize unicode
    s0 = s
    s = unicodedata.normalize('NFC', s)
    # Remove zero-width/control characters
    s = CONTROL_CHARS_RE.sub('', s)
    # Remove private-use and odd glyphs
    s = PRIVATE_USE_RE.sub('', s)
    # Apply mojibake replacements
    for a, b in MOJIBAKE_REPLACEMENTS.items():
        s = s.replace(a, b)
    # Remove stray repeated combining markers (common after decode)
    s = re.sub(r'\uFFFD+', '', s)
    s = re.sub(r'[\uF000-\uF8FF]+', '', s)
    # Trim whitespace
    s = re.sub(r'\s+', ' ', s).strip()
    # Ukrainian dictionary replacements
    if apply_ukr:
        s = apply_ukrainian_rules(s)
    return s


def apply_ukrainian_rules(s: str) -> str:
    """Застосовує всі українські правила транслітерації."""
    if not s:
        return s

    # 1. Придихові приголосні (найперше!)
    for a, b in ASPIRATED_CONSONANTS.items():
        s = s.replace(a, b)

    # 2. М'який знак (перед апострофом, бо можуть бути конфлікти)
    for a, b in SOFT_SIGN_FIXES.items():
        s = s.replace(a, b)

    # 3. Апостроф
    for a, b in APOSTROPHE_FIXES.items():
        s = s.replace(a, b)

    # 4. Імена з фінальною -а (виправляємо неправильно скорочені)
    for a, b in NAMES_WITH_FINAL_A.items():
        # Шукаємо слово на межі (щоб не замінити частину іншого слова)
        pattern = r'\b' + re.escape(a) + r'\b'
        s = re.sub(pattern, b, s)

    # 5. Імена без фінальної -а (прибираємо зайву)
    for a, b in NAMES_WITHOUT_FINAL_A.items():
        pattern = r'\b' + re.escape(a) + r'\b'
        s = re.sub(pattern, b, s)

    # 6. Загальні словникові заміни
    for a, b in WORD_REPLACEMENTS_UKR.items():
        s = s.replace(a, b)

    return s


def process_parsed_file(input_path: str, output_path: str, apply_ukr: bool = False) -> Dict[str, Any]:
    with open(input_path, 'r', encoding='utf8') as f:
        data = json.load(f)

    parsed = data.get('parsed') if isinstance(data, dict) and 'parsed' in data else data
    changed = 0
    total = 0
    for v in parsed:
        total += 1
        for key in ['transliteration', 'word_by_word', 'synonyms_ua', 'translation_ua', 'commentary_ua']:
            if key in v and v.get(key):
                before = v[key]
                after = clean_string(before, apply_ukr=apply_ukr)
                if after != before:
                    v[key] = after
                    changed += 1

    # Save back preserving top-level structure
    out = {'parsed': parsed} if isinstance(data, dict) and 'parsed' in data else parsed
    with open(output_path, 'w', encoding='utf8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    return {'input': input_path, 'output': output_path, 'total_verses': total, 'changed_fields': changed}


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--in', dest='input', required=True)
    p.add_argument('--out', dest='output', required=True)
    p.add_argument('--map', dest='mapfile', required=False, help='JSON file with exact replacements {"old": "new"}')
    p.add_argument('--ukr', dest='ukr', action='store_true', help='Apply Ukrainian word replacements')
    args = p.parse_args()

    mappings = None
    if getattr(args, 'mapfile', None):
        try:
            with open(args.mapfile, 'r', encoding='utf8') as mf:
                mappings = json.load(mf)
        except Exception as e:
            print('Failed to load map file:', e)

    if mappings:
        # apply exact mappings first
        with open(args.input, 'r', encoding='utf8') as f:
            data = json.load(f)
        parsed = data.get('parsed') if isinstance(data, dict) and 'parsed' in data else data
        for v in parsed:
            for key in ['transliteration', 'word_by_word', 'synonyms_ua', 'translation_ua', 'commentary_ua']:
                if key in v and v.get(key):
                    s = v[key]
                    for a, b in mappings.items():
                        if a in s:
                            s = s.replace(a, b)
                    v[key] = s
        tmp_path = args.input + '.mapped.tmp'
        with open(tmp_path, 'w', encoding='utf8') as tf:
            json.dump(data, tf, ensure_ascii=False, indent=2)
        res = process_parsed_file(tmp_path, args.output, apply_ukr=args.ukr)
    else:
        res = process_parsed_file(args.input, args.output, apply_ukr=args.ukr)

    print('Processed:', res)


if __name__ == '__main__':
    main()
