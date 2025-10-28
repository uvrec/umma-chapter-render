-- Виправлення book_id для глав з правильним canto_id але book_id=NULL
DO $$
DECLARE
  v_book_id uuid;
BEGIN
  -- Знаходимо книгу scc
  SELECT id INTO v_book_id FROM books WHERE slug = 'scc';
  
  IF v_book_id IS NOT NULL THEN
    -- Оновлюємо book_id для всіх глав які мають canto_id від scc але book_id=NULL
    UPDATE chapters c
    SET book_id = v_book_id
    FROM cantos cn
    WHERE c.canto_id = cn.id
      AND cn.book_id = v_book_id
      AND c.book_id IS NULL;
    
    RAISE NOTICE 'Оновлено book_id для глав scc';
    
    -- Тепер видаляємо дублікати (глави з canto_id=NULL якщо є аналог з canto_id)
    DELETE FROM chapters c1
    WHERE c1.book_id = v_book_id
      AND c1.canto_id IS NULL
      AND EXISTS (
        SELECT 1 FROM chapters c2
        JOIN cantos cn ON c2.canto_id = cn.id
        WHERE c2.book_id = v_book_id
          AND c2.chapter_number = c1.chapter_number
          AND cn.book_id = v_book_id
      );
    
    RAISE NOTICE 'Видалено дублікати глав';
  END IF;
END $$;