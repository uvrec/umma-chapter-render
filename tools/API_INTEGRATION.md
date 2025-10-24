# API Integration Guide for WebImport.tsx

## Overview

The parsing backend has been updated to use Playwright with comprehensive normalization. The new API endpoint provides:
- ✅ Server-side parsing (Vedabase + Gitabase)
- ✅ English IAST → Ukrainian transliteration conversion
- ✅ Text normalization (mojibake, diacritics, word replacements)
- ✅ Progress tracking
- ✅ Error handling

## API Endpoint

**URL:** `http://localhost:5003/admin/parse-web-chapter`  
**Method:** POST  
**Content-Type:** `application/json`

### Request Format

```json
{
  "lila": 1,                    // 1=Adi, 2=Madhya, 3=Antya
  "chapter": 1,                 // Chapter number
  "verse_count": 110,           // Number of verses to parse
  "vedabase_base": "https://vedabase.io/en/library/cc/adi/1/1/",  // Optional
  "gitabase_base": "https://gitabase.com/ukr/CC/1/1"               // Optional
}
```

**Note:** If `vedabase_base` or `gitabase_base` are not provided, they will be auto-generated based on `lila` and `chapter`.

### Response Format

```json
{
  "verses": [
    {
      "lila_num": 1,
      "chapter": 1,
      "verse_number": "1",
      "sanskrit": "বন্দে গুরূনীশভক্তানীশমীশাবতারকান্‌ ।",
      "transliteration": "ванде ґурӯн īш́а-бгактāн īш́ам īш́а̄ватāракāн",
      "synonyms_en": "vande—I offer respectful obeisances...",
      "translation_en": "I offer my respectful obeisances...",
      "commentary_en": "According to the Gauḍīya Vaiṣṇava...",
      "synonyms_ua": "ванде — складаю шанобливі поклони...",
      "translation_ua": "Я складаю шанобливі поклони духовним вчителям...",
      "commentary_ua": "Згідно зі школою ґаудія-вайшнавізму...",
      "missing": [],
      "source": {
        "vedabase_url": "https://vedabase.io/en/library/cc/adi/1/1/",
        "gitabase_url": "https://gitabase.com/ukr/CC/1/1/1"
      }
    }
  ],
  "summary": {
    "total": 110,
    "vedabase_base": "https://vedabase.io/en/library/cc/adi/1/1/",
    "gitabase_base": "https://gitabase.com/ukr/CC/1/1"
  }
}
```

### Fields Explanation

