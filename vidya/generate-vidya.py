"""
Vidya Library Generator

This script parses a library.txt file and creates a hierarchical SQLite database
(.vidya file) with parent-child relationships for books, chapters, verses, and records.

Usage:
    python generate-vidya.py [options]

Options:
    -c, --config PATH    Path to config file (default: generate-vidya.conf)
    -l, --library PATH   Path to library.txt file (overrides config file setting)

Configuration:
    The script reads settings from a config file (default: generate-vidya.conf).
    The config file uses INI format with a [DEFAULT] section containing:
    - output_filename: Output database filename (e.g., library.vidya)
    - package_name: Name of the library
    - package_version: Version number
    - language_code: Language code (e.g., en, hi)
    - language_name: Language name (e.g., English, Hindi)
    - enable_fts: Enable Full-Text Search (True/False)
    - library_file: Path to input library.txt file

Hierarchy Levels (0 = top level):
- book (level 0)
- canto (level 1)
- chapter (level 2)
- verse (level 3)

Attribute Types (add properties to parent, don't create new records):
- code: adds 'code' property to parent
- code-full: adds 'code' property (extracts last part after '/')
- cover: adds 'cover' property to parent
- chapter-title: adds 'chapter_title' property to parent
- move-up: decreases current level to parent level (no record created)

All other types create content records as children of the current parent.
"""

import argparse
import base64
import configparser
import json
import os
import re
import sqlite3

# Define hierarchy levels
HIERARCHY_LEVELS = {"book": 0, "canto": 1, "chapter": 2, "verse": 3}

# Types that add attributes instead of creating records
ATTRIBUTE_TYPES = {"code", "code-full", "cover", "chapter-title", "move-up"}


def remove_html_tags(text):
    # Replace block-level and spacing tags with space
    spacing_tags = r"<(?:br|p|div|tr|td|th|li|h[1-6]|section|article|header|footer|nav|aside|main)[^>]*>"
    text = re.sub(spacing_tags, " ", text, flags=re.IGNORECASE)

    # Replace closing tags that should create spacing
    text = re.sub(
        r"</(?:p|div|tr|td|th|li|h[1-6]|section|article|header|footer|nav|aside|main)>",
        " ",
        text,
        flags=re.IGNORECASE,
    )

    # Remove all remaining HTML tags
    text = re.sub(r"<[^>]+>", "", text)

    # Collapse multiple spaces into one
    text = re.sub(r"\s+", " ", text)

    return text.strip()


