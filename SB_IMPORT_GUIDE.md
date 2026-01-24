# Імпорт Śrīmad-Bhāgavatam з PDF + Vedabase

## Логіка імпорту

### Джерела даних

**З PDF (українська версія):**
- ✅ Sanskrit (Devanagari/Bengali текст)
- ✅ Translation UA (український переклад)
- ✅ Commentary UA (українське пояснення)

**З Vedabase (англійська версія):**
- ✅ Transliteration EN (IAST латиниця)
- ✅ Synonyms EN (IAST послівний переклад)
- ✅ Translation EN (англійський переклад)
- ✅ Commentary EN (англійське пояснення)

**Генерується автоматично:**
- ✅ Transliteration UA = `convertIASTtoUkrainian(transliteration_en)`
- ✅ Synonyms UA = `convertIASTtoUkrainian(synonyms_en)`

### Процес імпорту

```
1. Читання PDF
   ├─ Витягується Sanskrit
   ├─ Витягується Translation_UA
   └─ Витягується Commentary_UA

2. Запит до Vedabase (для кожного віршу)
   ├─ https://vedabase.io/en/library/sb/{canto}/{chapter}/{verse}/
   ├─ Витягується Transliteration_EN (IAST)
   ├─ Витягується Synonyms_EN (IAST)
   ├─ Витягується Translation_EN
   └─ Витягується Commentary_EN

3. Автоматична нормалізація
   ├─ Transliteration_UA ← normalize(Transliteration_EN)
   │   └─ IAST → Ukrainian через convertIASTtoUkrainian()
   └─ Synonyms_UA ← normalize(Synonyms_EN)
       └─ IAST терміни → Ukrainian через convertIASTtoUkrainian()

4. Збереження в БД
   └─ Всі 10 полів зберігаються в таблицю verses
```

## Структура PDF

### Формат віршу
```
ВІРШ 1

देवनागरी текст (Sanskrit)

maE‡aeyaovaAca (IAST - ПРОПУСКАЄМО)
інші рядки IAST (ПРОПУСКАЄМО)

мaітрейaувчa (Ukrainian translit - ПРОПУСКАЄМО)
інші рядки UA translit (ПРОПУСКАЄМО)

мaітрейa – мудрець; увчa – сказав (Synonyms - ПРОПУСКАЄМО)
інші синоніми (ПРОПУСКАЄМО)

Шрі Майтрея сказав: Коли Брахма... (Translation UA - БЕРЕМО!)

ПОЯСНЕННЯ: Півбоги, жителі вищих... (Commentary UA - БЕРЕМО!)
```

### Об'єднані вірші
```
ВІРШІ 22-23

देवनागरी текст

брaхмовāчa (транслітерація - ПРОПУСКАЄМО)

брахмā увāча – Господь Брахма сказав (синоніми - ПРОПУСКАЄМО)

Господь Брахма вів далі... (переклад - БЕРЕМО!)

ПОЯСНЕННЯ: Існує дві категорії... (пояснення - БЕРЕМО!)
```

Номер віршу береться як `"22-23"` - один запис у БД.

## Використання

### Встановлення

```bash
# Python залежності
pip install pdfplumber requests supabase

# Змінні середовища
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_KEY="eyJ..."
```

### Тестування (dry-run)

```bash
# Тест на 1 главі
python3 import_sb_pdf.py \
  --pdf UK_SB_3_2_2024_text_r14.pdf \
  --canto 3 \
  --chapters 17 \
  --dry-run

# Очікуваний результат:
# ✅ Parsed verse 1
# ✅ Parsed verse 2
# ...
# ✅ Verse 1: EN data + UA conversion
# ✅ Verse 2: EN data + UA conversion
# ...
# 🔍 Dry run - skipping database save
#
# 📖 Chapter 17: СІМНАДЦЯТА
#    Verses: 30
#    • 1: Шрі Майтрея сказав: Коли Брахма, народжений від...
```

### Імпорт однієї глави

```bash
python3 import_sb_pdf.py \
  --pdf UK_SB_3_2_2024_text_r14.pdf \
  --canto 3 \
  --chapters 17
```

### Імпорт діапазону глав

```bash
python3 import_sb_pdf.py \
  --pdf UK_SB_3_2_2024_text_r14.pdf \
  --canto 3 \
  --chapters 17-33
```

### Без Vedabase (тільки PDF)

```bash
python3 import_sb_pdf.py \
  --pdf UK_SB_3_2_2024_text_r14.pdf \
  --canto 3 \
  --chapters 17 \
  --skip-vedabase
```

## Перевірка результату

### У базі даних

```sql
-- Перевірити створені глави
SELECT c.chapter_number, c.title_uk, COUNT(v.id) as verse_count
FROM chapters c
LEFT JOIN verses v ON v.chapter_id = c.id
WHERE c.canto_id IN (
  SELECT id FROM cantos WHERE canto_number = 3
)
GROUP BY c.id, c.chapter_number, c.title_uk
ORDER BY c.chapter_number;

-- Приклад віршу
SELECT
  verse_number,
  LENGTH(sanskrit) as sanskrit_len,
  LENGTH(transliteration_en) as translit_en_len,
  LENGTH(transliteration_uk) as translit_uk_len,
  LENGTH(translation_uk) as trans_uk_len,
  LENGTH(commentary_uk) as comm_uk_len
FROM verses
WHERE chapter_id IN (
  SELECT id FROM chapters
  WHERE chapter_number = 17
  AND canto_id IN (SELECT id FROM cantos WHERE canto_number = 3)
)
LIMIT 5;
```

