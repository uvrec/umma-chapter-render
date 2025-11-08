-- Додати поля для структурованого зберігання параграфів
-- Це дозволяє синхронізувати параграфи між мовами для покращеного відображення

-- Add paragraph fields to verses table
ALTER TABLE public.verses
  ADD COLUMN IF NOT EXISTS commentary_ua_paragraphs JSONB,
  ADD COLUMN IF NOT EXISTS commentary_en_paragraphs JSONB,
  ADD COLUMN IF NOT EXISTS translation_ua_paragraphs JSONB,
  ADD COLUMN IF NOT EXISTS translation_en_paragraphs JSONB;

-- Add paragraph fields to chapters table for summaries
ALTER TABLE public.chapters
  ADD COLUMN IF NOT EXISTS summary_ua_paragraphs JSONB,
  ADD COLUMN IF NOT EXISTS summary_en_paragraphs JSONB;

-- Індекси для JSONB полів (для швидшого пошуку)
CREATE INDEX IF NOT EXISTS idx_verses_commentary_ua_paragraphs ON public.verses USING GIN (commentary_ua_paragraphs);
CREATE INDEX IF NOT EXISTS idx_verses_commentary_en_paragraphs ON public.verses USING GIN (commentary_en_paragraphs);
CREATE INDEX IF NOT EXISTS idx_chapters_summary_ua_paragraphs ON public.chapters USING GIN (summary_ua_paragraphs);
CREATE INDEX IF NOT EXISTS idx_chapters_summary_en_paragraphs ON public.chapters USING GIN (summary_en_paragraphs);

-- Add comments for documentation
COMMENT ON COLUMN public.verses.commentary_ua_paragraphs IS 'Пояснення структуроване по абзацах: [{"index": 0, "text": "..."}, ...]';
COMMENT ON COLUMN public.verses.commentary_en_paragraphs IS 'Commentary structured by paragraphs: [{"index": 0, "text": "..."}, ...]';
COMMENT ON COLUMN public.verses.translation_ua_paragraphs IS 'Переклад структурований по абзацах (якщо довгий): [{"index": 0, "text": "..."}, ...]';
COMMENT ON COLUMN public.verses.translation_en_paragraphs IS 'Translation structured by paragraphs (if long): [{"index": 0, "text": "..."}, ...]';
COMMENT ON COLUMN public.chapters.summary_ua_paragraphs IS 'Summary Ukrainian structured by paragraphs: [{"index": 0, "text": "..."}, ...]';
COMMENT ON COLUMN public.chapters.summary_en_paragraphs IS 'Summary English structured by paragraphs: [{"index": 0, "text": "..."}, ...]';

-- Функція для міграції існуючих даних (опціонально)
-- Розкоментуйте та запустіть коли будете готові мігрувати існуючі дані
/*
CREATE OR REPLACE FUNCTION migrate_commentary_to_paragraphs()
RETURNS void AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE verses
  SET
    commentary_ua_paragraphs = (
      SELECT jsonb_agg(
        jsonb_build_object(
          'index', row_number - 1,
          'text', trim(paragraph)
        ) ORDER BY row_number
      )
      FROM (
        SELECT
          ROW_NUMBER() OVER() as row_number,
          unnest(string_to_array(commentary_ua, E'\n\n')) as paragraph
      ) p
      WHERE length(trim(paragraph)) > 0
    ),
    commentary_en_paragraphs = (
      SELECT jsonb_agg(
        jsonb_build_object(
          'index', row_number - 1,
          'text', trim(paragraph)
        ) ORDER BY row_number
      )
      FROM (
        SELECT
          ROW_NUMBER() OVER() as row_number,
          unnest(string_to_array(commentary_en, E'\n\n')) as paragraph
      ) p
      WHERE length(trim(paragraph)) > 0
    )
  WHERE commentary_ua IS NOT NULL OR commentary_en IS NOT NULL;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RAISE NOTICE 'Migration completed: % verses updated', updated_count;
END;
$$ LANGUAGE plpgsql;

-- Виконати міграцію (розкоментуйте коли буде готово)
-- SELECT migrate_commentary_to_paragraphs();
*/