class VidyaDatabase:
    def __init__(
        self,
        db_filename,
        package_name,
        package_version,
        language_code,
        language_name,
        enable_fts=False,
        library_file_dir=None,
    ):
        self.records = []
        self.url_paths_cache = set()  # Cache of URL paths added (including uncommitted)
        self.records_by_id = {}  # Store records by ID for quick lookup
        self.c = None
        self.conn = sqlite3.connect(db_filename)
        self.c = self.conn.cursor()
        self.package_name = package_name
        self.package_version = package_version
        self.language_code = language_code
        self.language_name = language_name
        self.enable_fts = enable_fts
        self.library_file_dir = library_file_dir

        if enable_fts:
            self.enable_fts = True
            self.create_fts_table()
        else:
            self.enable_fts = False

        # self.stdout.write(
        #     f"Going to export: {options["language"]}, FTS5: {self.enable_fts}"
        # )

        self.generate_db_meta()
        self.create_table_url_paths()
        self.create_table_content_tree()
        self.create_table_books()
        self.create_table_chapters()
        self.create_table_verses()
        self.create_table_quick_nav()
        # self.create_table_transcripts()
        # self.create_table_letters()
        self.create_table_records()
        self.conn.commit()

    def generate_db_meta(self):
        enabled_features = ["books"]

        self.c.execute('''DROP TABLE IF EXISTS "main"."db_meta"''')
        self.c.execute(
            """CREATE TABLE "main"."db_meta"
                         ("id" INTEGER PRIMARY KEY  NOT NULL ,
                          "key" CHAR(100),
                          "value" TEXT)
            """
        )
        self.c.execute(
            """INSERT INTO "main"."db_meta" ("key","value") VALUES (?,?)""",
            ("enabled_features", json.dumps(enabled_features)),
        )
        self.c.execute(
            """INSERT INTO "main"."db_meta" ("key","value") VALUES (?,?)""",
            ("db_name", json.dumps(self.package_name)),
        )
        self.c.execute(
            """INSERT INTO "main"."db_meta" ("key","value") VALUES (?,?)""",
            ("fts", json.dumps(self.enable_fts)),
        )
        self.c.execute(
            """INSERT INTO "main"."db_meta" ("key","value") VALUES (?,?)""",
            (
                "language",
                json.dumps(
                    {
                        "code": self.language_code,
                        "name": self.language_name,
                    }
                ),
            ),
        )
        self.c.execute(
            """INSERT INTO "main"."db_meta" ("key","value") VALUES (?,?)""",
            ("db_version", json.dumps(self.package_version)),
        )
        self.c.execute(
            """INSERT INTO "main"."db_meta" ("key","value") VALUES (?,?)""",
            ("quick_nav", json.dumps(True)),
        )

    def create_fts_table(self):
        self.c.execute("""DROP TABLE IF EXISTS content_fts""")
        self.c.execute(
            """CREATE VIRTUAL TABLE content_fts USING FTS5(
                item_type UNINDEXED,  -- e.g., 'verse', 'transcript', 'letter'
                item_id UNINDEXED,    -- ID from the original table
                plain_text            -- Stripped text for indexing
            ); """
        )

    def insert_into_fts(self, item):
        if not self.enable_fts:
            return
        self.c.execute(
            """INSERT INTO content_fts
                          ("item_type","item_id","plain_text")
                          VALUES (?,?,?)""",
            (item["record_type"], item["id"], remove_html_tags(item["content"])),
        )

    def get_parent(self, record):
        """Get the parent record for a given record."""
        parent_id = record.get("parent")
        if parent_id is None:
            return None
        return self.records_by_id.get(parent_id)

    def get_url_path(self, item):
        """Build URL path from parent codes and item code, separated by '/'."""
        codes = []
        current = item

        # Collect codes from current item up to root
        while current is not None:
            code = current.get("code")
            if code:
                codes.append(code)
            current = self.get_parent(current)

        # Reverse to get path from root to current item
        codes.reverse()

        # Join with '/' to create URL path
        url_path = "/" + "/".join(codes) if codes else ""
        return url_path

    def create_table_url_paths(self):
        self.c.execute("DROP TABLE IF EXISTS url_paths")
        self.c.execute(
            """
            CREATE TABLE url_paths (
                url_path TEXT PRIMARY KEY,
                type TEXT NOT NULL, -- type like book, chapter, verse, transcript, letter
                item_id INTEGER NOT NULL
            );
            """
        )
        self.c.execute("CREATE INDEX idx_url_paths_url_path ON url_paths (url_path);")

    def add_url(self, item):
        url_path = self.get_url_path(item)
        if not url_path:  # Only insert if there's a valid URL path
            return

        # Check if url_path already exists (in cache or database)
        existing = url_path in self.url_paths_cache
        if not existing:
            self.c.execute(
                "SELECT url_path FROM url_paths WHERE url_path = ?",
                (url_path,),
            )
            existing = self.c.fetchone() is not None

        if existing:
            # Find all existing paths with suffixes (--1, --2, etc.)
            # Pattern: base_path--N where N is a number
            # Start with paths from cache
            all_paths = [
                path
                for path in self.url_paths_cache
                if path == url_path or path.startswith(url_path + "--")
            ]
            # Also check database for paths with suffixes
            self.c.execute(
                """
                SELECT url_path FROM url_paths
                WHERE url_path = ? OR url_path LIKE ? || '--%'
                ORDER BY url_path
                """,
                (url_path, url_path),
            )
            db_paths = [row[0] for row in self.c.fetchall()]
            # Combine and deduplicate
            all_paths = list(set(all_paths + db_paths))

            # Collect all existing suffix numbers
            used_suffixes = set()
            suffix_pattern = re.compile(
                r"^" + re.escape(url_path) + r"--(\d+)$"
            )
            for path in all_paths:
                if path == url_path:
                    # The base path exists, mark suffix 0 as used (base path)
                    used_suffixes.add(0)
                else:
                    match = suffix_pattern.match(path)
                    if match:
                        suffix_num = int(match.group(1))
                        used_suffixes.add(suffix_num)

            # Find the first available suffix number starting from 1
            new_suffix = 1
            while new_suffix in used_suffixes:
                new_suffix += 1

            url_path = f"{url_path}--{new_suffix}"
            print(f"Duplicate url_path replaced with {url_path}")

        # Insert the (possibly modified) url_path
        self.c.execute(
            """
            INSERT INTO url_paths
                ("url_path","type","item_id")
                VALUES (?,?,?)
            """,
            (
                url_path,
                item["record_type"],
                item["id"],
            ),
        )
        # Add to cache for quick lookup (including uncommitted URLs)
        self.url_paths_cache.add(url_path)

    def create_table_content_tree(self):
        self.c.execute("DROP TABLE IF EXISTS content_tree")
        self.c.execute(
            """
            CREATE TABLE content_tree (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                parent_id INTEGER, -- NULL for root
                type TEXT NOT NULL, -- e.g., 'book', 'chapter', 'verse', 'record'
                item_id INTEGER NOT NULL, -- references the specific content table
                is_page INTEGER DEFAULT 0, -- if true, participates in pager
                sort_order INTEGER DEFAULT 0
            );
            """
        )
        self.c.execute(
            "CREATE INDEX idx_content_tree_parent_sort ON content_tree (parent_id, sort_order);"
        )
        self.c.execute(
            "CREATE INDEX idx_content_tree_item_id ON content_tree (item_id);"
        )

    def add_into_content_tree(self, item):
        is_page = (
            1 if item["record_type"] in ["book", "canto", "chapter", "verse"] else 0
        )
        self.c.execute(
            """
            INSERT INTO content_tree
                (parent_id, type, item_id, is_page, sort_order)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                item["parent"],
                item["record_type"],
                item["id"],
                is_page,
                item["sort_order"],
            ),
        )

    def create_table_books(self):
        self.c.execute("DROP TABLE IF EXISTS books")
        self.c.execute(
            """
            CREATE TABLE books (
                id INTEGER PRIMARY KEY,
                parent_id INTEGER,
                backbone_id INTEGER,
                title TEXT,
                short_title TEXT,
                medium_title TEXT,
                type TEXT, -- e.g., 'book', 'canto'
                has_advanced_view INTEGER DEFAULT 0,
                cover BLOB
            );
            """
        )
        self.c.execute("CREATE INDEX idx_books_id ON books (id);")

    def add_book(self, item):
        cover_base64 = ""
        if item.get("cover"):
            # Get image file and convert to base64
            cover_filename = item["cover"]
            # Try different possible paths for the cover image
            possible_paths = []

            # First, try the library file directory (where library.txt is located)
            if self.library_file_dir:
                possible_paths.append(
                    os.path.join(self.library_file_dir, cover_filename)
                )

            # Then try other common locations
            possible_paths.extend(
                [
                    cover_filename,  # Current directory
                    os.path.join("output", cover_filename),  # output directory
                    os.path.join("images", cover_filename),  # images directory
                    os.path.join("covers", cover_filename),  # covers directory
                ]
            )

            for cover_filepath in possible_paths:
                if os.path.exists(cover_filepath):
                    try:
                        with open(cover_filepath, "rb") as f:
                            cover_base64 = base64.b64encode(f.read()).decode("utf-8")
                        break
                    except Exception as e:
                        print(
                            f"Warning: Could not read cover file {cover_filepath}: {e}"
                        )
            else:
                print(f"Warning: Cover image not found: {cover_filename}")
                exit(1)

        self.c.execute(
            """INSERT INTO books
                  (id, parent_id, backbone_id, title, short_title, medium_title, type, has_advanced_view, cover)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                item["id"],
                item["parent"],
                item["id"],
                item["content"],
                item.get("short_title", ""),
                item.get("medium_title", ""),
                item["record_type"],
                int(
                    item.get("has_advanced_view", 0)
                ),  # store as integer (0/1) since schema defines INTEGER
                cover_base64,
            ),
        )

        self.add_into_content_tree(item)
        self.add_url(item)
        self.insert_into_fts(item)

    def create_table_chapters(self):
        self.c.execute("""DROP TABLE IF EXISTS chapters""")
        self.c.execute(
            """
            CREATE TABLE chapters (
                id INTEGER PRIMARY KEY,
                parent_id INTEGER,
                backbone_id INTEGER,
                title TEXT,
                chapter_title TEXT,
                short_title TEXT,
                medium_title TEXT,
                has_advanced_view INTEGER DEFAULT 0
            );
            """
        )
        self.c.execute("CREATE INDEX idx_chapters_id ON chapters (id);")

    def add_chapter(self, item):
        self.c.execute(
            """
            INSERT INTO chapters
                (id, parent_id, backbone_id, title, chapter_title, short_title, medium_title, has_advanced_view)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                item["id"],
                item["parent"],
                item["id"],
                item["content"],
                item.get("chapter_title", ""),
                item.get("short_title", ""),
                item.get("medium_title", ""),
                int(
                    item.get("has_advanced_view", 0)
                ),  # store as integer (0/1) since schema defines INTEGER
            ),
        )

        self.add_into_content_tree(item)
        self.add_url(item)
        self.insert_into_fts(item)

    def create_table_verses(self):
        self.c.execute("DROP TABLE IF EXISTS verses")
        self.c.execute(
            """
            CREATE TABLE verses (
                id INTEGER PRIMARY KEY,
                parent_id INTEGER,
                backbone_id INTEGER,
                title TEXT,
                short_title TEXT,
                medium_title TEXT,
                excerpt TEXT
            );
            """
        )
        self.c.execute("CREATE INDEX idx_verses_id ON verses (id);")

    def add_verse(self, item):
        self.c.execute(
            """
            INSERT INTO verses
                (id, parent_id, backbone_id, title, short_title, medium_title)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                item["id"],
                item["parent"],
                item["id"],
                item["content"],
                item.get("short_title", ""),
                item.get("medium_title", ""),
            ),
        )

        self.add_into_content_tree(item)
        self.add_url(item)
        self.insert_into_fts(item)

    def create_table_quick_nav(self):
        self.c.execute("DROP TABLE IF EXISTS quick_nav")
        self.c.execute(
            """
            CREATE TABLE quick_nav (
                id INTEGER PRIMARY KEY,
                parent_id INTEGER,  -- NULL for root
                sort_order INTEGER DEFAULT 0,
                code TEXT NOT NULL,
                url_path TEXT NOT NULL
            );
            """
        )

    def populate_quick_nav(self):
        """Populate the quick_nav table with navigation hierarchy.
        Maintains source file order using sort_order from content_tree.
        """
        print("Populating quick_nav...")
        hierarchy_types = list(HIERARCHY_LEVELS.keys())
        placeholders = ",".join(["?"] * len(hierarchy_types))

        # Build map of path -> id for parent lookups
        path_to_id = {}

        # Fetch all hierarchy items, ordered by sort_order to maintain source file order
        query = f"""
            SELECT u.item_id, c.parent_id, c.sort_order, u.url_path 
            FROM url_paths u
            JOIN content_tree c ON u.item_id = c.item_id AND u.type = c.type
            WHERE u.type IN ({placeholders})
            ORDER BY c.sort_order
        """
        self.c.execute(query, hierarchy_types)
        rows = self.c.fetchall()
        
        # First pass: Build path_to_id map for all items
        # We prioritize "clean" paths (no --suffix) for the map
        items_to_process = []
        for row in rows:
            item_id, parent_id, sort_order, url_path = row
            items_to_process.append(row)
            
            # If path is clean (no suffix), map it
            if "--" not in url_path:
                path_to_id[url_path] = item_id

        # Process items and insert into quick_nav
        to_insert = []
        for row in items_to_process:
            item_id, parent_id, sort_order, url_path = row
            
            # Skip if it's a suffixed duplicate (e.g. /a/b--1)
            # We only want the primary node in nav to avoid duplicates
            if "--" in url_path:
                continue

            # Extract code from url_path
            code = url_path.strip("/").split("/")[-1] if url_path else ""

            to_insert.append((item_id, parent_id, sort_order, code, url_path))

        self.c.executemany(
            "INSERT INTO quick_nav (id, parent_id, sort_order, code, url_path) VALUES (?, ?, ?, ?, ?)",
            to_insert,
        )

    def create_table_records(self):
        self.c.execute("DROP TABLE IF EXISTS records")
        self.c.execute(
            """
            CREATE TABLE records (
                id INTEGER PRIMARY KEY,
                backbone_id INTEGER,
                content_type TEXT NOT NULL, -- e.g., 'text', 'image', 'note', 'markup'
                content TEXT NOT NULL,
                data BLOB
            );
            """
        )
        self.c.execute("CREATE INDEX idx_redords_id ON records (id);")

    def add_record(self, item):
        self.c.execute(
            """
            INSERT INTO records
                (id, backbone_id, content_type, content)
            VALUES (?, ?, ?, ?)
            """,
            (
                item["id"],
                item["id"],
                item["content_type"],
                item["content"],
                # data -- will be used for exemple for images
            ),
        )

        # If this is a translation, set it as the excerpt for the parent verse
        content_type = item.get("content_type", "")
        if content_type == "translation":
            parent_record = self.get_parent(item)
            if parent_record and parent_record.get("record_type") == "verse":
                self.c.execute(
                    "UPDATE verses SET excerpt = ? WHERE id = ?",
                    (item["content"], parent_record["id"]),
                )

        self.add_into_content_tree(item)
        self.insert_into_fts(item)

    def process_item(self, item):
        """Process an item and store it for parent lookups."""
        # Store the record by ID for parent lookups
        self.records_by_id[item["id"]] = item

        match item["record_type"]:
            case "book":
                self.add_book(item)
            case "canto":
                self.add_book(item)
            case "chapter":
                self.add_chapter(item)
            case "verse":
                self.add_verse(item)
            case "record":
                self.add_record(item)
            case _:
                print(f"Unknown type: {item['record_type']}")
                exit()


