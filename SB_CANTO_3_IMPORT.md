# Імпорт Шрімад-Бхаґаватам Пісня 3

## Швидкий імпорт через Python скрипт (РЕКОМЕНДОВАНО)

### 1. Встановити залежності

```bash
pip3 install ebooklib beautifulsoup4 requests supabase
```

### 2. Експортувати змінні середовища

```bash
export SUPABASE_URL="https://qeplxgqadcbwlrbgydlb.supabase.co"
export SUPABASE_SERVICE_KEY="<ваш service_role_key>"
```

### 3. Тестовий прогін (глава 1)

```bash
python3 import_sb_epub.py \
  --epub public/epub/UK_SB_3_epub_r1.epub \
  --canto 3 \
  --chapters 1 \
  --dry-run
```

**Очікуваний результат:**
```
📖 Reading EPUB: public/epub/UK_SB_3_epub_r1.epub
✅ Parsed Chapter 1: "Запитання Відури" (48 verses)
   - Sanskrit: ✓
   - Transliteration UA: ✓
   - Synonyms UA: ✓
   - Translation UA: ✓
   - Commentary UA: ✓

🌐 Enriching with Vedabase English data...
✅ Fetched verse 3.1.1 from Vedabase
...
✅ Fetched verse 3.1.48 from Vedabase

📊 Summary:
   - Chapters: 1
   - Verses: 48
   - Fields filled: sanskrit, transliteration_ua/en, synonyms_ua/en, translation_ua/en, commentary_ua/en

🚫 DRY RUN - Nothing saved to database
```

### 4. Імпорт глави 1 (реальний)

```bash
python3 import_sb_epub.py \
  --epub public/epub/UK_SB_3_epub_r1.epub \
  --canto 3 \
  --chapters 1
```

### 5. Перевірити в БД

```sql
-- Перевірити що глава створилась
SELECT id, chapter_number, title_ua, title_en 
FROM chapters 
WHERE canto_id = '45f1c43d-59c0-4faa-8599-67a52443d967' 
  AND chapter_number = 1;

-- Перевірити кількість віршів
SELECT COUNT(*) 
FROM verses 
WHERE chapter_id = '<id_з_попереднього_запиту>';

-- Перевірити перший вірш
SELECT verse_number, sanskrit, translation_ua, translation_en 
FROM verses 
WHERE chapter_id = '<id_з_попереднього_запиту>' 
ORDER BY verse_number 
LIMIT 1;
```

### 6. Перевірити у веб-інтерфейсі

Відкрити: https://ummavoice.com/veda-reader/bhagavatam/canto/3/chapter/1

### 7. Імпорт ВСІХ 33 глав

⚠️ **УВАГА:** Це займе ~30-60 хвилин через затримки між запитами до Vedabase.

```bash
python3 import_sb_epub.py \
  --epub public/epub/UK_SB_3_epub_r1.epub \
  --canto 3 \
  --chapters 1-33
```

**Прогрес буде показаний в консолі:**
```
[1/33] Importing Chapter 1: "Запитання Відури"...
  ✅ Parsed 48 verses from EPUB
  🌐 Fetching Vedabase data... (48 requests, ~24 seconds)
  💾 Saved to database (Chapter ID: xxx)

[2/33] Importing Chapter 2: "Пам'ятання Господа"...
  ✅ Parsed 32 verses from EPUB
  🌐 Fetching Vedabase data... (32 requests, ~16 seconds)
  💾 Saved to database (Chapter ID: xxx)

...

[33/33] Importing Chapter 33: "Діяльність Капілабгагавана"...
  ✅ Parsed 39 verses from EPUB
  🌐 Fetching Vedabase data... (39 requests, ~20 seconds)
  💾 Saved to database (Chapter ID: xxx)

✅ Import completed!
   - Chapters imported: 33/33
   - Verses imported: ~1000
   - Time elapsed: 45 minutes
```

## Після імпорту

### 1. Оновити метадані Canto 3

```sql
UPDATE cantos 
SET 
  title_ua = 'Статус-кво',
  title_en = 'The Status Quo',
  description_ua = 'Опис створення та космічної маніфестації. Розваги Господа Капіли.',
  description_en = 'The description of creation and cosmic manifestation. Pastimes of Lord Kapila.',
  is_published = true
WHERE id = '45f1c43d-59c0-4faa-8599-67a52443d967';
```

### 2. Перевірити статистику

