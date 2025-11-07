# Система імпорту лекцій з Vedabase

## Огляд

Ця система дозволяє імпортувати лекції Шріли Прабгупади з vedabase.io/en/library/transcripts/ з автоматичним перекладом та транслітерацією для української версії.

## Компоненти системи

### 1. База даних

**Міграція:** `supabase/migrations/20251107000001_create_lectures_tables.sql`

**Таблиці:**
- `lectures` - метадані лекцій (дата, місце, тип, аудіо URL)
- `lecture_paragraphs` - параграфи лекцій з текстом та timecodes

**Індекси:**
- За датою (DESC)
- За типом лекції
- За локацією
- За посиланням на книгу

**Особливості:**
- Підтримка двох мов (EN та UA)
- RLS політики (public read, admin write)
- Автоматичне оновлення `updated_at` timestamp

### 2. Python імпортер

**Файл:** `tools/lectures_importer.py`

**Функціонал:**
- Парсинг HTML з vedabase.io
- Витяг метаданих (дата, локація, тип, аудіо)
- Парсинг параграфів лекції
- Виявлення санскритських термінів
- Витяг timecodes для синхронізації з аудіо
- Експорт в JSON

**Використання:**
```bash
# Імпорт однієї лекції
python tools/lectures_importer.py --slug 660307bg-new-york

# Вказати output файл
python tools/lectures_importer.py \
    --slug 660307bg-new-york \
    --output lectures/660307bg-new-york.json

# Змінити delay між запитами
python tools/lectures_importer.py \
    --slug 660307bg-new-york \
    --delay 3.0
```

**Формат slug:**
- `660307bg-new-york` = 1966-03-07, Bhagavad-gita lecture, New York
- `YYMMDD{book}-{location}`

### 3. Перекладач

**Файл:** `tools/lecture_translator.py`

**Функціонал:**
- Транслітерація санскритських термінів
- Застосування діакритичних маркерів
- Нормалізація українського тексту
- (Опціонально) Інтеграція з Google Translate API

**Використання:**
```bash
# Базова транслітерація (без машинного перекладу)
python tools/lecture_translator.py \
    --input lectures/660307bg-new-york.json

# З машинним перекладом (потрібен API ключ)
python tools/lecture_translator.py \
    --input lectures/660307bg-new-york.json \
    --use-mt

# Вказати output файл
python tools/lecture_translator.py \
    --input lectures/660307bg-new-york.json \
    --output lectures/660307bg-new-york_ua.json
```

**Санскритські терміни:**
- Krishna -> Крішна
- Bhagavad-gita -> Бгаґавад-ґіта
- bhakti -> бгакті
- yoga -> йоґа
- [повний список в коді]

### 4. Frontend компоненти

#### LecturesLibrary
**Файл:** `src/pages/library/LecturesLibrary.tsx`
**Маршрут:** `/library/lectures`

**Функціонал:**
- Список всіх лекцій
- Фільтрація (тип, локація, книга, дата)
- Пошук по тексту
- Сортування (дата, місце, тип, назва)
- Групування (за роком, місцем, типом)
- Мовний переключач (UA/EN)

#### LectureView
**Файл:** `src/pages/library/LectureView.tsx`
**Маршрут:** `/library/lectures/:slug`

**Функціонал:**
- Відображення тексту лекції по параграфах
- Аудіо програвач з синхронізацією
- Підсвітка поточного параграфа під час відтворення
- Підсвітка санскритських термінів (hover для перекладу)
- Мовний переключач (UA/EN)
- Навігація між лекціями

### 5. TypeScript типи

**Файл:** `src/types/lecture.ts`

**Типи:**
- `Lecture` - метадані лекції
- `LectureParagraph` - параграф лекції
- `LectureType` - типи лекцій (enum)
- `LectureFilters` - фільтри для списку
- `LectureSortOptions` - опції сортування
- `SanskritTerm` - санскритський термін для глосарія

## Робочий процес імпорту

### Крок 1: Завантаження лекції з Vedabase

```bash
python tools/lectures_importer.py --slug 660307bg-new-york
# Результат: tools/outputs/lectures/660307bg-new-york.json
```

### Крок 2: Переклад на українську

```bash
python tools/lecture_translator.py \
    --input tools/outputs/lectures/660307bg-new-york.json
# Результат: tools/outputs/lectures/660307bg-new-york_ua.json
```

### Крок 3: Імпорт в базу даних

Використовуйте admin панель або SQL:

```sql
-- Вставка метаданих лекції
INSERT INTO public.lectures (
    slug, title_en, title_ua, lecture_date,
    location_en, location_ua, lecture_type,
    audio_url, book_slug, chapter_number, verse_number
) VALUES (
    '660307bg-new-york',
    'Bhagavad-gītā 2.12',
    'Бгаґавад-ґіта 2.12',
    '1966-03-07',
    'New York',
    'Нью-Йорк',
    'Bhagavad-gita',
    'https://vedabase.io/media/audio/660307bg-new-york.mp3',
    'bg',
    2,
    '12'
) RETURNING id;

-- Вставка параграфів
INSERT INTO public.lecture_paragraphs (
    lecture_id, paragraph_number, content_en, content_ua, audio_timecode
) VALUES
    ('{lecture_id}', 1, 'English text...', 'Український текст...', 0),
    ('{lecture_id}', 2, 'English text...', 'Український текст...', 120),
    ...;
```

