-- Add poetry mode support to blog_posts table
-- This allows blog posts to display structured verse content similar to VerseCard
-- with Sanskrit, transliteration, word-by-word translation, literary translation, and commentary

-- Add content mode field to switch between 'text' (default) and 'poetry' modes
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS content_mode TEXT DEFAULT 'text' CHECK (content_mode IN ('text', 'poetry'));

-- Add poetry-specific fields
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS sanskrit TEXT,
  ADD COLUMN IF NOT EXISTS transliteration TEXT,
  ADD COLUMN IF NOT EXISTS synonyms_ua TEXT,
  ADD COLUMN IF NOT EXISTS synonyms_en TEXT,
  ADD COLUMN IF NOT EXISTS poetry_translation_ua TEXT,
  ADD COLUMN IF NOT EXISTS poetry_translation_en TEXT;

-- Add audio URLs for each section in poetry mode
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS audio_sanskrit_url TEXT,
  ADD COLUMN IF NOT EXISTS audio_transliteration_url TEXT,
  ADD COLUMN IF NOT EXISTS audio_synonyms_ua_url TEXT,
  ADD COLUMN IF NOT EXISTS audio_synonyms_en_url TEXT,
  ADD COLUMN IF NOT EXISTS audio_poetry_translation_ua_url TEXT,
  ADD COLUMN IF NOT EXISTS audio_poetry_translation_en_url TEXT,
  ADD COLUMN IF NOT EXISTS audio_commentary_ua_url TEXT,
  ADD COLUMN IF NOT EXISTS audio_commentary_en_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.blog_posts.content_mode IS 'Display mode: "text" for regular blog post with rich HTML content, "poetry" for structured verse display';
COMMENT ON COLUMN public.blog_posts.sanskrit IS 'Sanskrit/Bengali original text in Devanagari/Bengali script (for poetry mode)';
COMMENT ON COLUMN public.blog_posts.transliteration IS 'Transliteration of the original text (for poetry mode)';
COMMENT ON COLUMN public.blog_posts.synonyms_ua IS 'Ukrainian word-by-word translation in format "word1 — meaning1; word2 — meaning2" (for poetry mode)';
COMMENT ON COLUMN public.blog_posts.synonyms_en IS 'English word-by-word translation in format "word1 — meaning1; word2 — meaning2" (for poetry mode)';
COMMENT ON COLUMN public.blog_posts.poetry_translation_ua IS 'Ukrainian literary translation of the verse (for poetry mode)';
COMMENT ON COLUMN public.blog_posts.poetry_translation_en IS 'English literary translation of the verse (for poetry mode)';
COMMENT ON COLUMN public.blog_posts.audio_sanskrit_url IS 'Audio URL for Sanskrit/original text section';
COMMENT ON COLUMN public.blog_posts.audio_transliteration_url IS 'Audio URL for transliteration section';
COMMENT ON COLUMN public.blog_posts.audio_synonyms_ua_url IS 'Audio URL for Ukrainian word-by-word translation';
COMMENT ON COLUMN public.blog_posts.audio_synonyms_en_url IS 'Audio URL for English word-by-word translation';
COMMENT ON COLUMN public.blog_posts.audio_poetry_translation_ua_url IS 'Audio URL for Ukrainian literary translation';
COMMENT ON COLUMN public.blog_posts.audio_poetry_translation_en_url IS 'Audio URL for English literary translation';
COMMENT ON COLUMN public.blog_posts.audio_commentary_ua_url IS 'Audio URL for Ukrainian commentary/purport (content_ua in poetry mode)';
COMMENT ON COLUMN public.blog_posts.audio_commentary_en_url IS 'Audio URL for English commentary/purport (content_en in poetry mode)';
