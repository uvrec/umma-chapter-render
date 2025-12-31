-- ============================================
-- Add English titles to intro_chapters for Bhagavad-gita
-- Content (content_en) will be added manually later
-- ============================================

-- Update English titles for all Gita intro chapters
UPDATE intro_chapters
SET title_en = CASE slug
    WHEN 'dedication' THEN 'Dedication'
    WHEN 'preface' THEN 'Preface'
    WHEN 'foreword' THEN 'Foreword'
    WHEN 'introduction' THEN 'Introduction'
    WHEN 'about-author' THEN 'About the Author'
    WHEN 'disciplic-succession' THEN 'Disciplic Succession'
    WHEN 'pronunciation' THEN 'A Note on Transliteration and Pronunciation'
    WHEN 'reviews' THEN 'Reviews'
    WHEN 'references' THEN 'References'
    WHEN 'note' THEN 'Note'
    WHEN 'books' THEN 'Books by His Divine Grace'
    ELSE title_en
END,
updated_at = now()
WHERE book_id = (SELECT id FROM books WHERE slug = 'gita')
  AND title_en IS DISTINCT FROM CASE slug
    WHEN 'dedication' THEN 'Dedication'
    WHEN 'preface' THEN 'Preface'
    WHEN 'foreword' THEN 'Foreword'
    WHEN 'introduction' THEN 'Introduction'
    WHEN 'about-author' THEN 'About the Author'
    WHEN 'disciplic-succession' THEN 'Disciplic Succession'
    WHEN 'pronunciation' THEN 'A Note on Transliteration and Pronunciation'
    WHEN 'reviews' THEN 'Reviews'
    WHEN 'references' THEN 'References'
    WHEN 'note' THEN 'Note'
    WHEN 'books' THEN 'Books by His Divine Grace'
    ELSE title_en
END;
