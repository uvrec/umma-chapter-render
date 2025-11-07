# Система імпорту листів Прабгупади з Vedabase

## Огляд

Система для імпорту історичних листів Шріли Прабгупади з vedabase.io/en/library/letters/ (1947-1977) з автоматичним перекладом та транслітерацією для української версії.

## Компоненти

### 1. База даних

**Міграція:** `supabase/migrations/20251107000002_create_letters_tables.sql`

**Таблиця:** `letters`
- `slug` (унікальний, наприклад: 'letter-to-mahatma-gandhi')
- `recipient_en/ua` - отримувач листа
- `letter_date` - дата листа
- `location_en/ua` - локація написання
- `reference` - vedabase reference ('47-07-12')
- `address_block` - адреса отримувача
- `content_en/ua` - текст листа

**Індекси:** дата, отримувач, локація, reference

### 2. Python інструменти

**letters_importer.py** - парсинг з vedabase
```bash
python tools/letters_importer.py --slug letter-to-mahatma-gandhi
```

**letter_translator.py** - переклад на українську
```bash
python tools/letter_translator.py \
    --input tools/outputs/letters/letter-to-mahatma-gandhi.json
```

### 3. Структура даних

**JSON формат:**
```json
{
  "metadata": {
    "slug": "letter-to-mahatma-gandhi",
    "recipient_en": "Mahatma Gandhi",
    "recipient_ua": "Махатма Ґанді",
    "letter_date": "1947-07-12",
    "location_en": "Cawnpore",
    "location_ua": "Канпур",
    "reference": "47-07-12",
    "address_block": "Mahatma Gandhijee\nBhangi Colony\nNew Delhi."
  },
  "content_en": "Dear Friend Mahatmajee, ...",
  "content_ua": "Шановний друже Махатмаджі, ...",
  "sanskrit_terms": ["Bhagavad-gītā", "dharma", ...]
}
```

## Використання

### Імпорт одного листа

```bash
# 1. Завантажити з Vedabase
python tools/letters_importer.py --slug letter-to-mahatma-gandhi

# 2. Перекласти
python tools/letter_translator.py \
    --input tools/outputs/letters/letter-to-mahatma-gandhi.json

# 3. Результат
# tools/outputs/letters/letter-to-mahatma-gandhi_ua.json
```

### Масовий імпорт

```bash
#!/bin/bash
SLUGS=(
  "letter-to-mahatma-gandhi"
  "letter-to-jawaharlal-nehru"
  "letter-to-sardar-patel"
)

for slug in "${SLUGS[@]}"; do
  python tools/letters_importer.py --slug "$slug"
  python tools/letter_translator.py \
      --input "tools/outputs/letters/${slug}.json"
  sleep 3
done
```

## Особливості

**Відмінності від лекцій:**
- ✅ Немає параграфів - суцільний текст
- ✅ Є отримувач (recipient)
- ✅ Є reference ID
- ✅ Є адреса отримувача
- ✅ Формальна структура листа
- ❌ Немає аудіо

## Frontend (TODO)

Маршрути:
- `/library/letters` - список листів
- `/library/letters/:slug` - окремий лист

Функціонал:
- Фільтрація за отримувачем, локацією, роком
- Пошук по тексту
- Сортування за датою
- Групування за роками
- Підсвітка санскритських термінів
- Мовний переключач (UA/EN)

## Міграція

Застосуйте міграцію:
```sql
-- Через Supabase Dashboard SQL Editor
-- або
supabase db push
```

Після цього Supabase згенерує TypeScript типи автоматично.