class LibraryParser:
    def __init__(self):
        self.records = []
        self.current_id = 0
        # Track current parent at each hierarchy level
        self.current_parents = {}  # level -> record_id
        self.current_level = -1
        # Track sort order for each parent (parent_id -> next_sort_order)
        self.parent_sort_order = {}

    def parse_line(self, line):
        line = line.strip()
        if not line:
            return

        # Extract class and content from div
        match = re.match(r'<div class="([^"]+)">(.*?)</div>', line)
        if not match:
            return

        class_name = match.group(1)
        content = match.group(2)

        if class_name == "move-up":
            print(f"Moving up from level {self.current_level}")
            # Decrease current level to parent level
            if self.current_level >= 0:
                # Clear the current level from current_parents before moving up
                if self.current_level in self.current_parents:
                    del self.current_parents[self.current_level]
                # Move up one level
                self.current_level -= 1
            return

        if class_name in ATTRIBUTE_TYPES:
            # Add attribute to current parent
            self.add_attribute(class_name, content)
        else:
            # Create new record
            self.create_record(class_name, content)

    def add_attribute(self, attr_type, content):
        if not self.records:
            return

        # Find the current parent record (the most recent record at current level)
        parent_id = self.get_current_parent()
        if parent_id is None:
            return

        # Find and update the record
        for record in self.records:
            if record["id"] == parent_id:
                if attr_type == "code":
                    record["code"] = content
                elif attr_type == "code-full":
                    # Extract last part after /
                    parts = content.split("/")
                    record["code"] = parts[-1] if parts else content
                elif attr_type == "cover":
                    record["cover"] = content
                elif attr_type == "chapter-title":
                    record["chapter_title"] = content
                break

    def replace_type(self, record_type):
        return record_type

    def create_record(self, record_type, content):
        self.current_id += 1

        content = content.replace("<br/>", "<br />")

        # Determine parent based on record type
        parent_id = None

        if record_type in HIERARCHY_LEVELS:
            # This is a hierarchy-changing type
            new_level = HIERARCHY_LEVELS[record_type]

            # Find parent at the nearest lower level
            if new_level > 0:
                # Look for parent at level new_level - 1, new_level - 2, etc.
                for parent_level in range(new_level - 1, -1, -1):
                    if parent_level in self.current_parents:
                        parent_id = self.current_parents[parent_level]
                        break

            # Get sort order for this parent
            sort_order = self.parent_sort_order.get(parent_id, 0)
            self.parent_sort_order[parent_id] = sort_order + 1

            # Create record
            record = {
                "id": self.current_id,
                "record_type": record_type,
                "content_type": record_type,
                "parent": parent_id,
                "sort_order": sort_order,
                "content": content,
            }

            self.records.append(record)

            # Update tracking
            self.current_level = new_level
            self.current_parents[new_level] = self.current_id
            # Clear deeper levels
            levels_to_remove = [
                level_key for level_key in self.current_parents if level_key > new_level
            ]
            for level_key in levels_to_remove:
                del self.current_parents[level_key]
        else:
            # Non-hierarchy type - child of current parent at current level
            parent_id = (
                self.current_parents.get(self.current_level)
                if self.current_level >= 0
                else None
            )

            # Get sort order for this parent
            sort_order = self.parent_sort_order.get(parent_id, 0)
            self.parent_sort_order[parent_id] = sort_order + 1

            record = {
                "id": self.current_id,
                "parent": parent_id,
                "record_type": "record",
                "content_type": record_type,
                "sort_order": sort_order,
                "content": content,
            }

            self.records.append(record)

    def get_current_parent(self):
        """Get the ID of the record at the current level"""
        if self.current_level in self.current_parents:
            return self.current_parents[self.current_level]
        return None

    def parse_file(self, filepath):
        """Parse the entire library file"""
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                self.parse_line(line)
        return self.records


