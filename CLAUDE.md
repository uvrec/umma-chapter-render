# CLAUDE.md — Vedavoice.org Development Guide

## Project Overview

Vedavoice.org is a spiritual reading platform for Vedic texts (Bhagavad-Gita, Srimad-Bhagavatam, etc.) with audio, translations, annotations, and learning features. It serves a Ukrainian-speaking audience with Sanskrit/English content.

**Tech stack**: React 18 + TypeScript + Vite + Tailwind CSS + Supabase + Capacitor (mobile)

## Quick Reference

```bash
npm run dev        # Start dev server (port 8080)
npm run build      # Production build
npm run lint       # ESLint check
npm run preview    # Preview production build
```

There is no test suite configured. Verify changes with `npm run build` and `npm run lint`.

## Project Structure

```
src/
  components/       # React components (100+)
    ui/             # shadcn-ui primitives
    book/           # Book reader components
    admin/          # Admin panels
    audio/          # Audio player
    library/        # Library/search
  pages/            # Route page components
  hooks/            # Custom React hooks (~20)
  services/         # Supabase API services
  contexts/         # React context providers
  types/            # TypeScript type definitions
  utils/            # Helper utilities
  lib/              # Core utilities (utils.ts)
  styles/           # CSS files
  constants/        # App constants
  data/             # Static data files
supabase/
  migrations/       # Database migrations (SQL)
  functions/        # Serverless edge functions
tools/              # Data import/parsing scripts (Python + TS)
scripts/            # Build and utility scripts
```

Path alias: `@/*` maps to `./src/*`

## Critical Design Rules

**READ `.cursorrules` AND `INSTRUCTIONS.md` BEFORE MAKING UI CHANGES.**

### Never use:
- Card components (except book covers in library)
- `border`, `shadow`, `rounded` with background
- `border-t`, `border-b` dividers
- `overflow: hidden` on `html`, `body`, or `#root` (breaks sticky header)
- StatsBar or QuickActions with cards on the homepage

### Always use:
- `bg-background` (transparent background)
- Typography hierarchy for structure
- Space (margin/padding) for visual separation
- Clean text styling — the site should look like a physical book

### Sticky header is mandatory:
```css
.site-header {
  position: -webkit-sticky !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 50 !important;
}
```
Use `overflow-x: clip` instead of `overflow-x: hidden`.

## Protected Files

Do NOT modify without explicit request:
1. `src/index.css` — global styles, design system
2. `src/components/Header.tsx` — navigation (class `site-header` must not change)
3. `src/styles/fonts.css` — font definitions
4. `tailwind.config.ts` — Tailwind configuration

## TypeScript Configuration

- `strict` mode is OFF (`noImplicitAny: false`, `strictNullChecks: false`)
- `@typescript-eslint/no-unused-vars` is disabled
- Target: ES2020, module: ESNext

## Fonts & Typography

- Primary text: `Noto Serif` (CSS var `--font-primary`)
- Devanagari: `Noto Sans Devanagari` (CSS var `--font-devanagari`)
- Transliteration: `Noto Serif` (CSS var `--font-translit`)
- UI: `--font-ui`
- Reader font sizes controlled via `useReaderSettings` hook and CSS variables

## Theme Colors

Primary palette is amber/saffron (`#d97706` = `brand-600`). Spiritual color tokens: saffron, gold, earth, amber. Full amber scale (50–950) available. CSS variable-based color system supports dark mode via `next-themes`.

## Key Architectural Patterns

- **State management**: TanStack React Query for server state, React Context for UI state
- **Routing**: React Router v6 with nested routes
- **UI components**: shadcn-ui (Radix primitives + Tailwind)
- **Forms**: React Hook Form + Zod validation
- **Rich text editing**: TipTap editor with extensions
- **PWA**: vite-plugin-pwa with Workbox caching strategies
- **Mobile**: Capacitor wrapping the web app for iOS/Android
- **Audio**: Custom hooks (`useAudioQueue`) for playlist management

## Supabase

- Project URL: defined in `.env` as `VITE_SUPABASE_URL`
- Client initialized in `src/integrations/` or `src/services/`
- Migrations in `supabase/migrations/`
- Edge functions in `supabase/functions/`

## Build & Bundling

- Vite with React SWC plugin (fast refresh)
- Manual chunk splitting configured for vendor libs (React, UI, Query, Editor, Charts, Supabase, Date)
- Chunk size warning threshold: 500KB
- PWA service worker generated in production builds only
- Version tracking via `public/version.json` (auto-generated at build time)

## Pre-commit Checklist

- [ ] Header remains sticky
- [ ] No new Card components (except library book covers)
- [ ] No new border/shadow usage
- [ ] `overflow-x` uses `clip`, not `hidden`
- [ ] Fonts unchanged
- [ ] `npm run build` passes
- [ ] `npm run lint` passes

## Git Conventions

- Atomic commits with descriptive messages
- Describe what was changed and why in commit messages
- See `.gitmessage` for the commit template
