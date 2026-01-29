
# Виправлення помилки "public.simple_unaccent" does not exist

## Проблема

На скріншоті видно помилку:
```
Помилка
text search configuration "public.simple_unaccent" does not exist
```

Це виникає тому що:
1. Міграція `20251228120000_optimize_search_and_unified_search.sql` мала створити `public.simple_unaccent` text search configuration
2. Але ця конфігурація **відсутня** в базі Test (перевірено: є тільки стандартні pg_catalog конфіги)
3. При цьому extension `unaccent` встановлено коректно

RPC функції (`search_verses_fulltext`, `unified_search`, `search_suggest_terms`, тригери оновлення `search_vector_uk`) використовують `'public.simple_unaccent'` для українського тексту, і без цієї конфігурації вони падають з помилкою.

## Рішення

### Крок 1: Виконати SQL в Cloud View → Run SQL (Test)

Потрібно виконати наступний SQL запит:

```text
-- Створюємо text search configuration для українського тексту з unaccent
-- (accent-insensitive пошук: і = ї, е = є тощо)

CREATE TEXT SEARCH CONFIGURATION public.simple_unaccent (COPY = simple);

ALTER TEXT SEARCH CONFIGURATION public.simple_unaccent
  ALTER MAPPING FOR hword, hword_part, word WITH unaccent, simple;

COMMENT ON TEXT SEARCH CONFIGURATION public.simple_unaccent IS
  'Text search config for Ukrainian: accent-insensitive using unaccent + simple tokenizer';
```

### Крок 2: Перевірити результат

Після виконання SQL перевірити що конфігурація існує:

```text
SELECT cfgname, cfgnamespace::regnamespace::text 
FROM pg_ts_config 
WHERE cfgname = 'simple_unaccent';
```

Очікуваний результат: `simple_unaccent | public`

### Крок 3: Перезавантажити сторінку

Помилка повинна зникнути.

---

## Технічні деталі

### Чому це сталось

1. Міграція `20251228120000` містить `DO $$ ... IF NOT EXISTS ... CREATE TEXT SEARCH CONFIGURATION ... $$`
2. Ймовірно міграція не виконалась повністю або була відкачена
3. Extension `unaccent` залишився, але конфіг `simple_unaccent` — ні

### Які функції залежать від simple_unaccent

| Функція | Де використовується |
|---------|---------------------|
| `search_verses_fulltext()` | /search сторінка, Knowledge Compiler |
| `unified_search()` | Глобальний пошук (header) |
| `search_suggest_terms()` | Автокомпліт підказки |
| `update_verse_search_vector()` | Тригер при INSERT/UPDATE віршів |
| `update_blog_post_search_vector()` | Тригер при INSERT/UPDATE блог-постів |

### Для Production (при Publish)

Перед публікацією потрібно виконати той самий SQL в **Live** середовищі, інакше published сайт матиме ту ж помилку.
