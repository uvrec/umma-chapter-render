#!/usr/bin/env python3
"""
content_translator.py

Автопереклад лекцій та листів з англійської на українську
з використанням транслітерації санскритських термінів та нормалізації.

Інтегрує:
- tools/lecture_translator.py (транслітерація санскриту)
- tools/translit_normalizer.py (нормалізація тексту)

Usage:
    # Переклад однієї лекції
    python tools/content_translator.py --type lectures --file tools/outputs/lectures/660307bg-new-york.json

    # Масовий переклад всіх лекцій
    python tools/content_translator.py --type lectures --all

    # Переклад з машинним перекладом (потрібен API)
    python tools/content_translator.py --type lectures --all --use-mt --api-key YOUR_API_KEY

Requirements:
    pip install openai python-dotenv
"""

import os
import sys
import json
import re
import argparse
from pathlib import Path
from typing import Dict, Any, List, Optional
import unicodedata
from concurrent.futures import ThreadPoolExecutor, as_completed

from dotenv import load_dotenv

# Завантажити .env
load_dotenv()

# Імпортуємо з існуючих модулів
try:
    from lecture_translator import SANSKRIT_TRANSLITERATIONS, DIACRITIC_MAPPINGS
    from translit_normalizer import clean_string, WORD_REPLACEMENTS_UKR
except ImportError:
    # Fallback якщо імпорт не працює
    SANSKRIT_TRANSLITERATIONS = {
        "Krishna": "Крішна",
        "Krsna": "Крішна",
        "Kṛṣṇa": "Крішна",
        "Rama": "Рама",
        "Arjuna": "Арджуна",
        "Bhagavad-gita": "Бгаґавад-ґіта",
        "Srimad-Bhagavatam": "Шрімад-Бгаґаватам",
        "Caitanya": "Чайтанья",
        "Prabhupada": "Прабгупада",
        "bhakti": "бгакті",
        "karma": "карма",
        "yoga": "йоґа",
        "dharma": "дгарма",
        "guru": "ґуру",
        "mantra": "мантра",
    }

    DIACRITIC_MAPPINGS = {
        "ā": "а̄",
        "ī": "ī",
        "ū": "ӯ",
        "ṛ": "р̣",
        "ṃ": "м̇",
        "ḥ": "х̣",
        "ṇ": "н̣",
        "ṭ": "т̣",
        "ḍ": "д̣",
        "ś": "ш́",
        "ṣ": "ш",
        "ñ": "н̃",
    }

    WORD_REPLACEMENTS_UKR = {
        "Шрі Чайтан'я-чарітамріта": "Шрі Чайтанья-чарітамріта",
        "Чайтан'я": "Чайтанья",
        "Ніт'янанда": "Нітьянанда",
        "енерґія": "енергія",
    }

    def clean_string(s: str, apply_ukr: bool = False) -> str:
        if s is None:
            return s
        s = unicodedata.normalize('NFC', s)
        s = re.sub(r'\s+', ' ', s).strip()
        if apply_ukr:
            for a, b in WORD_REPLACEMENTS_UKR.items():
                s = s.replace(a, b)
        return s


class ContentTranslator:
    """Перекладач контенту лекцій та листів"""

    def __init__(
        self,
        content_type: str = "lectures",
        use_machine_translation: bool = False,
        api_key: Optional[str] = None,
    ):
        self.content_type = content_type
        self.use_mt = use_machine_translation
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")

        if content_type == "lectures":
            self.input_dir = Path("tools/outputs/lectures")
            self.output_dir = Path("tools/outputs/lectures_ua")
        else:
            self.input_dir = Path("tools/outputs/letters")
            self.output_dir = Path("tools/outputs/letters_ua")

        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Компіляція regex для санскриту
        self.sanskrit_pattern = re.compile(
            r'\b(' + '|'.join(re.escape(k) for k in SANSKRIT_TRANSLITERATIONS.keys()) + r')\b',
            re.IGNORECASE
        )

    def transliterate_sanskrit(self, text: str) -> str:
        """Транслітерація санскритських термінів"""
        def replace_match(match):
            term = match.group(0)
            for key, value in SANSKRIT_TRANSLITERATIONS.items():
                if key.lower() == term.lower():
                    # Зберігаємо регістр
                    if term[0].isupper():
                        return value[0].upper() + value[1:]
                    return value
            return term

        return self.sanskrit_pattern.sub(replace_match, text)

    def apply_diacritics(self, text: str) -> str:
        """Застосування діакритичних маркерів IAST -> UA"""
        for iast, ua in DIACRITIC_MAPPINGS.items():
            text = text.replace(iast, ua)
        return text

    def normalize_text(self, text: str) -> str:
        """Нормалізація українського тексту"""
        # Базова нормалізація
        text = clean_string(text, apply_ukr=True)

        # Українські лапки
        text = re.sub(r'"([^"]+)"', r'«\1»', text)

        # Видалення подвійних розділових знаків
        text = re.sub(r'([,.:;!?])\1+', r'\1', text)

        return text

    def translate_with_openai(self, text: str) -> str:
        """Машинний переклад через OpenAI API"""
        if not self.api_key:
            print("[WARN] No OpenAI API key, skipping machine translation")
            return text

        try:
            import openai
            openai.api_key = self.api_key

            response = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": """Ти — перекладач духовних текстів з англійської на українську.

