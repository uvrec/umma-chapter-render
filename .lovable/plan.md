

# Fix Build Errors Blocking Deployment

## Root Cause

The site keeps showing the old version because **the build fails** on 2 TypeScript errors. Until these are fixed, no new code gets deployed.

The errors are in `src/utils/lazy-components.tsx` — it imports two pages (`Chat` and `LocalChat`) that no longer exist in the project. These are dead lazy-load exports that nobody uses.

## Fix

Remove lines 260-262 from `src/utils/lazy-components.tsx`:

```
// Heavy content pages   <-- remove this comment
export const LazyChat = ...        <-- remove
export const LazyLocalChat = ...   <-- remove
```

This is a safe change — neither `LazyChat` nor `LazyLocalChat` is imported anywhere in the codebase.

## Pending Security Migration

The previously proposed database security fixes (search_path hardening, RLS tightening for numerology_calculations, moving materialized views to private schema) still need to be applied. After the build is unblocked, these will be executed as a SQL migration.

