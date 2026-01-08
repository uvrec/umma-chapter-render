"""
vaniquotes_parser.py

Парсер цитат з Vaniquotes.org (MediaWiki API)

Usage:
    pip install requests beautifulsoup4 lxml

    # Парсити категорію цитат
    python tools/vaniquotes_parser.py --category "Yei_krsna-tattva-vetta_Sei_Guru_Haya"

    # Парсити конкретну сторінку цитати
    python tools/vaniquotes_parser.py --page "A_guru_must_be_a_direct_representative_of_Krsna"

    # Парсити всі цитати теми з підкатегоріями
    python tools/vaniquotes_parser.py --topic "Spiritual_Master" --limit 100

    # Список всіх категорій
    python tools/vaniquotes_parser.py --list-categories

Структура Vaniquotes:
- API: https://vaniquotes.org/w/api.php
- Категорії: Category:Topic_Name
- Сторінки цитат: Quote_title

Вихідний формат:
{
    "quote_id": "unique_slug",
    "title": "Quote title",
    "categories": ["Category1", "Category2"],
    "quotes": [
        {
            "text": "Full quote text...",
            "source_type": "book|lecture|conversation|letter",
            "source_reference": "BG 2.14 Purport",
            "book_slug": "bg",
            "chapter": 2,
            "verse": 14,
            "date": "1966-02-19",
            "location": "New York"
        }
    ]
}
"""

import requests
from bs4 import BeautifulSoup, Tag
import time
import json
import re
import sys
import argparse
from typing import Optional, Dict, Any, List
from pathlib import Path

# API endpoint
VANIQUOTES_API = "https://vaniquotes.org/w/api.php"

# Headers для запитів
HEADERS = {
    "User-Agent": "vedavoice-vaniquotes-parser/1.0 (+https://vedavoice.org)",
    "Accept": "application/json",
}

# Маппінг книг на slug
BOOK_SLUG_MAP = {
    "bhagavad-gita": "bg",
    "bg": "bg",
    "srimad-bhagavatam": "sb",
    "sb": "sb",
    "caitanya-caritamrta": "scc",
    "cc": "scc",
    "nectar of devotion": "nod",
    "nod": "nod",
    "nectar of instruction": "noi",
    "noi": "noi",
    "sri isopanisad": "iso",
    "iso": "iso",
    "teachings of lord kapila": "tlk",
    "brahma-samhita": "bs",
}

# Типи джерел
SOURCE_TYPES = {
    "purport": "book",
    "lecture": "lecture",
    "conversation": "conversation",
    "morning walk": "conversation",
    "room conversation": "conversation",
    "letter": "letter",
    "introduction": "book",
}


