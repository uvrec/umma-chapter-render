"""
lecture_translator.py

Утиліта для перекладу текстів лекцій з англійської на українську
з автоматичною транслітерацією санскритських термінів.

Використовує:
1. Існуючі правила транслітерації з src/utils/text/transliteration.ts
2. Google Translate API або інший сервіс для базового перекладу
3. Постобробку для нормалізації українського тексту

Usage:
    python tools/lecture_translator.py --input lectures/660307bg-new-york.json --output lectures/660307bg-new-york_uk.json
"""

import json
import re
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional

# Маппінг санскритських термінів для транслітерації
# Базується на правилах з src/utils/text/transliteration.ts
SANSKRIT_TRANSLITERATIONS = {
    # Основні імена
    "Krishna": "Крішна",
    "Krsna": "Крішна",
    "Kṛṣṇa": "Крішна",
    "Rama": "Рама",
    "Rāma": "Ра̄ма",
    "Arjuna": "Арджуна",
    "Bhagavad-gita": "Бгаґавад-ґіта",
    "Bhagavad-gītā": "Бгаґавад-ґіта",
    "Srimad-Bhagavatam": "Шрімад-Бгаґаватам",
    "Śrīmad-Bhāgavatam": "Шрімад-Бгаґаватам",
    "Caitanya": "Чайтанья",
    "Chaitanya": "Чайтанья",
    "Nityananda": "Нітьянанда",
    "Prabhupada": "Прабгупада",
    "Vyasadeva": "В'ясадева",
    "Vyāsadeva": "В'я̄садева",

    # Філософські терміни
    "bhakti": "бгакті",
    "bhakti-yoga": "бгакті-йоґа",
    "karma": "карма",
    "karma-yoga": "карма-йоґа",
    "jnana": "джн̃а̄на",
    "jñāna": "джн̃а̄на",
    "yoga": "йоґа",
    "dharma": "дгарма",
    "moksha": "мокша",
    "mokṣa": "мокша",
    "nirvana": "нірвана",
    "nirvaṇa": "нірвана",
    "atma": "атма",
    "ātmā": "а̄тма̄",
    "Paramatma": "Параматма",
    "Paramātmā": "Парама̄тма̄",
    "Brahman": "Браман",
    "maya": "майя",
    "māyā": "ма̄йя̄",
    "guru": "ґуру",
    "mantra": "мантра",
    "kirtan": "кіртан",
    "kīrtana": "кı̄ртана",  # kīrtana → кı̄ртана (dotless i + макрон, БЕЗ крапки!)
    "prasadam": "прасадам",
    "prasādam": "прасадам",
    "sadhana": "садгана",
    "sādhana": "са̄дгана",
    "samsara": "самсара",
    "saṁsāra": "сам̇са̄ра",
    "vedanta": "веданта",
    "Vedānta": "Веда̄нта",
    "upanishad": "упанішад",
    "Upaniṣad": "Упанішад",

    # Титули
    "Swami": "Свамі",
    "Goswami": "Ґосвамі",
    "Prabhupāda": "Прабгупа̄да",
    "Śrīla": "Шріла",
    "Srila": "Шріла",

    # Загальні слова
    "Sanskrit": "санскрит",
    "Vedic": "ведичний",
    "spiritual": "духовний",
    "consciousness": "свідомість",
    "transcendental": "трансцендентний",
}

# Діакритичні маппінги (IAST -> UA)
DIACRITIC_MAPPINGS = {
    "ā": "а̄",
    "ī": "ı̄",  # ī → ı̄ (dotless i + макрон, БЕЗ крапки!)
    "ū": "ӯ",
    "ṛ": "р̣",
    "ṝ": "р̣̄",
    "ḷ": "л̣",
    "ḹ": "л̣̄",
    "ṃ": "м̇",
    "ṁ": "м̇",
    "ḥ": "х̣",
    "ṇ": "н̣",
    "ṭ": "т̣",
    "ḍ": "д̣",
    "ś": "ш́",
    "ṣ": "ш",
    "ñ": "н̃",
}


