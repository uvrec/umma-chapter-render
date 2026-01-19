-- Create Padma Purana book entry
-- One of the 18 Mahapuranas, important source for Ekadashi glories

BEGIN;

-- ============================================
-- 1. CREATE BOOK ENTRY
-- ============================================

INSERT INTO books (slug, title_uk, title_en, description_uk, description_en)
VALUES (
  'pp',
  'Падма Пурана',
  'Padma Purana',
  E'Падма Пурана — одна з вісімнадцяти Магапуран, що складається з п''яти кганд (розділів): Сріші-кганда, Бгумі-кганда, Сварґа-кганда, Патала-кганда та Уттара-кганда.\n\nНазва походить від лотоса (падма), що виріс із пупка Господа Вішну. Ця Пурана особливо відома описами слави кожного з 26 екадаші, які знаходяться переважно в Уттара-кганді.\n\nПадма Пурана вважається саттвічною Пураною, тобто такою, що сприяє розвитку чеснот та духовному прогресу. Вона містить понад 55 000 шлок і охоплює теми космології, географії, родоводів царів, а також численні духовні настанови.',
  E'Padma Purana is one of the eighteen Mahapuranas, consisting of five khandas (sections): Srishti-khanda, Bhumi-khanda, Svarga-khanda, Patala-khanda, and Uttara-khanda.\n\nThe name derives from the lotus (padma) that grew from Lord Vishnu''s navel. This Purana is especially known for descriptions of the glories of each of the 26 Ekadashis, which are found mainly in the Uttara-khanda.\n\nPadma Purana is considered a Sattvic Purana, meaning it promotes virtues and spiritual progress. It contains over 55,000 shlokas and covers topics of cosmology, geography, genealogies of kings, as well as numerous spiritual instructions.'
)
ON CONFLICT (slug) DO UPDATE SET
  title_uk = EXCLUDED.title_uk,
  title_en = EXCLUDED.title_en,
  description_uk = EXCLUDED.description_uk,
  description_en = EXCLUDED.description_en;

-- ============================================
-- 2. ADD TO GV_BOOK_REFERENCES (if table exists)
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gv_book_references') THEN
    INSERT INTO gv_book_references (
      slug,
      title_sanskrit,
      title_transliteration,
      title_en,
      title_uk,
      author_id,
      category,
      subcategory,
      original_language,
      verse_count,
      importance_level,
      significance_en,
      significance_uk,
      internal_book_slug,
      is_available_in_app,
      display_order
    ) VALUES (
      'padma-purana',
      'पद्मपुराणम्',
      'Padma Purāṇam',
      'Padma Purana',
      'Падма Пурана',
      NULL, -- Vyasadeva (compiler)
      'purana',
      'maha-purana',
      'sanskrit',
      55000,
      4,
      'One of the 18 Mahapuranas, named after the lotus from Vishnu''s navel. Contains the glories of all 26 Ekadashis in the Uttara-khanda. A Sattvic Purana promoting devotion to Vishnu.',
      'Одна з 18 Магапуран, названа на честь лотоса з пупка Вішну. Містить славу всіх 26 екадаші в Уттара-кганді. Саттвічна Пурана, що сприяє відданості Вішну.',
      'pp',
      true,
      6  -- After other foundational scriptures
    )
    ON CONFLICT (slug) DO UPDATE SET
      internal_book_slug = EXCLUDED.internal_book_slug,
      is_available_in_app = EXCLUDED.is_available_in_app,
      updated_at = now();
  END IF;
END $$;

-- ============================================
-- 3. CREATE KHANDA (SECTIONS) AS CANTOS
-- ============================================

-- For multi-part books like Bhagavatam, we use 'cantos' table if it exists
-- For now, we'll create chapters directly for each khanda

-- Uttara-khanda chapters (ekadashi glorifications) will be added separately
-- when we import the actual content

COMMIT;
