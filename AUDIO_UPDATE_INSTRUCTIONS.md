# Dual Audio Functionality - Update Instructions

## ✅ Completed Changes

### 1. Database Migration
- Created: `supabase/migrations/20251115120000_add_dual_audio_to_verses.sql`
- Added 8 new audio columns to `verses` table:
  - `audio_sanskrit_url`
  - `audio_transliteration_url`
  - `audio_synonyms_ua_url`
  - `audio_synonyms_en_url`
  - `audio_translation_ua_url`
  - `audio_translation_en_url`
  - `audio_commentary_ua_url`
  - `audio_commentary_en_url`
  - `audio_metadata` (JSONB)
- Migrated existing `audio_url` data to `audio_commentary_ua_url`

### 2. New Component
- Created: `src/components/admin/shared/AudioUploader.tsx`
- Features:
  - Drag & drop support
  - File upload to Supabase Storage
  - Progress bar
  - Audio preview
  - Manual URL input fallback
  - Remove functionality

### 3. Updated Admin Form
- Updated: `src/pages/admin/AddEditVerse.tsx`
- Added 8 AudioUploader components
- Organized by language (UA/EN) and section
- Kept legacy `audio_url` field for backward compatibility

## 🚀 Deployment Steps

### 1. Apply Migration
```bash
# Push migration to Supabase
supabase db push

# OR if using Supabase Dashboard:
# Copy content of 20251115120000_add_dual_audio_to_verses.sql
# Run in SQL Editor
```

### 2. Regenerate TypeScript Types
```bash
# Generate new types after migration
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts

# OR
npx supabase gen types typescript --linked > src/integrations/supabase/types.ts
```

### 3. Verify Storage Bucket
Ensure `verse-audio` bucket exists with proper permissions:
```sql
-- Check if bucket exists
SELECT * FROM storage.buckets WHERE name = 'verse-audio';

-- If not, create it in Supabase Dashboard:
-- Storage > New Bucket > verse-audio (public)
```

### 4. Test the Feature
1. Navigate to `/admin/verses/new`
2. Fill in verse details
3. Upload audio files for different sections
4. Save and verify URLs are stored correctly
5. Check frontend components use new audio fields

## 📊 Database Schema Changes

```sql
-- New columns added to verses table:
audio_sanskrit_url          TEXT
audio_transliteration_url   TEXT
audio_synonyms_ua_url       TEXT
audio_synonyms_en_url       TEXT
audio_translation_ua_url    TEXT
audio_translation_en_url    TEXT
audio_commentary_ua_url     TEXT
audio_commentary_en_url     TEXT
audio_metadata              JSONB

-- Legacy field (kept for compatibility):
audio_url                   TEXT
```

## 🔄 Frontend Components to Update (Optional)

These components already support dual audio props but may need data mapping:

1. `src/components/VerseCard.tsx`
   - Already has props: `audioSanskrit`, `audioSynonyms`, etc.
   - Update data fetching to pass new fields

2. `src/components/DualLanguageVerseCard.tsx`
   - Already supports: `audioSanskrit`, `audioSynonymsUa/En`, etc.
   - Update parent components to pass new data

3. `src/components/IndividualVerse.tsx`
   - Update to fetch and pass new audio fields

## 🐛 Troubleshooting

### Types not updating
```bash
# Restart TS server in VSCode
Cmd/Ctrl + Shift + P > TypeScript: Restart TS Server
```

### Upload fails
- Check Storage bucket permissions
- Verify bucket name is `verse-audio`
- Check file size limits (default: 50MB)

### Audio doesn't play
- Verify URLs are publicly accessible
- Check CORS settings in Supabase Storage
- Test URLs directly in browser

## ✨ Features

### Admin Panel
- ✅ Drag & drop audio upload
- ✅ Progress indicator
- ✅ Audio preview before saving
- ✅ Manual URL input option
- ✅ Organized by language and section
- ✅ Remove uploaded files

### Storage
- ✅ Automatic UUID filenames
- ✅ Stored in `verse-audio` bucket
- ✅ Public URLs generated
- ✅ Supports: MP3, M4A, WAV, OGG, FLAC

### Backward Compatibility
- ✅ Legacy `audio_url` field preserved
- ✅ Existing data migrated automatically
- ✅ No breaking changes to existing code

## 📝 Next Steps

1. Apply migration to production
2. Regenerate TypeScript types
3. Test audio upload in admin panel
4. Update frontend components to use new fields
5. Consider adding audio metadata extraction (duration, file size)

## 🎯 Consistency with blog_posts

The `verses` table now matches `blog_posts` structure:
- Both have 8 separate audio fields
- Same naming convention
- Same data types
- Consistent user experience across admin forms
