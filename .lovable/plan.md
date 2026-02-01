# Preview Tokens Support — COMPLETED

## Status: ✅ DONE

Preview token support has been added to `VedaReaderDB.tsx`. All direct table queries have been replaced with RPC functions that support preview tokens.

## Changes Made

| Query | Before | After |
|-------|--------|-------|
| Book | `supabase.from("books")` | `get_book_with_preview` |
| Canto | `supabase.from("cantos")` | `get_canto_by_number_with_preview` |
| Chapter | `supabase.from("chapters")` | `get_chapter_by_number_with_preview` |
| Verses | `supabase.from("verses")` | `get_verses_by_chapter_with_preview` |
| All Chapters | `supabase.from("chapters")` | `get_chapters_by_canto_with_preview` |

## Implementation Details

1. Added `useSearchParams` import and `previewToken` extraction from URL
2. All queries now include `previewToken` in their queryKey for proper cache invalidation
3. Each query uses RPC functions with fallback to direct queries for published content
4. Error handling logs RPC errors and gracefully falls back to standard queries

## Testing

To test:
1. Create a preview token for an unpublished chapter
2. Open URL: `/uk/lib/{book}/{chapter}/{verse}?preview={token}`
3. Verify verses are displayed
4. Verify navigation between verses works
5. Verify that without token the page shows "not found"

## Note on verse_lyrics

The RPC function `get_verses_by_chapter_with_preview` returns verse data without `verse_lyrics` JOIN. For unpublished verses, audio sync may not work. The fallback to direct queries for published verses includes `verse_lyrics`.
