# Деплой Edge Functions

## Передеплой fetch-html після додавання нового домену

Після додавання нового домену до `ALLOWED_HOSTS` у `supabase/functions/fetch-html/index.ts`, потрібно передеплоїти функцію.

### Варіант 1: Через Supabase CLI (локально)

```bash
# Встановіть Supabase CLI якщо ще не встановлено
npm install -g supabase

# Залогіньтесь
supabase login

# Лінкуйте проект (якщо ще не зроблено)
supabase link --project-ref your-project-ref

# Задеплойте функцію
supabase functions deploy fetch-html
```

### Варіант 2: Через Supabase Dashboard

1. Відкрийте Supabase Dashboard: https://supabase.com/dashboard
2. Оберіть ваш проект
3. Перейдіть в **Edge Functions** (ліве меню)
4. Знайдіть функцію **fetch-html**
5. Натисніть **Deploy new version**
6. Завантажте файл `supabase/functions/fetch-html/index.ts`
7. Підтвердіть деплой

### Варіант 3: Auto-deploy через GitHub Actions

Якщо у вас налаштований CI/CD, функція автоматично задеплоїться після push до main/master гілки.

## Перевірка після деплою

Після деплою, ви можете перевірити що функція працює:

```bash
curl -X POST 'https://your-project-ref.supabase.co/functions/v1/fetch-html' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your-anon-key' \
  -d '{"url": "https://www.wisdomlib.org/hinduism/book/chaitanya-bhagavata"}'
```

Очікувана відповідь:
```json
{
  "html": "<!DOCTYPE html>..."
}
```

## Додані домени

На даний момент дозволені такі домени:
- vedabase.io
- gitabase.com
- bhaktivinodainstitute.org
- kksongs.org
- **wisdomlib.org** (додано для Chaitanya Bhagavata)

## Troubleshooting

### Помилка "Domain not allowed"

Якщо ви отримуєте помилку "Domain not allowed", перевірте:
1. Чи домен додано до `ALLOWED_HOSTS` в `index.ts`
2. Чи Edge функція передеплоєна після змін
3. Чи правильний URL (з або без www)

### Помилка "Edge Function returned non-2xx status code"

Це зазвичай означає що:
1. Edge функція ще не передеплоєна
2. Цільовий сайт повертає помилку (404, 500, etc.)
3. Проблеми з CORS або blocked by target website

Перевірте логи Edge функції в Supabase Dashboard → Edge Functions → fetch-html → Logs