class VaniquotesParser:
    """Парсер цитат з Vaniquotes.org"""

    def __init__(self, delay_seconds: float = 1.0, max_retries: int = 4):
        self.delay = delay_seconds
        self.max_retries = max_retries
        self.session = requests.Session()
        self.session.headers.update(HEADERS)

    def _request(self, params: Dict[str, Any]) -> Optional[Dict]:
        """Виконати API запит з rate limiting та retry логікою"""
        params["format"] = "json"

        for attempt in range(self.max_retries):
            try:
                time.sleep(self.delay)
                r = self.session.get(VANIQUOTES_API, params=params, timeout=30)
                r.raise_for_status()
                return r.json()
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 503:
                    wait_time = 2 ** (attempt + 1)
                    print(f"[WARN] Server unavailable (503), retry {attempt + 1}/{self.max_retries} in {wait_time}s...")
                    time.sleep(wait_time)
                    continue
                print(f"[ERROR] API request failed: {e}")
                return None
            except Exception as e:
                print(f"[ERROR] API request failed: {e}")
                return None

        print(f"[ERROR] Max retries ({self.max_retries}) exceeded")
        return None

    def get_category_members(
        self, category: str, limit: int = 500, include_subcats: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Отримати всі сторінки з категорії

        Args:
            category: Назва категорії (без префіксу "Category:")
            limit: Максимальна кількість сторінок
            include_subcats: Чи включати підкатегорії

        Returns: [{"pageid": int, "title": str, "type": "page|subcat"}, ...]
        """
        category_title = f"Category:{category}" if not category.startswith("Category:") else category
        members = []
        continue_token = None

        while len(members) < limit:
            params = {
                "action": "query",
                "list": "categorymembers",
                "cmtitle": category_title,
                "cmlimit": min(limit - len(members), 500),
                "cmtype": "page|subcat" if include_subcats else "page",
            }
            if continue_token:
                params["cmcontinue"] = continue_token

            data = self._request(params)
            if not data:
                break

            new_members = data.get("query", {}).get("categorymembers", [])
            for m in new_members:
                m["type"] = "subcat" if m["title"].startswith("Category:") else "page"
            members.extend(new_members)

            if "continue" in data and len(members) < limit:
                continue_token = data["continue"].get("cmcontinue")
            else:
                break

        print(f"[INFO] Знайдено {len(members)} елементів у категорії {category}")
        return members

    def get_all_categories(self) -> List[str]:
        """Отримати список всіх категорій цитат"""
        categories = []
        continue_token = None

        while True:
            params = {
                "action": "query",
                "list": "allcategories",
                "aclimit": 500,
                "acmin": 1,  # Тільки непорожні категорії
            }
            if continue_token:
                params["accontinue"] = continue_token

            data = self._request(params)
            if not data:
                break

            cats = data.get("query", {}).get("allcategories", [])
            categories.extend([c["*"] for c in cats])

            if "continue" in data:
                continue_token = data["continue"].get("accontinue")
            else:
                break

        print(f"[INFO] Знайдено {len(categories)} категорій")
        return categories

    def parse_quote_page(self, page_title: str) -> Optional[Dict[str, Any]]:
        """
        Парсити сторінку з цитатами

        Returns: {
            "quote_id": str,
            "title": str,
            "categories": [...],
            "quotes": [...]
        }
        """
        print(f"[INFO] Парсинг: {page_title}")

        # Отримати HTML сторінки
        params = {
            "action": "parse",
            "page": page_title,
            "prop": "text|categories|links",
        }
        data = self._request(params)

        if not data or "parse" not in data:
            print(f"[ERROR] Не вдалося отримати сторінку: {page_title}")
            return None

        parse_data = data["parse"]
        html = parse_data.get("text", {}).get("*", "")
        categories = [c["*"] for c in parse_data.get("categories", [])]

        if not html:
            print(f"[WARNING] Порожня сторінка: {page_title}")
            return None

        soup = BeautifulSoup(html, "lxml")

        # Витягнути цитати
        quotes = self._extract_quotes(soup)

        return {
            "quote_id": self._title_to_slug(page_title),
            "title": page_title.replace("_", " "),
            "title_original": page_title,
            "categories": categories,
            "quotes": quotes,
            "quotes_count": len(quotes),
        }

    def _extract_quotes(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        """Витягнути всі цитати зі сторінки"""
        quotes = []

        # Знайти основний контент
        content_div = soup.find("div", class_="mw-parser-output")
        if not content_div:
            content_div = soup

        # Шукаємо блоки цитат
        # Зазвичай вони в <blockquote> або <dl><dd> структурах
        for blockquote in content_div.find_all(["blockquote", "dd"]):
            quote_text = blockquote.get_text(separator=" ", strip=True)

            if not quote_text or len(quote_text) < 30:
                continue

            # Витягнути джерело
            source_info = self._extract_source_info(blockquote)

            quotes.append({
                "text": quote_text,
                "text_html": self._sanitize_html(blockquote),
                **source_info,
            })

        # Якщо не знайшли blockquotes, шукаємо в абзацах
        if not quotes:
            for p in content_div.find_all("p"):
                text = p.get_text(separator=" ", strip=True)

                # Пропустити короткі або навігаційні тексти
                if not text or len(text) < 50:
                    continue
                if any(skip in text.lower() for skip in ["category:", "retrieved from"]):
                    continue

                source_info = self._extract_source_info(p)

                quotes.append({
                    "text": text,
                    "text_html": self._sanitize_html(p),
                    **source_info,
                })

        return quotes

    def _extract_source_info(self, element: Tag) -> Dict[str, Any]:
        """Витягнути інформацію про джерело цитати"""
        info = {
            "source_type": "unknown",
            "source_reference": None,
            "book_slug": None,
            "canto_number": None,
            "chapter_number": None,
            "verse_number": None,
            "date": None,
            "location": None,
        }

        # Шукаємо посилання на джерело
        # Зазвичай це в тексті після цитати або в окремому елементі

        # Перевірити наступний елемент (часто там джерело)
        next_elem = element.find_next_sibling()
        source_text = ""

        if next_elem:
            source_text = next_elem.get_text(strip=True)

        # Шукаємо посилання всередині елемента
        for link in element.find_all("a", href=True):
            href = link["href"]
            link_text = link.get_text(strip=True)

            # Парсимо BG
            bg_match = re.search(r"BG[_\s]?(\d+)\.(\d+)", href + " " + link_text, re.IGNORECASE)
            if bg_match:
                info["book_slug"] = "bg"
                info["chapter_number"] = int(bg_match.group(1))
                info["verse_number"] = bg_match.group(2)
                info["source_reference"] = f"BG {bg_match.group(1)}.{bg_match.group(2)}"

            # Парсимо SB
            sb_match = re.search(r"SB[_\s]?(\d+)\.(\d+)\.(\d+)", href + " " + link_text, re.IGNORECASE)
            if sb_match:
                info["book_slug"] = "sb"
                info["canto_number"] = int(sb_match.group(1))
                info["chapter_number"] = int(sb_match.group(2))
                info["verse_number"] = sb_match.group(3)
                info["source_reference"] = f"SB {sb_match.group(1)}.{sb_match.group(2)}.{sb_match.group(3)}"

            # Парсимо CC
            cc_match = re.search(r"CC[_\s]?(Adi|Madhya|Antya)[_\s]?(\d+)\.(\d+)", href + " " + link_text, re.IGNORECASE)
            if cc_match:
                info["book_slug"] = "scc"
                lila = cc_match.group(1).lower()
                lila_to_num = {"adi": 1, "madhya": 2, "antya": 3}
                info["canto_number"] = lila_to_num.get(lila)
                info["chapter_number"] = int(cc_match.group(2))
                info["verse_number"] = cc_match.group(3)
                info["source_reference"] = f"CC {cc_match.group(1)} {cc_match.group(2)}.{cc_match.group(3)}"

            # Лекції/бесіди з датою
            date_match = re.search(r"(\d{6})", href)
            if date_match:
                date_str = date_match.group(1)
                yy, mm, dd = date_str[:2], date_str[2:4], date_str[4:6]
                year = f"19{yy}" if int(yy) > 50 else f"20{yy}"
                mm = mm if mm != "00" else "01"
                dd = dd if dd != "00" else "01"
                info["date"] = f"{year}-{mm}-{dd}"

        # Визначити тип джерела
        full_text = (source_text + " " + element.get_text()).lower()
        for keyword, source_type in SOURCE_TYPES.items():
            if keyword in full_text:
                info["source_type"] = source_type
                break

        return info

    def _sanitize_html(self, element: Tag) -> str:
        """Очистити HTML, залишивши тільки безпечні теги"""
        ALLOWED_TAGS = {"i", "em", "b", "strong", "br", "sup", "sub"}

        clone = BeautifulSoup(str(element), "lxml")
        root = clone.find(element.name) or clone

        for tag in root.find_all(True):
            if tag.name not in ALLOWED_TAGS:
                tag.unwrap()
            else:
                tag.attrs = {}

        inner_html = "".join(str(child) for child in root.children)
        inner_html = re.sub(r"\s+", " ", inner_html).strip()

        return inner_html

    def _title_to_slug(self, title: str) -> str:
        """Конвертувати заголовок в slug"""
        slug = title.lower()
        slug = re.sub(r"[^a-z0-9]+", "-", slug)
        slug = slug.strip("-")
        return slug

    def parse_category_recursive(
        self,
        category: str,
        limit: int = 500,
        depth: int = 2
    ) -> Dict[str, Any]:
        """
        Парсити категорію рекурсивно з підкатегоріями

        Args:
            category: Назва категорії
            limit: Максимальна кількість цитат
            depth: Глибина рекурсії для підкатегорій

        Returns: {
            "category": str,
            "subcategories": [...],
            "quotes": [...]
        }
        """
        result = {
            "category": category,
            "category_slug": self._title_to_slug(category),
            "subcategories": [],
            "quotes": [],
        }

        members = self.get_category_members(category, limit=limit)

        for member in members:
            if len(result["quotes"]) >= limit:
                break

            if member["type"] == "subcat" and depth > 0:
                # Рекурсивно парсити підкатегорію
                subcat_name = member["title"].replace("Category:", "")
                subcat_result = self.parse_category_recursive(
                    subcat_name,
                    limit=limit - len(result["quotes"]),
                    depth=depth - 1
                )
                result["subcategories"].append(subcat_result)
                result["quotes"].extend(subcat_result["quotes"])
            else:
                # Парсити сторінку з цитатами
                quote_data = self.parse_quote_page(member["title"])
                if quote_data and quote_data["quotes"]:
                    result["quotes"].append(quote_data)

        result["total_quotes"] = len(result["quotes"])
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
        description="Парсер цитат з Vaniquotes.org"
    )
    parser.add_argument(
        "--category",
        type=str,
        help="Назва категорії для парсингу (наприклад, 'Spiritual_Master')",
    )
    parser.add_argument(
        "--page",
        type=str,
        help="Назва сторінки з цитатою",
    )
    parser.add_argument(
        "--topic",
        type=str,
        help="Парсити тему з підкатегоріями рекурсивно",
    )
    parser.add_argument(
        "--list-categories",
        action="store_true",
        help="Вивести список всіх категорій",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=100,
        help="Максимальна кількість цитат (за замовчуванням: 100)",
    )
    parser.add_argument(
        "--depth",
        type=int,
        default=2,
        help="Глибина рекурсії для підкатегорій (за замовчуванням: 2)",
    )
    parser.add_argument(
        "--output",
        type=str,
        help="Шлях до output файлу",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=1.0,
        help="Затримка між запитами в секундах (за замовчуванням: 1.0)",
    )

    args = parser.parse_args()

    if not any([args.category, args.page, args.topic, args.list_categories]):
        parser.error("Потрібно вказати --category, --page, --topic або --list-categories")

    vq_parser = VaniquotesParser(delay_seconds=args.delay)

    if args.list_categories:
        categories = vq_parser.get_all_categories()
        output_data = {
            "count": len(categories),
            "categories": categories,
        }
        output_file = args.output or "tools/outputs/vaniquotes/categories.json"
        vq_parser.save_to_json(output_data, output_file)

    elif args.page:
        quote_data = vq_parser.parse_quote_page(args.page)
        if quote_data:
            output_file = args.output or f"tools/outputs/vaniquotes/quotes/{quote_data['quote_id']}.json"
            vq_parser.save_to_json(quote_data, output_file)

    elif args.category:
        members = vq_parser.get_category_members(args.category, limit=args.limit)
        output_data = {
            "category": args.category,
            "count": len(members),
            "members": members,
        }
        output_file = args.output or f"tools/outputs/vaniquotes/{vq_parser._title_to_slug(args.category)}_members.json"
        vq_parser.save_to_json(output_data, output_file)

    elif args.topic:
        result = vq_parser.parse_category_recursive(
            args.topic,
            limit=args.limit,
            depth=args.depth
        )
        output_file = args.output or f"tools/outputs/vaniquotes/{result['category_slug']}.json"
        vq_parser.save_to_json(result, output_file)

    print("[DONE] Парсинг завершено!")


if __name__ == "__main__":
    main()