class LectureTranslator:
    def __init__(self):
        self.sanskrit_pattern = re.compile(
            r'\b(' + '|'.join(re.escape(k) for k in SANSKRIT_TRANSLITERATIONS.keys()) + r')\b',
            re.IGNORECASE
        )

    def transliterate_sanskrit_terms(self, text: str) -> str:
        """
        Транслітерація санскритських термінів у тексті
        """
        def replace_term(match):
            term = match.group(0)
            # Зберігаємо капіталізацію
            key = None
            for k in SANSKRIT_TRANSLITERATIONS:
                if k.lower() == term.lower():
                    key = k
                    break

            if key:
                result = SANSKRIT_TRANSLITERATIONS[key]
                # Якщо оригінал починався з великої літери
                if term[0].isupper():
                    result = result[0].upper() + result[1:]
                return result

            return term

        return self.sanskrit_pattern.sub(replace_term, text)

    def apply_diacritic_mapping(self, text: str) -> str:
        """
        Застосування діакритичних маркерів для залишених санскритських слів
        """
        for iast, ua in DIACRITIC_MAPPINGS.items():
            text = text.replace(iast, ua)

        return text

    def normalize_ukrainian_text(self, text: str) -> str:
        """
        Нормалізація українського тексту
        Застосування правил з src/utils/textNormalizer.ts
        """
        # Базова нормалізація пробілів
        text = re.sub(r'\s+', ' ', text).strip()

        # Апостроф замість м'якого знаку для певних слів
        # (виключення: Чайтанья, Нітьянанда тощо вже транслітеровані)

        # Видалення зайвих розділових знаків
        text = re.sub(r'([,.:;!?])\1+', r'\1', text)

        # Заміна англійських лапок на українські «»
        text = re.sub(r'"([^"]+)"', r'«\1»', text)

        return text

    def translate_paragraph(
        self,
        text_en: str,
        use_machine_translation: bool = False
    ) -> str:
        """
        Переклад одного параграфа

        Етапи:
        1. Транслітерація санскритських термінів
        2. (Опціонально) Машинний переклад базового тексту
        3. Нормалізація українського тексту
        4. Застосування діакритичних маркерів

        NOTE: Для повноцінного перекладу потрібен API ключ від Google Translate
        або іншого сервісу. Наразі робимо тільки транслітерацію термінів.
        """
        # Крок 1: Транслітерація санскритських термінів
        result = self.transliterate_sanskrit_terms(text_en)

        # Крок 2: Машинний переклад (якщо потрібно)
        if use_machine_translation:
            # TODO: Інтеграція з Google Translate API або іншим сервісом
            # from googletrans import Translator
            # translator = Translator()
            # result = translator.translate(result, src='en', dest='uk').text
            pass

        # Крок 3: Застосування діакритичних маркерів
        result = self.apply_diacritic_mapping(result)

        # Крок 4: Нормалізація
        result = self.normalize_ukrainian_text(result)

        return result

    def translate_lecture_data(
        self,
        lecture_data: Dict[str, Any],
        use_machine_translation: bool = False
    ) -> Dict[str, Any]:
        """
        Переклад всієї лекції з англійської на українську
        """
        result = lecture_data.copy()

        # Переклад метаданих вже є в metadata
        # Перекладаємо параграфи
        if "paragraphs" in result:
            for paragraph in result["paragraphs"]:
                if "content_en" in paragraph:
                    paragraph["content_uk"] = self.translate_paragraph(
                        paragraph["content_en"],
                        use_machine_translation
                    )

        return result


def main():
    parser = argparse.ArgumentParser(
        description="Переклад лекцій з англійської на українську з транслітерацією"
    )
    parser.add_argument(
        "--input",
        type=str,
        required=True,
        help="Шлях до вхідного JSON файлу (англійська версія)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Шлях до вихідного JSON файлу (за замовчуванням: {input}_uk.json)",
    )
    parser.add_argument(
        "--use-mt",
        action="store_true",
        help="Використовувати машинний переклад (потрібен API ключ)",
    )

    args = parser.parse_args()

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"[ERROR] Файл не знайдено: {input_path}")
        return

    # Завантаження даних
    with open(input_path, "r", encoding="utf-8") as f:
        lecture_data = json.load(f)

    # Переклад
    translator = LectureTranslator()
    translated_data = translator.translate_lecture_data(
        lecture_data,
        use_machine_translation=args.use_mt
    )

    # Визначити вихідний файл
    if args.output:
        output_path = Path(args.output)
    else:
        output_path = input_path.parent / f"{input_path.stem}_uk.json"

    # Збереження результату
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)

    print(f"[SUCCESS] Переклад збережено в {output_path}")
    print(f"[INFO] Перекладено {len(translated_data.get('paragraphs', []))} параграфів")


if __name__ == "__main__":
    main()
