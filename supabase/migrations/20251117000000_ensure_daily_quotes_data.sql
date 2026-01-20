-- Міграція для гарантування наявності налаштувань та дефолтної цитати
-- Виконується після створення таблиці daily_quotes

-- Create site_settings table if not exists (in case previous migration didn't run)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Переконуємося, що налаштування verse_of_the_day існують
INSERT INTO site_settings (key, value, description)
VALUES (
  'verse_of_the_day',
  jsonb_build_object(
    'enabled', true,
    'rotation_mode', 'sequential',
    'current_index', 0,
    'last_updated', NULL
  ),
  'Configuration for daily verse/quote rotation on homepage'
)
ON CONFLICT (key) DO UPDATE
SET
  value = CASE
    WHEN site_settings.value IS NULL THEN EXCLUDED.value
    WHEN site_settings.value->>'enabled' IS NULL THEN
      jsonb_set(site_settings.value, '{enabled}', 'true'::jsonb)
    ELSE site_settings.value
  END,
  description = COALESCE(site_settings.description, EXCLUDED.description);

-- Переконуємося, що існує хоча б одна активна цитата
-- Додаємо дефолтну цитату від Шріли Прабгупади, якщо таблиця порожня
DO $$
BEGIN
  -- Перевіряємо, чи є активні цитати
  IF NOT EXISTS (SELECT 1 FROM daily_quotes WHERE is_active = true LIMIT 1) THEN
    -- Додаємо дефолтну цитату
    INSERT INTO daily_quotes (
      quote_type,
      quote_uk,
      quote_en,
      author_uk,
      author_en,
      source_uk,
      source_en,
      priority,
      is_active
    ) VALUES (
      'custom',
      'За моєї відсутності читайте книжки. Все, про що я говорю, я написав у книжках. Ви можете підтримувати зв''язок зі мною через мої книги.',
      'In my absence, read my books. Everything I have spoken, I have written in my books. You can associate with me by reading my books.',
      'Шріла Прабгупада',
      'Srila Prabhupada',
      'Лист',
      'Letter',
      100,
      true
    )
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Додано дефолтну цитату від Шріли Прабгупади';
  ELSE
    RAISE NOTICE 'Активні цитати вже існують, пропускаємо додавання дефолтної цитати';
  END IF;
END $$;

-- Додаємо коментар
COMMENT ON TABLE daily_quotes IS 'Stores quotes (verses or custom) displayed on the homepage banner. Contains at least one default quote from Srila Prabhupada.';
