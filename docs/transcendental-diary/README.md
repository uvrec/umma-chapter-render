# Transcendental Diary Import

Інструкції для імпорту книги "Transcendental Diary" by Hari Sauri dasa.

## Джерело

**URL:** https://prabhupadavani.org/bio/transcendental-diary/

## Структура книги

Книга складається з 5 томів:

| Volume | Period | Chapters |
|--------|--------|----------|
| 1 | November 1975 – April 1976 | 12 |
| 2 | April 1976 – June 1976 | 6 |
| 3 | June 1976 – August 1976 | 6 |
| 4 | August 1976 – October 1976 | 6 |
| 5 | October 1976 – November 1977 | 8 |

## Проблема з автоматичним парсингом

Сайт prabhupadavani.org захищений **Cloudflare**, що блокує автоматичні запити. Тому потрібен ручний підхід.

## Варіанти імпорту

### Варіант 1: Використати шаблон даних (рекомендовано)

Файл `src/data/transcendental-diary-parsed.json` містить структуру книги зі скороченим вмістом.

1. Відредагуйте файл, додавши повний контент кожної глави
2. Запустіть імпорт:
   ```bash
   npx ts-node tools/import-transcendental-diary.ts --dry-run  # перегляд
   npx ts-node tools/import-transcendental-diary.ts            # імпорт
   ```

### Варіант 2: Ручне завантаження HTML

1. Відкрийте кожну главу в браузері
2. Збережіть HTML (Ctrl+S або File > Save As)
3. Покладіть файли у відповідні папки:
   ```
   docs/transcendental-diary/
   ├── v1/
   │   ├── chapter-1.html
   │   ├── chapter-2.html
   │   └── ...
   ├── v2/
   │   └── ...
   └── ...
   ```
4. Запустіть парсер:
   ```bash
   npx ts-node tools/parse-transcendental-diary.ts
   ```

### Варіант 3: Використати Playwright (advanced)

Для автоматичного обходу Cloudflare можна використати Playwright:

```bash
npm install playwright
npx playwright install chromium
```

Потім модифікувати парсер для використання headless browser.

## Команди

```bash
# Переглянути довідку
npx ts-node tools/parse-transcendental-diary.ts --help

# Парсити тільки том 1
npx ts-node tools/parse-transcendental-diary.ts --volume=1

# Парсити тільки главу 1 тому 1
npx ts-node tools/parse-transcendental-diary.ts --volume=1 --chapter=1

# Імпорт у базу даних (dry-run)
npx ts-node tools/import-transcendental-diary.ts --dry-run

# Імпорт у базу даних
npx ts-node tools/import-transcendental-diary.ts

# Імпорт тільки том 1
npx ts-node tools/import-transcendental-diary.ts --volume=1
```

## Змінні середовища

Для імпорту в базу даних потрібні:

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_KEY="your-service-role-key"
```

## Структура даних

Книга імпортується як:
- **Book**: `td` (Transcendental Diary)
- **Cantos**: 5 томів (Volume 1-5)
- **Chapters**: глави з `chapter_type: "text"`

## Примітки

- Наразі доступна лише англійська версія
- Українська версія може бути додана пізніше через редагування в адмін-панелі
- Кожна глава містить оповідання про подорожі зі Шрілою Прабгупадою