- **sanskrit**: Bengali/Devanagari script (extracted from Vedabase)
- **transliteration**: Ukrainian transliteration with diacritics (converted from English IAST)
- **synonyms_en**: English word-for-word translation
- **translation_en**: English translation
- **commentary_en**: English commentary (Śrīla Prabhupāda's purport)
- **synonyms_ua**: Ukrainian word-for-word translation
- **translation_ua**: Ukrainian translation
- **commentary_ua**: Ukrainian commentary
- **missing**: Array of missing fields (e.g. `["sanskrit", "transliteration"]`)

## Frontend Integration Steps

### 1. Update WebImport.tsx

Replace the current `parseChapterFromWeb` call with an API request:

```typescript
// src/pages/admin/WebImport.tsx

const handleImport = async () => {
  setIsImporting(true);
  
  try {
    // Call backend API instead of client-side parsing
    const response = await fetch('http://localhost:5003/admin/parse-web-chapter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lila: parseInt(selectedCanto) || 1,
        chapter: parseInt(chapterNumber),
        verse_count: 110,  // or get from user input
        vedabase_base: vedabaseUrl,
        gitabase_base: gitabaseUrl,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // result.verses is ready for import
    const chapter = {
      chapter_number: parseInt(chapterNumber),
      title_ua: chapterTitleUa,
      title_en: chapterTitleEn,
      verses: result.verses,
    };
    
    // Import to database
    await importSingleChapter(selectedBook, selectedCanto, chapter);
    
    toast({
      title: "Успіх",
      description: `Імпортовано ${result.summary.total} віршів`,
    });
    
  } catch (error) {
    console.error('Import failed:', error);
    toast({
      title: "Помилка",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setIsImporting(false);
  }
};
```

### 2. Add Progress Tracking (Optional)

Since parsing can take 30-60 seconds for a full chapter, consider:

**Option A: Simple loading state**
```tsx
{isImporting && (
  <div className="flex items-center gap-2">
    <Loader2 className="h-4 w-4 animate-spin" />
    <p>Парсинг віршів з Vedabase та Gitabase...</p>
  </div>
)}
```

**Option B: WebSocket progress (future enhancement)**
- Server emits progress events
- Client updates progress bar in real-time

### 3. Update importer.ts

The `importSingleChapter` function should accept the new verse format:

```typescript
// src/utils/import/importer.ts

export async function importSingleChapter(
  bookId: string,
  cantoId: string | null,
  chapter: {
    chapter_number: number;
    title_ua: string;
    title_en: string;
    verses: Array<{
      verse_number: string;
      sanskrit: string;
      transliteration: string;
      synonyms_ua: string;
      translation_ua: string;
      commentary_ua: string;
      // ... other fields
    }>;
  }
) {
  // Insert chapter
  const { data: chapterData, error: chapterError } = await supabase
    .from('chapters')
    .insert({
      book_id: bookId,
      canto_id: cantoId,
      chapter_number: chapter.chapter_number,
      title_ua: chapter.title_ua,
      title_en: chapter.title_en,
    })
    .select()
    .single();
  
  if (chapterError) throw chapterError;
  
  // Insert verses
  const versesToInsert = chapter.verses.map(v => ({
    chapter_id: chapterData.id,
    verse_number: parseInt(v.verse_number),
    sanskrit: v.sanskrit,
    transliteration: v.transliteration,
    synonyms_ua: v.synonyms_ua,
    translation_ua: v.translation_ua,
    commentary_ua: v.commentary_ua,
    // ... other fields
  }));
  
  const { error: versesError } = await supabase
    .from('verses')
    .insert(versesToInsert);
  
  if (versesError) throw versesError;
}
```

## Testing

### 1. Start the server
```bash
cd "/Users/mymac/Downloads/VedaVOICE/VedaVOICE code/umma-chapter-render/umma-chapter-render"
python3 tools/parse_server.py
```

### 2. Test with curl
```bash
curl -X POST http://localhost:5003/admin/parse-web-chapter \
  -H 'Content-Type: application/json' \
  -d '{"lila":1,"chapter":1,"verse_count":3}' | jq '.summary'
```

Expected output:
```json
{
  "total": 3,
  "vedabase_base": "https://vedabase.io/en/library/cc/adi/1/1/",
  "gitabase_base": "https://gitabase.com/ukr/CC/1/1"
}
```

### 3. Test from frontend
1. Open Admin → Web Import
2. Select book, canto, chapter
3. Enter URLs
4. Click "Імпортувати"
5. Check browser console for API responses

## Performance

- **3 verses**: ~30 seconds
- **19 verses**: ~2-3 minutes
- **110 verses** (full chapter): ~10-15 minutes

This is due to:
- Playwright headless browser initialization
- JavaScript rendering wait time per verse
- Network latency (Vedabase + Gitabase)

**Optimization ideas:**
- Add caching for parsed chapters
- Batch verse fetching
- Use async/await with Promise.all() for parallel fetching

## Error Handling

The API returns errors in this format:

```json
{
  "error": "parser_failed",
  "detail": "Invalid URL: ...",
  "trace": "Traceback (most recent call last):\n..."
}
```

Handle in frontend:
```typescript
if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.detail || errorData.error);
}
```

## Normalization Features

The parser applies these transformations automatically:

1. **Transliteration conversion**: English IAST → Ukrainian
   - `vande gurūn` → `ванде ґурӯн`
   - `īśa-bhaktān` → `īш́а-бгактāн`

2. **Mojibake fixes**: Windows-1252 → UTF-8
3. **Diacritic normalization**: Ensures proper combining marks
4. **Word replacements**: Applies approved forms from TRANSLITERATION_RULES.md

All normalized data is ready for direct import to database.

## Next Steps

1. ✅ Update `WebImport.tsx` to call new API
2. ✅ Test with 3-5 verses
3. ✅ Import full chapter (110 verses)
4. ✅ Add progress indicator
5. ⚠️ Consider adding server-side caching for parsed chapters

---

**Last updated:** October 14, 2025  
**Server:** `tools/parse_server.py` (port 5003)  
**Parser:** `tools/playwright_parser.py` with `pre_import_normalizer.py`