def load_config(config_file="generate-vidya.conf"):
    """Load configuration from config file."""
    config = configparser.ConfigParser()

    # Set defaults
    defaults = {
        "output_filename": "library.vidya",
        "package_name": "Name of the library",
        "package_version": "1.0",
        "language_code": "en",
        "language_name": "English",
        "enable_fts": "True",
        "library_file": "./input/library.txt",
    }

    # Read config file if it exists
    if os.path.exists(config_file):
        try:
            config.read(config_file)
            # Use DEFAULT section
            settings = {}
            for key, default_value in defaults.items():
                settings[key] = config.get("DEFAULT", key, fallback=default_value)
        except configparser.MissingSectionHeaderError:
            # File has no section header, parse as simple key=value pairs
            settings = defaults.copy()
            with open(config_file, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    # Skip comments and empty lines
                    if not line or line.startswith("#"):
                        continue
                    # Parse key=value
                    if "=" in line:
                        key, value = line.split("=", 1)
                        key = key.strip()
                        value = value.strip()
                        # Remove quotes if present
                        if value.startswith('"') and value.endswith('"'):
                            value = value[1:-1]
                        elif value.startswith("'") and value.endswith("'"):
                            value = value[1:-1]
                        if key in defaults:
                            settings[key] = value
    else:
        settings = defaults

    # Convert enable_fts to boolean
    settings["enable_fts"] = settings["enable_fts"].lower() in (
        "true",
        "1",
        "yes",
        "on",
    )

    return settings


def main():
    # Parse command line arguments
    arg_parser = argparse.ArgumentParser(
        description="Generate Vidya database from library.txt file"
    )
    arg_parser.add_argument(
        "-c",
        "--config",
        default="generate-vidya.conf",
        help="Path to config file (default: generate-vidya.conf)",
    )
    arg_parser.add_argument(
        "-l",
        "--library",
        help="Path to library.txt file (overrides config file setting)",
    )

    args = arg_parser.parse_args()

    # Load configuration from file
    config = load_config(args.config)

    # Override library file if provided via command line
    library_file = args.library if args.library else config["library_file"]

    # Get the directory where library_file is located
    # If library_file has no directory component, use current directory
    if library_file:
        abs_library_file = os.path.abspath(library_file)
        library_file_dir = os.path.dirname(abs_library_file) or os.getcwd()
    else:
        library_file_dir = None

    # Create database with settings from config
    vidyaDatabase = VidyaDatabase(
        config["output_filename"],
        config["package_name"],
        config["package_version"],
        config["language_code"],
        config["language_name"],
        config["enable_fts"],
        library_file_dir=library_file_dir,
    )

    library_parser = LibraryParser()
    records = library_parser.parse_file(library_file)
    for record in records:
        print("Processing record: ", record["id"])
        vidyaDatabase.process_item(record)

    vidyaDatabase.conn.commit()
    
    # Populate quick_nav after all items are processed
    vidyaDatabase.populate_quick_nav()
    
    vidyaDatabase.conn.commit()
    vidyaDatabase.conn.close()

    # Print records
    print(f"Total records: {len(records)}\n")


if __name__ == "__main__":
    main()
