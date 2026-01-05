-- =============================================================================
-- Vaniquotes Tables - Тематичні цитати Шріли Прабгупади
-- =============================================================================
--
-- Структура для зберігання цитат з Vaniquotes.org, організованих по категоріях
-- =============================================================================

-- 1. Категорії цитат (теми)
CREATE TABLE IF NOT EXISTS quote_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    title_ua TEXT,
    description TEXT,
    description_ua TEXT,
    parent_id UUID REFERENCES quote_categories(id) ON DELETE SET NULL,
    vaniquotes_url TEXT, -- Оригінальне посилання на Vaniquotes
    quotes_count INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Сторінки цитат (групи цитат по темі)
CREATE TABLE IF NOT EXISTS quote_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    title_ua TEXT,
    vaniquotes_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Зв'язок сторінок з категоріями (M:N)
CREATE TABLE IF NOT EXISTS quote_page_categories (
    quote_page_id UUID REFERENCES quote_pages(id) ON DELETE CASCADE,
    category_id UUID REFERENCES quote_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (quote_page_id, category_id)
);

-- 4. Окремі цитати
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_page_id UUID REFERENCES quote_pages(id) ON DELETE CASCADE,

    -- Текст цитати
    text_en TEXT NOT NULL,
    text_ua TEXT,
    text_html TEXT, -- Оригінальний HTML з форматуванням

    -- Джерело
    source_type TEXT CHECK (source_type IN ('book', 'lecture', 'conversation', 'letter', 'unknown')),
    source_reference TEXT, -- Наприклад: "BG 2.14 Purport"

    -- Зв'язок з книгами
    book_slug TEXT,
    canto_number INTEGER,
    chapter_number INTEGER,
    verse_number TEXT,
    verse_id UUID REFERENCES verses(id) ON DELETE SET NULL,

    -- Зв'язок з лекціями
    lecture_id UUID REFERENCES lectures(id) ON DELETE SET NULL,

    -- Метадані
    date DATE,
    location TEXT,

    -- Full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(text_en, '')), 'A') ||
        setweight(to_tsvector('simple', coalesce(text_ua, '')), 'B')
    ) STORED,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Індекси
CREATE INDEX IF NOT EXISTS idx_quotes_quote_page_id ON quotes(quote_page_id);
CREATE INDEX IF NOT EXISTS idx_quotes_source_type ON quotes(source_type);
CREATE INDEX IF NOT EXISTS idx_quotes_book_slug ON quotes(book_slug);
CREATE INDEX IF NOT EXISTS idx_quotes_verse_id ON quotes(verse_id);
CREATE INDEX IF NOT EXISTS idx_quotes_lecture_id ON quotes(lecture_id);
CREATE INDEX IF NOT EXISTS idx_quotes_search_vector ON quotes USING gin(search_vector);

CREATE INDEX IF NOT EXISTS idx_quote_categories_parent_id ON quote_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_quote_categories_slug ON quote_categories(slug);

-- RLS Policies
ALTER TABLE quote_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_page_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Read access for everyone
CREATE POLICY "Anyone can read quote_categories"
    ON quote_categories FOR SELECT USING (true);

CREATE POLICY "Anyone can read quote_pages"
    ON quote_pages FOR SELECT USING (true);

CREATE POLICY "Anyone can read quote_page_categories"
    ON quote_page_categories FOR SELECT USING (true);

CREATE POLICY "Anyone can read quotes"
    ON quotes FOR SELECT USING (true);

-- =============================================================================
-- Функції
-- =============================================================================

-- Функція пошуку цитат
CREATE OR REPLACE FUNCTION search_quotes(
    p_query TEXT,
    p_category_slug TEXT DEFAULT NULL,
    p_source_type TEXT DEFAULT NULL,
    p_book_slug TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    text_en TEXT,
    text_ua TEXT,
    source_type TEXT,
    source_reference TEXT,
    book_slug TEXT,
    chapter_number INTEGER,
    verse_number TEXT,
    page_title TEXT,
    categories TEXT[],
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        q.id,
        q.text_en,
        q.text_ua,
        q.source_type,
        q.source_reference,
        q.book_slug,
        q.chapter_number,
        q.verse_number,
        qp.title AS page_title,
        ARRAY(
            SELECT qc.title
            FROM quote_page_categories qpc
            JOIN quote_categories qc ON qc.id = qpc.category_id
            WHERE qpc.quote_page_id = q.quote_page_id
        ) AS categories,
        ts_rank(q.search_vector, websearch_to_tsquery('english', p_query)) AS rank
    FROM quotes q
    LEFT JOIN quote_pages qp ON qp.id = q.quote_page_id
    WHERE
        (p_query IS NULL OR q.search_vector @@ websearch_to_tsquery('english', p_query))
        AND (p_source_type IS NULL OR q.source_type = p_source_type)
        AND (p_book_slug IS NULL OR q.book_slug = p_book_slug)
        AND (
            p_category_slug IS NULL
            OR EXISTS (
                SELECT 1 FROM quote_page_categories qpc
                JOIN quote_categories qc ON qc.id = qpc.category_id
                WHERE qpc.quote_page_id = q.quote_page_id
                AND qc.slug = p_category_slug
            )
        )
    ORDER BY rank DESC, q.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- Функція отримання цитат для конкретного вірша
CREATE OR REPLACE FUNCTION get_verse_quotes(
    p_book_slug TEXT,
    p_canto_number INTEGER,
    p_chapter_number INTEGER,
    p_verse_number TEXT
)
RETURNS TABLE (
    id UUID,
    text_en TEXT,
    text_ua TEXT,
    source_type TEXT,
    source_reference TEXT,
    page_title TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        q.id,
        q.text_en,
        q.text_ua,
        q.source_type,
        q.source_reference,
        qp.title AS page_title
    FROM quotes q
    LEFT JOIN quote_pages qp ON qp.id = q.quote_page_id
    WHERE
        q.book_slug = p_book_slug
        AND (p_canto_number IS NULL OR q.canto_number = p_canto_number)
        AND q.chapter_number = p_chapter_number
        AND q.verse_number = p_verse_number
    ORDER BY q.created_at;
END;
$$ LANGUAGE plpgsql STABLE;

-- Функція для отримання популярних категорій
CREATE OR REPLACE FUNCTION get_featured_quote_categories(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    slug TEXT,
    title TEXT,
    title_ua TEXT,
    quotes_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        qc.id,
        qc.slug,
        qc.title,
        qc.title_ua,
        qc.quotes_count
    FROM quote_categories qc
    WHERE qc.is_featured = TRUE OR qc.quotes_count > 0
    ORDER BY qc.is_featured DESC, qc.quotes_count DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Тригер для оновлення updated_at
CREATE OR REPLACE FUNCTION update_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_quotes_updated_at();

CREATE TRIGGER trigger_quote_pages_updated_at
    BEFORE UPDATE ON quote_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_quotes_updated_at();

CREATE TRIGGER trigger_quote_categories_updated_at
    BEFORE UPDATE ON quote_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_quotes_updated_at();

-- =============================================================================
-- Коментарі
-- =============================================================================

COMMENT ON TABLE quote_categories IS 'Категорії/теми цитат з Vaniquotes.org';
COMMENT ON TABLE quote_pages IS 'Сторінки з групами цитат на одну тему';
COMMENT ON TABLE quotes IS 'Окремі цитати Шріли Прабгупади';
COMMENT ON FUNCTION search_quotes IS 'Повнотекстовий пошук по цитатах';
COMMENT ON FUNCTION get_verse_quotes IS 'Отримати цитати для конкретного вірша';
