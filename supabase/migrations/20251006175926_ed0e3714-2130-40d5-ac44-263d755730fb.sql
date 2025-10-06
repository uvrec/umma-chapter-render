-- Add unique index for verses to enable upsert on conflict
create unique index if not exists verses_chapter_verse_unique 
on public.verses (chapter_id, verse_number);

-- Add unique index for chapters in books without cantos
create unique index if not exists chapters_book_chapter_unique 
on public.chapters (book_id, chapter_number) 
where canto_id is null;

-- Add unique index for chapters in books with cantos
create unique index if not exists chapters_canto_chapter_unique 
on public.chapters (canto_id, chapter_number) 
where book_id is null;