# 🚀 Швидкий старт: Імпорт Śrīmad-Bhāgavatam

## Підготовка

```bash
# 1. Встановити залежності
pip install pdfplumber requests supabase

# 2. Налаштувати змінні
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_KEY="eyJ..."
```

## Тест (без збереження)

```bash
python3 import_sb_pdf.py \
  --pdf UK_SB_3_2_2024_text_r14.pdf \
  --canto 3 \
  --chapters 17 \
  --dry-run
```

**Очікуваний результат:**
```
📄 Reading PDF: UK_SB_3_2_2024_text_r14.pdf
✅ Extracted 2847392 characters

🔍 Parsing chapters from canto 3...
📖 Found chapter: 17 - СІМНАДЦЯТА
📝 Found 30 verses
✅ Parsed verse 1
✅ Parsed verse 2
...
✅ Found 1 chapters

🌐 Fetching English data from Vedabase...
  📖 Chapter 17:
    🔄 Fetching verse 1... ✅
    🔄 Fetching verse 2... ✅
    ...

🔍 Dry run - skipping database save

📖 Chapter 17: СІМНАДЦЯТА
   Verses: 30
   • 1: Шрі Майтрея сказав: Коли Брахма...
   • 2: Доброчесна Діті дуже хвилювалася...
   • 3: Коли двоє демонів народжувалися...

✅ Import complete!
```

## Імпорт

```bash
# Одна глава
python3 import_sb_pdf.py \
  --pdf UK_SB_3_2_2024_text_r14.pdf \
  --canto 3 \
  --chapters 17

# Всі глави 17-33
python3 import_sb_pdf.py \
  --pdf UK_SB_3_2_2024_text_r14.pdf \
  --canto 3 \
  --chapters 17-33
```

## Перевірка

```bash
# У базі (якщо встановлено psql)
psql $DATABASE_URL -c "
  SELECT c.chapter_number, c.title_uk, COUNT(v.id) as verses
  FROM chapters c
  LEFT JOIN verses v ON v.chapter_id = c.id
  WHERE c.canto_id IN (SELECT id FROM cantos WHERE canto_number = 3)
  GROUP BY c.chapter_number, c.title_uk
  ORDER BY c.chapter_number;
"

# На сайті
# https://vedavoice.org/veda-reader/bhagavatam/canto/3/chapter/17
```

## Що робить скрипт?

### З PDF беремо:
- ✅ Sanskrit (देवनागरी)
- ✅ Translation UA (український переклад)
- ✅ Commentary UA (українське пояснення)

### З Vedabase беремо:
- ✅ Transliteration EN (IAST)
- ✅ Synonyms EN (IAST)
- ✅ Translation EN
- ✅ Commentary EN

### Автоматично генеруємо:
- ✅ Transliteration UA (IAST → Ukrainian)
- ✅ Synonyms UA (IAST → Ukrainian)

## Детальна документація

Дивіться [SB_IMPORT_GUIDE.md](./SB_IMPORT_GUIDE.md)

---

**VedaVoice.org** | Листопад 2025
