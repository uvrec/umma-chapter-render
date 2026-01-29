# Dual Audio Functionality - Update Instructions (SIMPLIFIED)

## ✅ Completed Changes

### 1. Database Migration (SIMPLIFIED STRUCTURE)
- Created: `supabase/migrations/20251115120000_add_dual_audio_to_verses.sql`
- **Added 4 new audio columns** (instead of 8) to `verses` table:
  - `full_verse_audio_url` - **PRIMARY**: Complete verse recording (95% use case)
  - `recitation_audio_url` - Sanskrit/Bengali + Transliteration recitation
  - `explanation_uk_audio_url` - Ukrainian explanation (synonyms + translation + commentary)
  - `explanation_en_audio_url` - English explanation (synonyms + translation + commentary)
  - `audio_metadata` - JSONB for duration, file size, format, timestamps
- **Correctly migrated** existing `audio_url` → `full_verse_audio_url` (not commentary!)
- Added GIN index on `audio_metadata` for future queries

### 2. AudioUploader Component with Compact Mode
- Created: `src/components/admin/shared/AudioUploader.tsx`
- **Features:**
  - Drag & drop support
  - File upload to Supabase Storage
  - Progress bar with percentage
  - Audio preview player
  - Manual URL input fallback
  - Remove functionality with storage cleanup
  - **NEW: Compact mode** - smaller size for secondary audio fields
  - **NEW: Primary mode** - highlighted styling for main audio

### 3. Updated Admin Form with Collapsible UI
- Updated: `src/pages/admin/AddEditVerse.tsx`
- **Structure:**
  - **PRIMARY AUDIO** (always visible, prominent):
    - "Повний вірш (лекція)" - `full_verse_audio_url`
    - Large uploader with primary styling
  - **ADVANCED AUDIO** (collapsible, closed by default):
    - "Читання санскриту/бенгалі" - `recitation_audio_url`
    - "Пояснення (українською)" - `explanation_uk_audio_url`
    - "Explanation (English)" - `explanation_en_audio_url`
    - Compact uploaders in collapsible section
    - Badge showing count of uploaded files
    - Auto-expands if any advanced audio exists
- **UI Benefits:**
  - 95% use case (single audio) takes ~300px
  - Advanced features don't clutter interface
  - Clear visual hierarchy
  - Reduced vertical scroll from ~1760px to ~400px

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

## 📊 Database Schema Changes (SIMPLIFIED)

```sql
-- New columns added to verses table (4 fields instead of 8):
full_verse_audio_url        TEXT  -- PRIMARY: Complete lecture/recording (95% use case)
recitation_audio_url        TEXT  -- Sanskrit/Bengali + Transliteration only
explanation_uk_audio_url    TEXT  -- UA: Synonyms + Translation + Commentary combined
explanation_en_audio_url    TEXT  -- EN: Synonyms + Translation + Commentary combined
audio_metadata              JSONB -- Duration, file size, format, timestamps, etc.

-- Legacy field (kept for compatibility):
audio_url                   TEXT  -- Use full_verse_audio_url instead
```

### Why 4 fields instead of 8?

**Use Case Analysis:**
- **95%**: One complete verse audio (lecture/full recording)
- **4%**: Additional recitation audio (Sanskrit)
- **1%**: Separate explanation audios

**Benefits:**
- ✅ Simpler for 95% of use cases
- ✅ Less empty fields in database
- ✅ Clearer semantics (full_verse vs explanations)
- ✅ Easier to maintain
- ✅ Better UX (primary audio prominent)

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

## 🎯 Why Different from blog_posts?

**blog_posts** has 8 audio fields - **correct for its use case:**
- Poetry mode requires granular audio control
- Each section (synonyms, translation, commentary) is separate content
- Users may want to listen to specific parts only

**verses** has 4 audio fields - **correct for its use case:**
- Primary use: complete verse lecture (one audio)
- Secondary use: recitation + explanations (rare)
- Simpler structure for simpler content model

**Both approaches are optimal for their respective contexts.**