Правила:
1. Зберігай санскритські терміни в курсиві (Kṛṣṇa, bhakti, yoga тощо)
2. Транслітеруй санскритські імена українською (Krishna -> Крішна, Arjuna -> Арджуна)
3. Використовуй українську православну термінологію де доречно
4. Зберігай духовний контекст і тон оригіналу
5. Не додавай власних коментарів чи пояснень"""
                    },
                    {
                        "role": "user",
                        "content": f"Переклади на українську:\n\n{text}"
                    }
                ],
                temperature=0.3,
                max_tokens=4000,
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"[ERROR] OpenAI translation failed: {e}")
            return text

    def translate_text(self, text: str) -> str:
        """Переклад тексту з усіма кроками"""
        if not text:
            return text

        # Крок 1: Транслітерація санскриту
        result = self.transliterate_sanskrit(text)

        # Крок 2: Машинний переклад (якщо увімкнено)
        if self.use_mt:
            result = self.translate_with_openai(result)

        # Крок 3: Діакритичні маркери
        result = self.apply_diacritics(result)

        # Крок 4: Нормалізація
        result = self.normalize_text(result)

        return result

    def translate_lecture(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Переклад даних лекції"""
        result = data.copy()

        # Переклад параграфів
        if "paragraphs" in result:
            for paragraph in result["paragraphs"]:
                if "content_en" in paragraph:
                    content_en = paragraph["content_en"]
                    paragraph["content_ua"] = self.translate_text(content_en)

        return result

    def translate_letter(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Переклад даних листа"""
        result = data.copy()

        # Переклад контенту
        if "content_en" in result:
            result["content_ua"] = self.translate_text(result["content_en"])

        return result

    def process_file(self, input_path: Path) -> bool:
        """Обробити один файл"""
        try:
            # Завантажити дані
            with open(input_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            # Переклад
            if self.content_type == "lectures":
                translated = self.translate_lecture(data)
            else:
                translated = self.translate_letter(data)

            # Зберегти результат
            output_path = self.output_dir / input_path.name
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(translated, f, ensure_ascii=False, indent=2)

            print(f"[SUCCESS] Translated: {input_path.name}")
            return True

        except Exception as e:
            print(f"[ERROR] Failed to translate {input_path.name}: {e}")
            return False

    def process_all(self, limit: Optional[int] = None, workers: int = 1):
        """Обробити всі файли"""
        json_files = list(self.input_dir.glob("*.json"))

        # Виключити службові файли
        json_files = [f for f in json_files if f.stem not in ["all_slugs", "all_sanskrit_terms"]]

        if limit:
            json_files = json_files[:limit]

        total = len(json_files)
        success_count = 0
        fail_count = 0

        print(f"\n{'='*60}")
        print(f"  Content Translator - {self.content_type.upper()}")
        print(f"{'='*60}")
        print(f"  Files to process: {total}")
        print(f"  Machine translation: {'ON' if self.use_mt else 'OFF'}")
        print(f"  Workers: {workers}")
        print(f"{'='*60}\n")

        if workers > 1 and not self.use_mt:
            # Паралельна обробка (без MT)
            with ThreadPoolExecutor(max_workers=workers) as executor:
                futures = {executor.submit(self.process_file, f): f for f in json_files}

                for future in as_completed(futures):
                    if future.result():
                        success_count += 1
                    else:
                        fail_count += 1
        else:
            # Послідовна обробка
            for i, file_path in enumerate(json_files, 1):
                print(f"\n[{i}/{total}] Processing: {file_path.name}")

                if self.process_file(file_path):
                    success_count += 1
                else:
                    fail_count += 1

        print(f"\n{'='*60}")
        print(f"  TRANSLATION COMPLETE")
        print(f"{'='*60}")
        print(f"  Total: {total}")
        print(f"  Success: {success_count}")
        print(f"  Failed: {fail_count}")
        print(f"{'='*60}\n")


def main():
    parser = argparse.ArgumentParser(
        description="Автопереклад лекцій та листів на українську"
    )
    parser.add_argument(
        "--type",
        type=str,
        choices=["lectures", "letters"],
        default="lectures",
        help="Тип контенту для перекладу",
    )
    parser.add_argument(
        "--file",
        type=str,
        default=None,
        help="Шлях до конкретного JSON файлу",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Обробити всі файли",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Максимальна кількість файлів",
    )
    parser.add_argument(
        "--use-mt",
        action="store_true",
        help="Використовувати машинний переклад (OpenAI)",
    )
    parser.add_argument(
        "--api-key",
        type=str,
        default=None,
        help="OpenAI API ключ",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=1,
        help="Кількість паралельних воркерів (тільки без MT)",
    )

    args = parser.parse_args()

    translator = ContentTranslator(
        content_type=args.type,
        use_machine_translation=args.use_mt,
        api_key=args.api_key,
    )

    if args.file:
        # Один файл
        file_path = Path(args.file)
        if not file_path.exists():
            print(f"[ERROR] File not found: {file_path}")
            sys.exit(1)

        success = translator.process_file(file_path)
        sys.exit(0 if success else 1)

    elif args.all:
        # Всі файли
        translator.process_all(limit=args.limit, workers=args.workers)

    else:
        print("[ERROR] Specify --file or --all")
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