### Крок 4: Перевірка на frontend

Відкрийте:
- `/library/lectures` - список лекцій
- `/library/lectures/660307bg-new-york` - сторінка лекції

## Структура даних

### JSON формат експорту

```json
{
  "metadata": {
    "slug": "660307bg-new-york",
    "title_en": "Bhagavad-gītā 2.12",
    "title_ua": "Бгаґавад-ґіта 2.12",
    "lecture_date": "1966-03-07",
    "location_en": "New York",
    "location_ua": "Нью-Йорк",
    "lecture_type": "Bhagavad-gita",
    "lecture_type_ua": "Лекція з Бгаґавад-ґіти",
    "audio_url": "https://vedabase.io/media/audio/660307bg-new-york.mp3",
    "book_slug": "bg",
    "chapter_number": 2,
    "verse_number": "12"
  },
  "paragraphs": [
    {
      "paragraph_number": 1,
      "content_en": "Prabhupāda: [Introductory commentary...]",
      "content_ua": "Прабгупада: [Вступний коментар...]",
      "audio_timecode": 0,
      "sanskrit_terms": ["kṛṣṇa", "bhakti-yoga", "dharma"]
    },
    ...
  ],
  "sanskrit_terms": ["kṛṣṇa", "bhakti-yoga", "dharma", ...]
}
```

## Особливості парсингу

### Діалогічний формат

Лекції можуть містити діалоги:

```
Prabhupāda: So, in the Bhagavad-gītā...

Young man: Can you explain what is karma-yoga?

Prabhupāda: Yes. Karma-yoga means...
```

Імпортер зберігає це як окремі параграфи зі збереженням міток спікерів.

### Санскритські вірші

Вірші в лекціях зберігаються в параграфах з маркуванням:

```
kārpaṇya-doṣopahata-svabhāvaḥ
pṛcchāmi tvāṁ dharma-sammūḍha-cetāḥ
```

Виявляються за наявністю діакритичних знаків та курсиву.

### Переклади

Переклади віршів зазвичай в квадратних дужках:

```
[I am now confused about my duty and have lost all composure...]
```

## Масовий імпорт

Для імпорту багатьох лекцій створіть bash скрипт:

```bash
#!/bin/bash
# import_lectures.sh

SLUGS=(
    "660219bg-new-york"
    "660302bg-new-york"
    "660304bg-new-york"
    "660307bg-new-york"
    # ... add more
)

for slug in "${SLUGS[@]}"; do
    echo "Importing $slug..."

    # Імпорт
    python tools/lectures_importer.py --slug "$slug"

    # Переклад
    python tools/lecture_translator.py \
        --input "tools/outputs/lectures/${slug}.json"

    sleep 3  # Пауза між запитами
done

echo "Done!"
```

## Налаштування

### Додавання нових санскритських термінів

Відредагуйте `tools/lecture_translator.py`:

```python
SANSKRIT_TRANSLITERATIONS = {
    # ... існуючі терміни
    "new_term": "новий_термін",
}
```

### Додавання нових типів лекцій

Відредагуйте `src/types/lecture.ts`:

```typescript
export type LectureType =
  | "Conversation"
  | "Walk"
  // ... існуючі типи
  | "NewType";  // додайте новий тип
```

Також оновіть `tools/lectures_importer.py`:

```python
LECTURE_TYPE_TRANSLATIONS = {
    # ... існуючі переклади
    "NewType": "Новий тип",
}
```

### Інтеграція з Google Translate API

Для автоматичного машинного перекладу:

1. Отримайте API ключ від Google Cloud
2. Встановіть бібліотеку:
   ```bash
   pip install googletrans-py
   ```
3. Оновіть `tools/lecture_translator.py`:
   ```python
   from googletrans import Translator

   def translate_paragraph(self, text_en, use_machine_translation=True):
       # ... existing code
       if use_machine_translation:
           translator = Translator()
           result = translator.translate(result, src='en', dest='uk').text
   ```

## Troubleshooting

### Проблема: 403 помилка при завантаженні з vedabase.io

**Рішення:** Збільшіть delay між запитами:
```bash
python tools/lectures_importer.py --slug ... --delay 5.0
```

### Проблема: Неправильна транслітерація термінів

**Рішення:** Додайте правило в `SANSKRIT_TRANSLITERATIONS` або `DIACRITIC_MAPPINGS`

### Проблема: Параграфи не синхронізовані з аудіо

**Рішення:** Vedabase не завжди надає timecodes. Можна додати їх вручну в БД або використати інструменти автоматичної синхронізації.

## Roadmap

- [ ] Автоматичне виявлення та збереження глосарія термінів
- [ ] Інтеграція з Google Translate API
- [ ] Пошук по тексту лекцій (full-text search)
- [ ] Закладки та нотатки користувачів
- [ ] Експорт лекцій в PDF/EPUB
- [ ] Синхронізація прогресу прослуховування
- [ ] Плейлісти лекцій

## Підтримка

Якщо виникають питання або проблеми, зверніться до документації проєкту або створіть issue в репозиторії.
