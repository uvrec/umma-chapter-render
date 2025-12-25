"""
lectures_importer.py

Імпортер лекцій з Vedabase для двох мов (EN та UA)

Usage:
    pip install requests beautifulsoup4 lxml
    python tools/lectures_importer.py --slug 660307bg-new-york

Етапи:
1. Парсинг HTML з vedabase.io/en/library/transcripts/
2. Витяг метаданих (дата, місце, тип, аудіо URL)
3. Витяг параграфів лекції з англійською версією
4. Переклад на українську з транслітерацією санскритських термінів
5. Збереження в JSON для подальшого імпорту в БД

Notes:
- Використовує існуючі інструменти транслітерації
- Зберігає санскритські терміни для глосарія
- Підтримує синхронізацію з аудіо (timecodes)
"""

import requests
from bs4 import BeautifulSoup, NavigableString, Tag
import time
import json
import re
import sys
import argparse
from typing import Optional, Dict, Any, List
from datetime import datetime
from pathlib import Path

# Headers для запитів
HEADERS = {"User-Agent": "vedavoice-lectures-importer/1.0 (+https://vedavoice.org)"}

# Маппінг типів лекцій для української мови
LECTURE_TYPE_TRANSLATIONS = {
    "Conversation": "Розмова",
    "Walk": "Прогулянка",
    "Morning Walk": "Ранкова прогулянка",
    "Lecture": "Лекція",
    "Bhagavad-gita": "Лекція з Бгаґавад-ґіти",
    "Srimad-Bhagavatam": "Лекція з Шрімад-Бгаґаватам",
    "Nectar of Devotion": "Лекція з Нектару відданості",
    "Sri Isopanisad": "Лекція з Шрі Ішопанішад",
    "Sri Caitanya-caritamrta": "Лекція з Шрі Чайтанья-чарітамріта",
    "Initiation": "Ініціація",
    "Room Conversation": "Розмова в кімнаті",
    "Interview": "Інтерв'ю",
    "Arrival": "Прибуття",
    "Departure": "Від'їзд",
    "Festival": "Фестиваль",
    "Bhajan": "Бгаджан",
    "Kirtan": "Кіртан",
    "Other": "Інше",
}

# Маппінг міст для української мови (основні)
LOCATION_TRANSLATIONS = {
    "New York": "Нью-Йорк",
    "Los Angeles": "Лос-Анджелес",
    "San Francisco": "Сан-Франциско",
    "London": "Лондон",
    "Paris": "Париж",
    "Bombay": "Бомбей",
    "Mumbai": "Мумбаї",
    "Calcutta": "Калькутта",
    "Kolkata": "Колката",
    "Vrindavan": "Вріндаван",
    "Vrndavana": "Вріндаван",
    "Mayapur": "Маяпур",
    "Māyāpur": "Маяпур",
    "Navadvipa": "Навадвіпа",
    "Jagannatha Puri": "Джаґаннатха Пурі",
    "Delhi": "Делі",
    "Hyderabad": "Хайдарабад",
    "Bangalore": "Бангалор",
    "Honolulu": "Гонолулу",
    "Tokyo": "Токіо",
    "Melbourne": "Мельбурн",
    "Sydney": "Сідней",
    "Montreal": "Монреаль",
    "Toronto": "Торонто",
    "Boston": "Бостон",
    "Chicago": "Чикаго",
    "Detroit": "Детройт",
    "Seattle": "Сіетл",
    "Dallas": "Даллас",
    "Atlanta": "Атланта",
    "Hawaii": "Гаваї",
    "Germany": "Німеччина",
    "France": "Франція",
    "India": "Індія",
    "USA": "США",
    "UK": "Великобританія",
    "Australia": "Австралія",
    "Canada": "Канада",
    "Japan": "Японія",
}


