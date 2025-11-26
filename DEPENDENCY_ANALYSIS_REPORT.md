# Comprehensive Dependency Analysis Report

**Repository**: umma-chapter-render
**Analysis Date**: 2025-11-26
**Branch**: claude/analyze-dependencies-018fGTmFbbh1gPEbY27BiNzu
**Total Files**: 489+

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [External Dependencies](#external-dependencies)
3. [Internal Dependencies](#internal-dependencies)
4. [Database Dependencies](#database-dependencies)
5. [Dependency Graph](#dependency-graph)
6. [Critical Paths](#critical-paths)
7. [Recommendations](#recommendations)

---

## Executive Summary

This repository is a **Vedic scripture learning platform** built with:
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Content**: Bhagavad-gita, Srimad-bhagavatam, lectures, letters
- **Tools**: Python scripts for content import/parsing

### Key Metrics

| Category | Count |
|----------|-------|
| TypeScript/React files (.tsx) | 193 |
| TypeScript files (.ts) | 75 |
| SQL migrations | 64 |
| Python scripts | 24 |
| NPM dependencies | 60+ |
| Database tables | 25+ |

---

## External Dependencies

### 1. NPM Package Dependencies (package.json)

#### Core Framework
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.1 | UI framework |
| react-dom | ^18.3.1 | React DOM rendering |
| react-router-dom | ^6.30.1 | Client-side routing |
| typescript | ^5.8.3 | Type system |
| vite | ^5.4.19 | Build tool |

#### UI Library (shadcn/ui based on Radix)
| Package | Purpose |
|---------|---------|
| @radix-ui/react-accordion | Collapsible content |
| @radix-ui/react-alert-dialog | Alert dialogs |
| @radix-ui/react-dialog | Modal dialogs |
| @radix-ui/react-dropdown-menu | Dropdown menus |
| @radix-ui/react-popover | Popovers |
| @radix-ui/react-select | Select inputs |
| @radix-ui/react-tabs | Tab navigation |
| @radix-ui/react-tooltip | Tooltips |
| + 15 more Radix components | Various UI elements |

#### State Management
| Package | Version | Purpose |
|---------|---------|---------|
| @tanstack/react-query | ^5.83.0 | Server state management |
| react-hook-form | ^7.61.1 | Form state management |
| @hookform/resolvers | ^3.10.0 | Form validation resolvers |
| zod | ^3.25.76 | Schema validation |

#### Backend Integration
| Package | Version | Purpose |
|---------|---------|---------|
| @supabase/supabase-js | ^2.57.4 | Supabase client SDK |

#### Rich Text Editing (TipTap)
| Package | Purpose |
|---------|---------|
| @tiptap/react | React integration |
| @tiptap/starter-kit | Basic editor features |
| @tiptap/extension-color | Text coloring |
| @tiptap/extension-highlight | Text highlighting |
| @tiptap/extension-image | Image embedding |
| @tiptap/extension-link | Link handling |
| @tiptap/extension-table | Table editing |
| @tiptap/extension-youtube | YouTube embeds |
| + 8 more TipTap extensions | Extended functionality |

#### Document Processing
| Package | Version | Purpose |
|---------|---------|---------|
| pdfjs-dist | ^5.4.149 | PDF viewing |
| jspdf | ^3.0.3 | PDF generation |
| jspdf-autotable | ^5.0.2 | PDF table generation |
| epubjs | ^0.3.93 | EPUB reading |
| mammoth | ^1.11.0 | DOCX parsing |
| jszip | ^3.10.1 | ZIP file handling |
| marked | ^16.3.0 | Markdown parsing |
| dompurify | ^3.2.7 | HTML sanitization |

#### Sanskrit/Transliteration
| Package | Version | Purpose |
|---------|---------|---------|
| sanscript | ^0.0.2 | Sanskrit script conversion |

#### UI Enhancements
| Package | Version | Purpose |
|---------|---------|---------|
| lucide-react | ^0.462.0 | Icon library |
| recharts | ^2.15.4 | Charts |
| sonner | ^1.7.4 | Toast notifications |
| embla-carousel-react | ^8.6.0 | Carousel |
| vaul | ^0.9.9 | Drawer component |
| cmdk | ^1.1.1 | Command palette |
| react-day-picker | ^8.10.1 | Date picker |
| input-otp | ^1.4.2 | OTP input |
| react-resizable-panels | ^2.1.9 | Resizable panels |

#### Styling
| Package | Version | Purpose |
|---------|---------|---------|
| tailwindcss | ^3.4.17 | Utility CSS framework |
| tailwind-merge | ^2.6.0 | Class merging |
| tailwindcss-animate | ^1.0.7 | Animation utilities |
| class-variance-authority | ^0.7.1 | Variant styling |
| clsx | ^2.1.1 | Class name utility |
| autoprefixer | ^10.4.21 | CSS prefixing |
| postcss | ^8.5.6 | CSS processing |

#### Utilities
| Package | Version | Purpose |
|---------|---------|---------|
| date-fns | ^3.6.0 | Date utilities |
| next-themes | ^0.4.6 | Theme management |
| react-helmet-async | ^2.0.5 | Head management |
| react-error-boundary | ^6.0.0 | Error boundaries |

#### Development Dependencies
| Package | Purpose |
|---------|---------|
| @vitejs/plugin-react-swc | Fast React refresh |
| @tailwindcss/typography | Typography plugin |
| eslint | Linting |
| typescript-eslint | TypeScript linting |
| lovable-tagger | Lovable AI integration |

### 2. Python Dependencies (tools/requirements.txt)

| Package | Version | Purpose |
|---------|---------|---------|
| flask | >=2.3.0 | Parser API server |
| flask-cors | >=4.0.0 | CORS handling |
| playwright | >=1.40.0 | Browser automation |
| beautifulsoup4 | >=4.12.0 | HTML parsing |

Additional Python packages used (from imports in scripts):
- `ebooklib` - EPUB processing
- `requests` - HTTP client
- `supabase` - Supabase client
- `dataclasses` - Data structures
- `argparse` - CLI arguments
- `json`, `re`, `os`, `sys` - Standard library

---

## Internal Dependencies

### 1. Entry Point Chain

```
index.html
    └── src/main.tsx
            ├── react-dom/client (createRoot)
            ├── react-helmet-async (HelmetProvider)
            ├── src/App.tsx
            │       ├── @/components/ui/toaster
            │       ├── @/components/ui/sonner
            │       ├── @/components/ui/tooltip
            │       ├── @tanstack/react-query (QueryClientProvider)
            │       ├── react-router-dom (BrowserRouter, Routes, Route)
            │       ├── @/lib/queryClient
            │       ├── @/components/ErrorBoundary
            │       ├── @/components/ThemeProvider
            │       ├── @/contexts/LanguageContext
            │       ├── @/contexts/AuthContext
            │       ├── @/contexts/ModernAudioContext
            │       └── 70+ page components
            └── src/index.css
```

### 2. Context Provider Dependencies

#### AuthContext (`src/contexts/AuthContext.tsx`)
```
Imports:
  ├── react (createContext, useContext, useState, useEffect)
  ├── @supabase/supabase-js (User, Session types)
  └── @/integrations/supabase/client (supabase)

Provides:
  ├── user: User | null
  ├── session: Session | null
  ├── isAdmin: boolean
  ├── loading: boolean
  ├── signUp, signIn, signOut functions

Used by: Most authenticated components
```

#### LanguageContext (`src/contexts/LanguageContext.tsx`)
```
Imports:
  └── react (createContext, useContext, useState, useEffect)

Provides:
  ├── language: 'ua' | 'en'
  ├── setLanguage: function
  └── t: (ua, en) => string (translation helper)

Used by: All components with multilingual content
```

#### ModernAudioContext (`src/contexts/ModernAudioContext.tsx`)
```
Imports:
  ├── react (createContext, useContext, useState, useRef, useEffect, useCallback)
  └── @/integrations/supabase/client (supabase)

Provides:
  ├── playlist, currentTrack, currentIndex
  ├── isPlaying, currentTime, duration, buffered
  ├── volume, isMuted, repeatMode, isShuffled
  ├── playTrack, playPlaylist, togglePlay, seek
  └── 20+ audio control methods

Used by: Audio player components, audiobook views
```

### 3. Parser Dependencies

```
vedabaseParser.ts
    └── textNormalizer.ts
            └── sanscript (external)

gitabaseParser.ts
    └── textNormalizer.ts
            └── sanscript (external)

noiParser.ts
    └── textNormalizer.ts
            └── sanscript (external)

dualSourceParser.ts
    └── textNormalizer.ts
            └── sanscript (external)

highlightSanskritTerms.ts
    └── glossaryParser.ts (normalizeSanskritText)
```

**Critical Observation**: `textNormalizer.ts` is the central hub for all text processing. It depends on the `sanscript` external package for Sanskrit-to-IAST conversion.

### 4. Hooks Dependencies

| Hook | Dependencies |
|------|--------------|
| `useAuth` | AuthContext |
| `useLanguage` | LanguageContext |
| `useAudio` | ModernAudioContext |
| `useSanskritLexicon` | supabase, @tanstack/react-query |
| `useHighlights` | supabase, @tanstack/react-query, sonner |
| `useDailyQuote` | supabase, @tanstack/react-query, LanguageContext |
| `useReaderSettings` | localStorage, @/constants/typography |
| `useParserHealth` | fetch API, environment variables |
| `useBlogPostView` | supabase, @tanstack/react-query |
| `useDebounce` | react (useState, useEffect) |
| `useKeyboardShortcuts` | react (useEffect, useCallback) |
| `useSanskritTerms` | supabase, @tanstack/react-query |
| `useStaticPageMeta` | supabase, @tanstack/react-query |

### 5. UI Component Dependencies (shadcn/ui)

All 48 UI components in `src/components/ui/` follow this pattern:
```
component.tsx
    ├── react (forwardRef, etc.)
    ├── @radix-ui/react-* (corresponding Radix primitive)
    ├── @/lib/utils (cn utility function)
    └── class-variance-authority (for variants)
```

### 6. Page Component Dependencies

Most page components follow this pattern:
```
Page.tsx
    ├── react (useState, useEffect)
    ├── @/contexts/* (Auth, Language, Audio)
    ├── @/hooks/* (custom hooks)
    ├── @/components/ui/* (UI components)
    ├── @/components/* (custom components)
    ├── @/integrations/supabase/client
    ├── @tanstack/react-query
    └── react-router-dom (useParams, useNavigate)
```

---

## Database Dependencies

### 1. Supabase Integration

**Client Configuration** (`src/integrations/supabase/client.ts`):
- URL: `https://qeplxgqadcbwlrbgydlb.supabase.co`
- Uses auto-generated types from `types.ts`
- Auth with localStorage persistence

### 2. Database Tables (25+ tables)

#### Core Content Tables
| Table | Purpose | Relationships |
|-------|---------|---------------|
| `books` | Book metadata | → cantos, chapters, intro_chapters, book_pages |
| `cantos` | Canto metadata | → books, chapters |
| `chapters` | Chapter content | → cantos, verses |
| `verses` | Verse content | → chapters, daily_quotes, highlights |
| `intro_chapters` | Introductory chapters | → books |
| `book_pages` | Book pages | → books, cantos |

#### Content Types Tables
| Table | Purpose |
|-------|---------|
| `lectures` | Lecture transcripts |
| `lecture_paragraphs` | Paragraph content with audio timecodes |
| `letters` | Letter content |

#### Blog System Tables
| Table | Purpose | Relationships |
|-------|---------|---------------|
| `blog_posts` | Blog articles | → blog_categories |
| `blog_categories` | Post categories | ← blog_posts |
| `blog_tags` | Post tags | ← blog_post_tags |
| `blog_post_tags` | Tag associations | → blog_posts, blog_tags |

#### Audio System Tables
| Table | Purpose | Relationships |
|-------|---------|---------------|
| `audio_categories` | Audio categories | → audio_playlists |
| `audio_playlists` | Audio playlists | → audio_tracks |
| `audio_tracks` | Audio files | → audio_playlists, audio_events |
| `audio_events` | Play analytics | → audio_tracks |

#### User & Settings Tables
| Table | Purpose |
|-------|---------|
| `profiles` | User profiles |
| `user_roles` | Role assignments (admin, editor, user) |
| `highlights` | User text highlights |
| `pages` | CMS pages |
| `static_page_metadata` | Page SEO data |
| `site_settings` | Global settings |
| `daily_quotes` | Daily quotes |
| `sanskrit_lexicon` | Sanskrit dictionary |

### 3. Database Views

| View | Purpose |
|------|---------|
| `audio_track_daily_stats` | Audio analytics |
| `blog_posts_public` | Published posts |
| `books_with_mapping` | Books with counts |
| `book_pages_with_metadata` | Pages with book info |
| `mv_blog_recent_published` | Recent blog posts |
| `readable_chapters` | Chapters with stats |
| `verses_with_metadata` | Verses with book info |
| `verses_with_structure` | Verses with content flags |

### 4. Database Functions

| Function | Purpose |
|----------|---------|
| `create_blog_post` | Create blog post with author |
| `get_book_by_vedabase_slug` | Find book by external slug |
| `get_book_pages` | Get paginated book pages |
| `get_chapter_verses` | Get verses for chapter |
| `search_verses_fulltext` | Full-text verse search |
| `search_sanskrit_lexicon` | Sanskrit word search |
| `search_sanskrit_by_meaning` | Search by English meaning |
| `normalize_sanskrit_word` | Normalize for search |
| `has_role` | Check user role |
| `increment_blog_post_views` | Track post views |
| `is_chapter_readable` | Check if chapter has content |
| `parse_verse_number` | Parse verse number format |
| `get_topic_statistics` | Topic analysis |

### 5. Database Enums

| Enum | Values |
|------|--------|
| `app_role` | admin, editor, user |
| `audio_event_type` | play, pause, complete, skip |
| `chapter_type` | verses, text |
| `daily_quote_type` | verse, custom |
| `lecture_type` | Conversation, Walk, Morning Walk, Lecture, Bhagavad-gita, Srimad-Bhagavatam, Nectar of Devotion, Sri Isopanisad, Sri Caitanya-caritamrta, Initiation, Room Conversation, Interview, Arrival, Departure, Festival, Bhajan, Kirtan, Other |

### 6. Migration Timeline (64 migrations)

| Date Range | Migration Count | Key Features |
|------------|-----------------|--------------|
| 2024-11 | 1 | Sanskrit lexicon |
| 2025-09 | 8 | Core tables, audio, blogs |
| 2025-10 | 28 | RLS policies, audio events, composite verses |
| 2025-11 | 27 | Lectures, letters, poetry mode, daily quotes |

---

## Dependency Graph

### Visual Representation

```
                    ┌─────────────────────────────────────────────────┐
                    │                   index.html                     │
                    └─────────────────────────────────────────────────┘
                                           │
                                           ▼
                    ┌─────────────────────────────────────────────────┐
                    │                   main.tsx                       │
                    │     HelmetProvider → App                         │
                    └─────────────────────────────────────────────────┘
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                                    App.tsx                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │ ErrorBoundary│  │ThemeProvider │  │LanguageCtx  │  │    AuthContext   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────┘    │
│                                                                │               │
│  ┌──────────────────┐  ┌────────────────┐  ┌──────────────────┤               │
│  │ TooltipProvider  │  │ AudioProvider  │  │ QueryClientProvider              │
│  └──────────────────┘  └────────────────┘  └──────────────────┘               │
│                                           │                                    │
│                              ┌────────────┴────────────┐                       │
│                              │    BrowserRouter        │                       │
│                              │    Routes (70+ pages)   │                       │
│                              └─────────────────────────┘                       │
└────────────────────────────────────────────────────────────────────────────────┘
                                           │
            ┌──────────────────────────────┼──────────────────────────────┐
            ▼                              ▼                              ▼
┌───────────────────┐          ┌───────────────────┐          ┌───────────────────┐
│   Content Pages   │          │   Admin Pages     │          │   Tool Pages      │
│ ├─ BookOverview   │          │ ├─ Dashboard      │          │ ├─ Transliteration│
│ ├─ CantoOverview  │          │ ├─ Books          │          │ ├─ Dictionary     │
│ ├─ VedaReaderDB   │          │ ├─ Chapters       │          │ ├─ Numerology     │
│ ├─ Blog           │          │ ├─ BlogPosts      │          │ ├─ Learning       │
│ ├─ Audio          │          │ ├─ AudioPlaylists │          │ └─ Compiler       │
│ └─ Library        │          │ └─ Import tools   │          │                   │
└───────────────────┘          └───────────────────┘          └───────────────────┘
            │                              │                              │
            └──────────────────────────────┼──────────────────────────────┘
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                           Supabase Backend                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │    books     │──│    cantos    │──│   chapters   │──│      verses      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────┘    │
│                                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │  blog_posts  │──│ blog_categories│ │audio_playlists│──│   audio_tracks │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────────┘    │
│                                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                          │
│  │   lectures   │  │    letters   │  │sanskrit_lexicon│                         │
│  └──────────────┘  └──────────────┘  └──────────────┘                          │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Python Tools Dependency Graph

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                           Python Import Tools                                   │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐     │
│  │                       playwright_parser.py                             │     │
│  │  Imports:                                                              │     │
│  │  ├── playwright.sync_api (sync_playwright)                            │     │
│  │  ├── beautifulsoup4 (BeautifulSoup)                                   │     │
│  │  ├── pre_import_normalizer (normalize_parsed_data) [optional]         │     │
│  │  ├── json, time, re, os, asyncio                                      │     │
│  │  └── urllib.parse (urljoin, urlparse)                                 │     │
│  └───────────────────────────────────────────────────────────────────────┘     │
│                                           │                                     │
│                                           ▼                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐     │
│  │                     pre_import_normalizer.py                           │     │
│  │  Exports:                                                              │     │
│  │  ├── normalize_parsed_data(data)                                      │     │
│  │  └── convert_english_to_ukrainian_translit(text)                      │     │
│  └───────────────────────────────────────────────────────────────────────┘     │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐     │
│  │                       import_sb_epub.py                                │     │
│  │  Imports:                                                              │     │
│  │  ├── ebooklib (epub)                                                  │     │
│  │  ├── beautifulsoup4 (BeautifulSoup)                                   │     │
│  │  ├── requests                                                         │     │
│  │  ├── supabase (create_client)                                         │     │
│  │  └── dataclasses, argparse, re, os, sys                               │     │
│  └───────────────────────────────────────────────────────────────────────┘     │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐     │
│  │                       parse_server.py (Flask)                          │     │
│  │  Imports:                                                              │     │
│  │  ├── flask (Flask, request, jsonify)                                  │     │
│  │  ├── flask_cors (CORS)                                                │     │
│  │  └── playwright_parser (fetch_with_js, parse_*)                       │     │
│  └───────────────────────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Critical Paths

### 1. Rendering Critical Path

```
User Request → BrowserRouter → Route Match → Page Component
                                                    │
    ┌───────────────────────────────────────────────┴───────────────────────────┐
    ▼                                                                           ▼
 Context Providers                                               React Query Cache Check
 (Auth, Language, Audio)                                                        │
    │                                                           ┌───────────────┴──────────────┐
    ▼                                                           ▼                              ▼
 UI Components                                            Cache Hit                      Cache Miss
 (shadcn/ui)                                                 │                              │
    │                                                        ▼                              ▼
    ▼                                                   Return Data                  Supabase Query
 Content Rendering                                                                         │
                                                                                           ▼
                                                                                    Network Request
                                                                                           │
                                                                                           ▼
                                                                                    Parse Response
                                                                                           │
                                                                                           ▼
                                                                                    Update Cache
                                                                                           │
                                                                                           ▼
                                                                                    Trigger Re-render
```

### 2. Content Import Critical Path

```
EPUB/PDF File → Python Parser → Normalize Data → Supabase Insert
                     │
    ┌────────────────┴────────────────┐
    ▼                                 ▼
 ebooklib/BeautifulSoup          Playwright (for web sources)
    │                                 │
    ▼                                 ▼
 Extract Content                 Fetch + Parse HTML
    │                                 │
    └────────────────┬────────────────┘
                     ▼
            textNormalizer / pre_import_normalizer
                     │
                     ▼
            Convert IAST → Ukrainian
                     │
                     ▼
            Supabase create_client
                     │
                     ▼
            Insert into verses/chapters tables
```

### 3. Text Normalization Critical Path

```
Raw Text → textNormalizer.ts → sanscript library → Normalized Output
               │
               ├── normalizeVerseField(text, fieldType)
               │       └── Field-specific cleanup
               │
               ├── convertIASTtoUkrainian(text)
               │       └── sanscript.t(text, 'iast', 'cyrillic')
               │
               ├── devanagariToIAST(text)
               │       └── sanscript.t(text, 'devanagari', 'iast')
               │
               └── bengaliToIAST(text)
                       └── sanscript.t(text, 'bengali', 'iast')
```

---

## Recommendations

### 1. High-Priority Issues

| Issue | Impact | Recommendation |
|-------|--------|----------------|
| **Single point of failure** in textNormalizer.ts | All parsers depend on it | Add unit tests, consider error boundaries |
| **No Python requirements lock file** | Reproducibility issues | Create `requirements-lock.txt` |
| **Large bundle size** | Slow initial load | Implement code splitting for admin/tools pages |

### 2. Optimization Opportunities

| Area | Current State | Recommendation |
|------|---------------|----------------|
| **Lazy Loading** | Some pages lazy-loaded | Lazy-load all admin and tool pages |
| **Query Caching** | 5-minute stale time | Consider longer cache for static content |
| **Bundle Analysis** | Not implemented | Add bundle analyzer to track size |

### 3. Security Considerations

| Area | Status | Notes |
|------|--------|-------|
| **Supabase RLS** | Enabled on all tables | 64 migrations set up RLS policies |
| **DOMPurify** | Used for HTML sanitization | Properly sanitizing user content |
| **Environment Variables** | Using .env file | Ensure not committed to repo |

### 4. Maintenance Recommendations

1. **Update Dependencies Regularly**
   - React 18.3.1 is current
   - Vite 5.4.19 is current
   - Consider automated dependency updates (Dependabot)

2. **TypeScript Strict Mode**
   - Currently using strict mode
   - Maintain type coverage

3. **Documentation**
   - This report provides comprehensive docs
   - Consider adding JSDoc to key functions

4. **Testing**
   - No test files detected
   - Recommend adding unit tests for parsers and utilities

---

## Appendix: Complete File Counts

| Directory | Files | Types |
|-----------|-------|-------|
| `src/components/` | 97 | TSX/TS |
| `src/pages/` | 70 | TSX |
| `src/utils/` | 40 | TS |
| `src/hooks/` | 14 | TS/TSX |
| `src/contexts/` | 3 | TSX |
| `src/types/` | 4 | TS |
| `src/lib/` | 3 | TS |
| `src/integrations/` | 2 | TS |
| `supabase/migrations/` | 64 | SQL |
| `supabase/functions/` | 2 | TS |
| `tools/` | 24 | PY |
| `public/` | 17 | Various |
| `docs/` | 3 | MD |
| Root | 50+ | Various |

---

*Report generated by automated dependency analysis.*