### На сайті

```
https://vedavoice.org/veda-reader/bhagavatam/canto/3/chapter/17
```

## Відомі проблеми та рішення

### 1. Пробіли між словами в PDF

**Проблема:** PyPDF2 склеює слова без пробілів
```
щавїїчоловік → "щав її чоловік"
```

**Рішення:** Використовуємо `pdfplumber` замість PyPDF2
```python
import pdfplumber
with pdfplumber.open(pdf_path) as pdf:
    text = pdf.pages[0].extract_text()
```

### 2. Об'єднані вірші (22-23)

**Проблема:** Один запис у PDF відповідає кільком віршам

**Рішення:** Зберігаємо як `verse_number = "22-23"` - один запис у БД
- У БД є поле `verse_number_computed BIGINT` для сортування
- Використовуємо генерований стовпець для обробки таких номерів

### 3. IAST діакритики

**Проблема:** IAST містить спеціальні символи: āīūṛṝḷḹēōṃḥśṣṇṭḍñṅ

**Рішення:** `convertIASTtoUkrainian()` автоматично конвертує:
- `ā` → `а̄` (українська "а" з макроном)
- `ī` → `ī` (українська "і" з макроном)
- `ṣ` → `ш` (українська "ш")
- тощо

### 4. Vedabase rate limiting

**Проблема:** Забагато запитів → 429 Too Many Requests

**Рішення:** Додано затримку між запитами
```python
import time
time.sleep(1)  # 1 секунда між запитами
```

## Приклад результату

### Вірш 3.17.1

**Після імпорту в БД:**

| Поле | Значення |
|------|----------|
| `verse_number` | `"1"` |
| `sanskrit` | `मैत्रेय उवाच निषम्यात्मभुवा गीतं...` |
| `transliteration_en` | `maitreya uvāca niṣamyātma-bhuvā gītaṃ...` |
| `transliteration_uk` | `маітрейа увāча нішамйāтма-бхувā ґīтам...` |
| `synonyms_en` | `maitreyaḥ — the sage Maitreya; uvāca — said...` |
| `synonyms_uk` | `маітрейах̣ — мудрець Майтрея; увāча — сказав...` |
| `translation_uk` | `Шрі Майтрея сказав: Коли Брахма...` |
| `translation_en` | `Maitreya said: When Brahmā, born from Viṣṇu...` |
| `commentary_uk` | `Півбоги, жителі вищих планет...` |
| `commentary_en` | `The demigods, who are residents of the higher...` |

## Наступні кроки

1. ✅ Протестувати dry-run на главі 17
2. ⏳ Імпортувати главу 17 в БД
3. ⏳ Перевірити на сайті
4. ⏳ Імпортувати решту глав 18-33
5. ⏳ Повторити для інших пісень SB

## Технічні деталі

### Структура БД

```sql
-- Книга
books (
  id: uuid
  slug: 'bhagavatam'
  has_cantos: true
)

-- Пісня (canto)
cantos (
  id: uuid
  book_id: uuid → books.id
  canto_number: 3
  title_uk: 'Пісня третя'
)

-- Глава
chapters (
  id: uuid
  canto_id: uuid → cantos.id
  chapter_number: 17
  title_uk: 'Хіраньякша завойовує всі сторони світу'
  chapter_type: 'verses'
)

-- Вірш
verses (
  id: uuid
  chapter_id: uuid → chapters.id
  verse_number: '1' або '22-23'
  verse_number_computed: bigint (generated)

  sanskrit: text
  transliteration_en: text
  transliteration_uk: text
  synonyms_en: text
  synonyms_uk: text
  translation_en: text
  translation_uk: text
  commentary_en: text
  commentary_uk: text
)
```

### Нормалізатор

```typescript
// textNormalizer.ts
export function convertIASTtoUkrainian(text: string): string {
  // Конвертує IAST латиницю в українську кирилицю
  // vande gurūn īśa-bhaktān → ванде ґурӯн īш́а-бгактāн
}

export function normalizeVerseField(text: string, fieldType: string): string {
  // Застосовує всі правила нормалізації залежно від типу поля
}
```

### Існуючі інструменти

- ✅ `textNormalizer.ts` - IAST → Ukrainian
- ✅ `vedabaseParsers_FIXED.ts` - парсинг Vedabase HTML
- ✅ `pre_import_normalizer.py` - Python версія нормалізатора
- ✅ `import_sb_pdf.py` - PDF імпорт для Śrīmad-Bhāgavatam

## Важливі особливості

1. **Об'єднані вірші (22-23)** - зберігаються як один запис з `verse_number = "22-23"`
2. **pdfplumber замість PyPDF2** - правильно обробляє пробіли між словами
3. **Затримка між Vedabase запитами** - уникнення rate limiting (1 сек/вірш)
4. **Нормалізація через існуючі інструменти** - використовується `normalize_verse()` з `pre_import_normalizer.py`

## Очікувані результати

### Глава 17 (приклад):

- ~30 віршів
- Час імпорту: ~2-3 хвилини (30 запитів до Vedabase)
- Всі 10 полів заповнені: sanskrit, transliteration_en/uk, synonyms_en/uk, translation_en/uk, commentary_en/uk

### Всі глави 17-33:

- ~400-500 віршів
- Час імпорту: ~30-45 хвилин
- URL: https://vedavoice.org/veda-reader/bhagavatam/canto/3/chapter/{17-33}

---

**Автор:** VedaVoice.org
**Останнє оновлення:** 16 листопада 2025
