#!/usr/bin/env python3
"""
supabase_uploader.py

Завантаження імпортованих лекцій та листів в Supabase

Usage:
    # Завантажити лекції
    python tools/supabase_uploader.py --type lectures --batch-size 50

    # Завантажити листи
    python tools/supabase_uploader.py --type letters

    # Завантажити конкретний файл
    python tools/supabase_uploader.py --type lectures --file tools/outputs/lectures/660307bg-new-york.json

Requirements:
    pip install supabase python-dotenv
"""

import os
import sys
import json
import argparse
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime

from dotenv import load_dotenv

# Завантажити .env
load_dotenv()

# Supabase credentials
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("[ERROR] Missing Supabase credentials in .env")
    print("  Required: SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_KEY")
    sys.exit(1)

from supabase import create_client, Client

# Ініціалізація Supabase клієнта
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


class SupabaseUploader:
    """Завантажувач даних в Supabase"""

    def __init__(self, content_type: str = "lectures"):
        self.content_type = content_type
        self.table_name = content_type  # "lectures" або "letters"

        if content_type == "lectures":
            self.output_dir = Path("tools/outputs/lectures")
            self.paragraphs_table = "lecture_paragraphs"
        else:
            self.output_dir = Path("tools/outputs/letters")
            self.paragraphs_table = None  # Листи не мають окремої таблиці параграфів

    def load_json_file(self, file_path: Path) -> Optional[Dict[str, Any]]:
        """Завантажити JSON файл"""
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[ERROR] Failed to load {file_path}: {e}")
            return None

    def prepare_lecture_record(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Підготувати запис лекції для Supabase"""
        metadata = data.get("metadata", {})

        return {
            "slug": metadata.get("slug"),
            "title_en": metadata.get("title_en"),
            "title_ua": metadata.get("title_ua"),
            "lecture_date": metadata.get("lecture_date"),
            "location_en": metadata.get("location_en"),
            "location_ua": metadata.get("location_ua"),
            "lecture_type": metadata.get("lecture_type"),
            "audio_url": metadata.get("audio_url"),
            "book_slug": metadata.get("book_slug"),
            "chapter_number": metadata.get("chapter_number"),
            "verse_number": metadata.get("verse_number"),
            "is_published": True,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
        }

    def prepare_lecture_paragraphs(
        self, lecture_id: str, data: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Підготувати параграфи лекції для Supabase"""
        paragraphs = data.get("paragraphs", [])
        records = []

        for p in paragraphs:
            records.append({
                "lecture_id": lecture_id,
                "paragraph_number": p.get("paragraph_number"),
                "content_en": p.get("content_en"),
                "content_ua": p.get("content_ua"),  # Буде None якщо не перекладено
                "audio_timecode": p.get("audio_timecode"),
            })

        return records

    def prepare_letter_record(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Підготувати запис листа для Supabase"""
        metadata = data.get("metadata", {})

        return {
            "slug": metadata.get("slug"),
            "recipient_en": metadata.get("recipient_en"),
            "recipient_ua": metadata.get("recipient_ua"),
            "letter_date": metadata.get("letter_date"),
            "location_en": metadata.get("location_en"),
            "location_ua": metadata.get("location_ua"),
            "reference": metadata.get("reference"),
            "content_en": data.get("content_en"),
            "content_ua": data.get("content_ua"),  # Буде None якщо не перекладено
            "is_published": True,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
        }

    def upsert_lecture(self, data: Dict[str, Any]) -> Optional[str]:
        """Вставити або оновити лекцію"""
        record = self.prepare_lecture_record(data)
        slug = record.get("slug")

        if not slug:
            print("[ERROR] Missing slug in lecture data")
            return None

        try:
            # Спочатку перевірити чи існує запис
            existing = supabase.table(self.table_name).select("id").eq("slug", slug).execute()

            if existing.data:
                # Оновити існуючий
                lecture_id = existing.data[0]["id"]
                record["updated_at"] = datetime.now().isoformat()
                del record["created_at"]

                supabase.table(self.table_name).update(record).eq("id", lecture_id).execute()
                print(f"[UPDATE] Lecture {slug} updated")
            else:
                # Вставити новий
                result = supabase.table(self.table_name).insert(record).execute()
                lecture_id = result.data[0]["id"]
                print(f"[INSERT] Lecture {slug} inserted with id={lecture_id}")

            # Завантажити параграфи
            paragraphs = self.prepare_lecture_paragraphs(lecture_id, data)
            if paragraphs:
                # Видалити старі параграфи
                supabase.table(self.paragraphs_table).delete().eq("lecture_id", lecture_id).execute()

                # Вставити нові
                supabase.table(self.paragraphs_table).insert(paragraphs).execute()
                print(f"[INSERT] {len(paragraphs)} paragraphs for lecture {slug}")

            return lecture_id

        except Exception as e:
            print(f"[ERROR] Failed to upsert lecture {slug}: {e}")
            return None

    def upsert_letter(self, data: Dict[str, Any]) -> Optional[str]:
        """Вставити або оновити лист"""
        record = self.prepare_letter_record(data)
        slug = record.get("slug")

        if not slug:
            print("[ERROR] Missing slug in letter data")
            return None

        try:
            # Перевірити чи існує
            existing = supabase.table(self.table_name).select("id").eq("slug", slug).execute()

            if existing.data:
                # Оновити
                letter_id = existing.data[0]["id"]
                record["updated_at"] = datetime.now().isoformat()
                del record["created_at"]

                supabase.table(self.table_name).update(record).eq("id", letter_id).execute()
                print(f"[UPDATE] Letter {slug} updated")
            else:
                # Вставити
                result = supabase.table(self.table_name).insert(record).execute()
                letter_id = result.data[0]["id"]
                print(f"[INSERT] Letter {slug} inserted with id={letter_id}")

            return letter_id

        except Exception as e:
            print(f"[ERROR] Failed to upsert letter {slug}: {e}")
            return None

    def upload_single_file(self, file_path: Path) -> bool:
        """Завантажити один файл"""
        data = self.load_json_file(file_path)
        if not data:
            return False

        if self.content_type == "lectures":
            return self.upsert_lecture(data) is not None
        else:
            return self.upsert_letter(data) is not None

    def upload_all(self, batch_size: int = 50, limit: Optional[int] = None):
        """Завантажити всі файли з директорії"""
        json_files = list(self.output_dir.glob("*.json"))

        # Виключити службові файли
        json_files = [f for f in json_files if f.stem not in ["all_slugs", "all_sanskrit_terms"]]

        if limit:
            json_files = json_files[:limit]

        total = len(json_files)
        success_count = 0
        fail_count = 0

        print(f"\n{'='*60}")
        print(f"  Supabase Uploader - {self.content_type.upper()}")
        print(f"{'='*60}")
        print(f"  Files to upload: {total}")
        print(f"  Batch size: {batch_size}")
        print(f"{'='*60}\n")

        for i, file_path in enumerate(json_files, 1):
            print(f"\n[{i}/{total}] Processing: {file_path.name}")

            if self.upload_single_file(file_path):
                success_count += 1
            else:
                fail_count += 1

            # Пауза кожні batch_size записів
            if i % batch_size == 0:
                print(f"\n[BATCH] Completed {i}/{total}. Success: {success_count}, Failed: {fail_count}")

        print(f"\n{'='*60}")
        print(f"  UPLOAD COMPLETE")
        print(f"{'='*60}")
        print(f"  Total: {total}")
        print(f"  Success: {success_count}")
        print(f"  Failed: {fail_count}")
        print(f"{'='*60}\n")


def main():
    parser = argparse.ArgumentParser(
        description="Завантаження лекцій та листів в Supabase"
    )
    parser.add_argument(
        "--type",
        type=str,
        choices=["lectures", "letters"],
        default="lectures",
        help="Тип контенту для завантаження",
    )
    parser.add_argument(
        "--file",
        type=str,
        default=None,
        help="Шлях до конкретного JSON файлу",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=50,
        help="Розмір батчу",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Максимальна кількість файлів",
    )

    args = parser.parse_args()

    uploader = SupabaseUploader(content_type=args.type)

    if args.file:
        # Завантажити один файл
        file_path = Path(args.file)
        if not file_path.exists():
            print(f"[ERROR] File not found: {file_path}")
            sys.exit(1)

        success = uploader.upload_single_file(file_path)
        sys.exit(0 if success else 1)
    else:
        # Завантажити всі файли
        uploader.upload_all(batch_size=args.batch_size, limit=args.limit)


if __name__ == "__main__":
    main()