class LecturesImporter:
    def __init__(self, delay_seconds: float = 2.0):
        self.delay = delay_seconds
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.sanskrit_terms = set()  # Колекція санскритських термінів для глосарія

    def fetch_url(self, url: str) -> Optional[str]:
        """Завантажити HTML з URL"""
        try:
            time.sleep(self.delay)  # Rate limiting
            r = self.session.get(url, timeout=30)
            r.raise_for_status()
            return r.text
        except Exception as e:
            print(f"[ERROR] Не вдалося завантажити {url}: {e}")
            return None

    def parse_lecture_metadata(self, html: str, slug: str) -> Optional[Dict[str, Any]]:
        """
        Витягнути метадані лекції з HTML
        Повертає: {
            'title_en': str,
            'lecture_date': str (YYYY-MM-DD),
            'location_en': str,
            'lecture_type': str,
            'audio_url': str | None,
            'book_slug': str | None,
            'chapter_number': int | None,
            'verse_number': str | None,
        }
        """
        soup = BeautifulSoup(html, "lxml")
        metadata = {
            "slug": slug,
            "title_en": None,
            "lecture_date": None,
            "location_en": None,
            "lecture_type": "Lecture",
            "audio_url": None,
            "book_slug": None,
            "chapter_number": None,
            "verse_number": None,
        }

        # Витягнути заголовок
        title_tag = soup.find("h1") or soup.find("title")
        if title_tag:
            metadata["title_en"] = title_tag.get_text(strip=True)

        # Спробувати знайти дату, місце, тип в метаданих сторінки
        # Зазвичай вони в хедері або в спеціальних div-ах

        # Шукаємо дату в різних можливих форматах
        date_patterns = [
            r"(\w+ \d{1,2}(?:st|nd|rd|th)?,? \d{4})",  # "March 7th 1966" або "March 7, 1966"
            r"(\d{4}-\d{2}-\d{2})",  # ISO format
        ]

        page_text = soup.get_text()
        for pattern in date_patterns:
            date_match = re.search(pattern, page_text)
            if date_match:
                date_str = date_match.group(1)
                metadata["lecture_date"] = self._parse_date(date_str)
                if metadata["lecture_date"]:
                    break

        # Парсинг з URL slug якщо дата не знайдена
        if not metadata["lecture_date"]:
            metadata["lecture_date"] = self._parse_date_from_slug(slug)

        # Шукаємо локацію (зазвичай після дати)
        location_pattern = r"(?:in |at |— |, )([A-Z][a-zA-Z\s]+?)(?:\s*$|\s*\||\s*—)"
        loc_match = re.search(location_pattern, page_text[:500])
        if loc_match:
            metadata["location_en"] = loc_match.group(1).strip()

        # Визначити тип лекції з заголовка або slug
        title_lower = (metadata["title_en"] or "").lower()
        if "bhagavad" in title_lower or "gita" in title_lower or "bg" in slug:
            metadata["lecture_type"] = "Bhagavad-gita"
            metadata["book_slug"] = "bg"
        elif "bhagavatam" in title_lower or "sb" in slug:
            metadata["lecture_type"] = "Srimad-Bhagavatam"
            metadata["book_slug"] = "sb"
        elif "caitanya" in title_lower or "cc" in slug:
            metadata["lecture_type"] = "Sri Caitanya-caritamrta"
            metadata["book_slug"] = "cc"
        elif "walk" in title_lower or "walk" in slug:
            metadata["lecture_type"] = "Morning Walk"
        elif "conversation" in title_lower or "conv" in slug:
            metadata["lecture_type"] = "Conversation"
        elif "initiation" in title_lower:
            metadata["lecture_type"] = "Initiation"

        # Витягнути номери розділів/віршів з заголовка
        verse_pattern = r"(\d+)\.(\d+(?:-\d+)?)"
        verse_match = re.search(verse_pattern, metadata["title_en"] or "")
        if verse_match:
            metadata["chapter_number"] = int(verse_match.group(1))
            metadata["verse_number"] = verse_match.group(2)

        # Шукаємо аудіо URL
        audio_tag = soup.find("audio") or soup.find("source", {"type": "audio/mpeg"})
        if audio_tag:
            metadata["audio_url"] = audio_tag.get("src")

        return metadata

    def parse_lecture_content(self, html: str) -> List[Dict[str, Any]]:
        """
        Витягнути параграфи лекції з HTML
        Повертає: [
            {
                'paragraph_number': int,
                'content_en': str,
                'audio_timecode': int | None,
                'sanskrit_terms': List[str]
            }
        ]
        """
        soup = BeautifulSoup(html, "lxml")
        paragraphs = []

        # Знайти основний контент лекції
        # Vedabase використовує div.copy для параграфів
        main_content = soup.find("main")

        if not main_content:
            print("[WARNING] Не знайдено main контейнер")
            main_content = soup.find("body")

        if not main_content:
            print("[WARNING] Не знайдено контент лекції")
            return []

        # Vedabase структура: параграфи в div з класом "copy" або "em-mb-4"
        # Шукаємо div елементи з класом "copy" (основний контент)
        para_tags = main_content.find_all("div", class_=lambda c: c and "copy" in c)

        # Якщо не знайдено, спробувати стандартні <p> теги
        if not para_tags:
            para_tags = main_content.find_all("p")

        paragraph_number = 0
        for p_tag in para_tags:
            text = p_tag.get_text(separator=" ", strip=True)

            # Пропустити порожні або дуже короткі параграфи
            if not text or len(text) < 10:
                continue

            # Пропустити елементи навігації та UI (зазвичай містять специфічні паттерни)
            text_lower = text.lower()
            if any(skip in text_lower for skip in [
                "previous", "next", "share", "download", "copyright",
                "all rights reserved", "vedabase.io"
            ]):
                continue

            paragraph_number += 1

            # Витягнути санскритські терміни (слова в курсиві або з діакритичними знаками)
            sanskrit_terms = self._extract_sanskrit_terms(p_tag, text)

            # Витягнути timecode якщо є (data-time або id з часом)
            timecode = self._extract_timecode(p_tag)

            paragraph = {
                "paragraph_number": paragraph_number,
                "content_en": text,
                "audio_timecode": timecode,
                "sanskrit_terms": sanskrit_terms,
            }

            paragraphs.append(paragraph)

        return paragraphs

    def _extract_sanskrit_terms(self, tag: Tag, text: str) -> List[str]:
        """Витягнути санскритські терміни з параграфа"""
        terms = []

        # 1. Шукаємо слова в курсиві або em тегах
        for italic in tag.find_all(["i", "em"]):
            term = italic.get_text(strip=True)
            if term and len(term) > 2:
                terms.append(term)
                self.sanskrit_terms.add(term)

        # 2. Шукаємо слова з діакритичними знаками
        diacritic_pattern = r'\b\w*[āīūṛṝḷḹēōṃḥṇṭḍśṣ]\w*\b'
        diacritic_terms = re.findall(diacritic_pattern, text, re.IGNORECASE)
        for term in diacritic_terms:
            if len(term) > 2:
                terms.append(term)
                self.sanskrit_terms.add(term)

        return list(set(terms))  # Унікальні терміни

    def _extract_timecode(self, tag: Tag) -> Optional[int]:
        """Витягнути timecode з параграфа (якщо є)"""
        # data-time атрибут
        if tag.has_attr("data-time"):
            try:
                return int(tag["data-time"])
            except:
                pass

        # id з часом (наприклад, id="t-120" для 120 секунд)
        if tag.has_attr("id"):
            match = re.match(r"t-(\d+)", tag["id"])
            if match:
                return int(match.group(1))

        return None

    def _parse_date(self, date_str: str) -> Optional[str]:
        """Парсити дату в формат YYYY-MM-DD"""
        # Спробувати різні формати дат
        formats = [
            "%B %d, %Y",      # "March 7, 1966"
            "%B %dst, %Y",    # "March 1st, 1966"
            "%B %dnd, %Y",    # "March 2nd, 1966"
            "%B %drd, %Y",    # "March 3rd, 1966"
            "%B %dth, %Y",    # "March 7th, 1966"
            "%Y-%m-%d",       # "1966-03-07"
            "%d/%m/%Y",       # "07/03/1966"
        ]

        # Видалити суфікси дат (st, nd, rd, th)
        cleaned = re.sub(r'(\d+)(st|nd|rd|th)', r'\1', date_str)

        for fmt in formats:
            try:
                dt = datetime.strptime(cleaned, fmt)
                return dt.strftime("%Y-%m-%d")
            except:
                continue

        return None

    def _parse_date_from_slug(self, slug: str) -> Optional[str]:
        """
        Витягнути дату зі slug
        Формат: 660307bg-new-york -> 1966-03-07
        """
        # Slug формат: YYMMDD...
        match = re.match(r"(\d{2})(\d{2})(\d{2})", slug)
        if match:
            yy, mm, dd = match.groups()
            # Припускаємо, що це 1900-ті якщо YY > 50, інакше 2000-ті
            year = f"19{yy}" if int(yy) > 50 else f"20{yy}"
            try:
                dt = datetime(int(year), int(mm), int(dd))
                return dt.strftime("%Y-%m-%d")
            except:
                pass

        return None

    def translate_metadata_to_ua(self, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Перекласти метадані на українську"""
        ua_metadata = metadata.copy()

        # Перекласти тип лекції
        lecture_type = metadata.get("lecture_type", "Lecture")
        ua_metadata["lecture_type_ua"] = LECTURE_TYPE_TRANSLATIONS.get(
            lecture_type, lecture_type
        )

        # Перекласти локацію
        location_en = metadata.get("location_en", "")
        ua_metadata["location_ua"] = LOCATION_TRANSLATIONS.get(
            location_en, location_en
        )

        # Перекласти заголовок (базова транслітерація санскритських термінів)
        title_en = metadata.get("title_en", "")
        ua_metadata["title_ua"] = self._transliterate_title(title_en)

        return ua_metadata

    def _transliterate_title(self, title: str) -> str:
        """
        Базова транслітерація заголовка
        Використовує прості заміни для санскритських назв
        """
        replacements = {
            "Bhagavad-gita": "Бгаґавад-ґіта",
            "Bhagavad-gītā": "Бгаґавад-ґіта",
            "Srimad-Bhagavatam": "Шрімад-Бгаґаватам",
            "Śrīmad-Bhāgavatam": "Шрімад-Бгаґаватам",
            "Caitanya-caritamrta": "Чайтанья-чарітамріта",
            "Sri Caitanya-caritāmṛta": "Шрі Чайтанья-чарітамріта",
            "Sri Isopanisad": "Шрі Ішопанішад",
            "Nectar of Devotion": "Нектар відданості",
            "Nectar of Instruction": "Нектар настанов",
            "Introduction": "Вступ",
            "Purport": "Коментар",
            "Lecture": "Лекція",
            "Walk": "Прогулянка",
            "Conversation": "Розмова",
        }

        result = title
        for en, ua in replacements.items():
            result = result.replace(en, ua)

        return result

    def import_lecture(self, slug: str) -> Optional[Dict[str, Any]]:
        """
        Імпортувати повну лекцію за slug
        Повертає JSON структуру готову для збереження в БД
        """
        url = f"https://vedabase.io/en/library/transcripts/{slug}/"
        print(f"[INFO] Завантаження лекції: {url}")

        html = self.fetch_url(url)
        if not html:
            return None

        # Парсинг метаданих
        metadata = self.parse_lecture_metadata(html, slug)
        if not metadata:
            print(f"[ERROR] Не вдалося витягнути метадані для {slug}")
            return None

        # Парсинг контенту
        paragraphs = self.parse_lecture_content(html)
        if not paragraphs:
            print(f"[WARNING] Не знайдено параграфів для {slug}")

        # Переклад метаданих на українську
        ua_metadata = self.translate_metadata_to_ua(metadata)

        # Формування результату
        result = {
            "metadata": {
                "slug": slug,
                "title_en": metadata["title_en"],
                "title_ua": ua_metadata["title_ua"],
                "lecture_date": metadata["lecture_date"],
                "location_en": metadata["location_en"],
                "location_ua": ua_metadata["location_ua"],
                "lecture_type": metadata["lecture_type"],
                "lecture_type_ua": ua_metadata["lecture_type_ua"],
                "audio_url": metadata["audio_url"],
                "book_slug": metadata["book_slug"],
                "chapter_number": metadata["chapter_number"],
                "verse_number": metadata["verse_number"],
            },
            "paragraphs": paragraphs,
            "sanskrit_terms": list(self.sanskrit_terms),
        }

        print(f"[SUCCESS] Імпортовано {len(paragraphs)} параграфів")
        print(f"[INFO] Знайдено {len(self.sanskrit_terms)} санскритських термінів")

        return result

    def save_to_json(self, data: Dict[str, Any], output_file: str):
        """Зберегти дані в JSON файл"""
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"[SUCCESS] Збережено в {output_file}")


def main():
    parser = argparse.ArgumentParser(
        description="Імпорт лекцій з Vedabase для двох мов (EN та UA)"
    )
    parser.add_argument(
        "--slug",
        type=str,
        required=True,
        help="Slug лекції (наприклад, 660307bg-new-york)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Шлях до output JSON файлу (за замовчуванням: tools/outputs/lectures/{slug}.json)",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=2.0,
        help="Затримка між запитами в секундах (за замовчуванням: 2.0)",
    )

    args = parser.parse_args()

    # Ініціалізація імпортера
    importer = LecturesImporter(delay_seconds=args.delay)

    # Імпорт лекції
    lecture_data = importer.import_lecture(args.slug)

    if not lecture_data:
        print(f"[ERROR] Не вдалося імпортувати лекцію {args.slug}")
        sys.exit(1)

    # Визначити output файл
    if args.output:
        output_file = args.output
    else:
        output_file = f"tools/outputs/lectures/{args.slug}.json"

    # Зберегти результат
    importer.save_to_json(lecture_data, output_file)

    print("[DONE] Імпорт завершено успішно!")


if __name__ == "__main__":
    main()