```sql
-- Кількість глав у Пісні 3
SELECT COUNT(*) as chapters_count
FROM chapters 
WHERE canto_id = '45f1c43d-59c0-4faa-8599-67a52443d967';
-- Очікувано: 33

-- Кількість віршів у Пісні 3
SELECT COUNT(*) as verses_count
FROM verses v
JOIN chapters ch ON v.chapter_id = ch.id
WHERE ch.canto_id = '45f1c43d-59c0-4faa-8599-67a52443d967';
-- Очікувано: ~1000

-- Розподіл віршів по главах
SELECT 
  ch.chapter_number,
  ch.title_ua,
  COUNT(v.id) as verses_count
FROM chapters ch
LEFT JOIN verses v ON v.chapter_id = ch.id
WHERE ch.canto_id = '45f1c43d-59c0-4faa-8599-67a52443d967'
GROUP BY ch.chapter_number, ch.title_ua
ORDER BY ch.chapter_number;
```

### 3. Перевірити якість даних

```sql
-- Перевірити що всі поля заповнені (випадкова глава 10)
SELECT 
  verse_number,
  LENGTH(sanskrit) as sanskrit_len,
  LENGTH(transliteration_ua) as translit_ua_len,
  LENGTH(transliteration_en) as translit_en_len,
  LENGTH(synonyms_ua) as syn_ua_len,
  LENGTH(synonyms_en) as syn_en_len,
  LENGTH(translation_ua) as trans_ua_len,
  LENGTH(translation_en) as trans_en_len,
  LENGTH(commentary_ua) as comm_ua_len,
  LENGTH(commentary_en) as comm_en_len
FROM verses v
JOIN chapters ch ON v.chapter_id = ch.id
WHERE ch.canto_id = '45f1c43d-59c0-4faa-8599-67a52443d967'
  AND ch.chapter_number = 10
ORDER BY verse_number;
```

## Альтернатива: TypeScript імпортер

⚠️ **УВАГА: Попередній TypeScript EPUB парсер був видалений** через критичні помилки що призвели до втрати даних (commit 445fb05).

**Правильний підхід для TypeScript імпорту** описаний в: **`SB_EPUB_IMPORT_GUIDE.md`**

Ключові вимоги:
- ✅ Використовувати `extractHTMLFromEPUB` + `JSZip`
- ✅ Конвертувати IAST → українську через `convertIASTtoUkrainian()`
- ✅ Генерувати `synonyms_ua` з `synonyms_en` через `generateSynonymsUA()`
- ✅ Використовувати UPSERT замість INSERT
- ❌ НЕ автоматично запускати імпорт
- ❌ НЕ використовувати видалені файли (`srimad_bhagavatam_epub_parser.ts`, `srimad_bhagavatam_merger.ts`)

**Рекомендація:** Використовувати Python скрипт до створення безпечного TypeScript імпортера.

## Troubleshooting

### Помилка: "Module ebooklib not found"
```bash
pip3 install --upgrade ebooklib
```

### Помилка: "SUPABASE_SERVICE_KEY not set"
Експортувати змінну:
```bash
export SUPABASE_SERVICE_KEY="<service_role_key>"
```

### Помилка: "Rate limit exceeded" (429)
Vedabase обмежує кількість запитів. Скрипт автоматично робить затримки 500ms між запитами. Якщо помилка все одно виникає - збільшити затримку в коді:
```python
await asyncio.sleep(1.0)  # 1 секунда замість 0.5
```

### Повільний імпорт
Це нормально - ~30-60 хвилин для 33 глав через затримки між запитами до Vedabase. Для прискорення можна:
1. Імпортувати без англійських даних: `--skip-vedabase`
2. Імпортувати батчами: спочатку `--chapters 1-10`, потім `--chapters 11-20` тощо

## Корисні посилання

- Python скрипт: `import_sb_epub.py`
- EPUB файл: `public/epub/UK_SB_3_epub_r1.epub`
- **Правильний TypeScript підхід:** `SB_EPUB_IMPORT_GUIDE.md`
- Діагностичні скрипти:
  - `find_atga_problem.sql` - пошук помилок транслітерації
  - `diagnose_single_fields.sql` - аналіз одинарних полів
  - `TRANSLITERATION_ANALYSIS.md` - повний аналіз проблем

## Результат

Після успішного імпорту:

**База даних:**
- ✅ 33 нові глави у таблиці `chapters`
- ✅ ~1000 нових віршів у таблиці `verses`
- ✅ Всі поля заповнені (UA + EN)

**Веб-інтерфейс:**
- ✅ Навігація: ШБ → Пісня 3 → Список глав (1-33)
- ✅ Читання: кожна глава з усіма віршами
- ✅ Sanskrit (Devanagari) відображається коректно
- ✅ Діакритичні знаки в transliteration
- ✅ Breadcrumbs працюють

**Статистика:**
```
Шрімад-Бхаґаватам:
├─ Пісня 1: 22 глави ✅
├─ Пісня 2: 11 глав ✅
├─ Пісня 3: 33 глави ✅ НОВІ!
├─ Пісня 4: 1 глава
└─ Пісня 10: 1 глава

Всього: 67 глав, ~1500+ віршів
```
