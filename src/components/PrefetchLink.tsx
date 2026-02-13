/**
 * PrefetchLink - Link component with route prefetching
 *
 * Prefetches the route component when the user hovers or focuses the link.
 * This improves perceived performance by loading the next page before click.
 */

/* eslint-disable react-refresh/only-export-components */
import { Link, LinkProps } from 'react-router-dom';
import { useState, useCallback, forwardRef } from 'react';

// Map of routes to their import functions
const routePrefetchMap: Record<string, () => Promise<any>> = {
  '/library': () => import('@/pages/Library'),
  '/blog': () => import('@/pages/Blog'),
  '/glossary': () => import('@/pages/GlossaryDB'),
  '/audio': () => import('@/pages/Audio'),
  '/calendar': () => import('@/pages/VaishnavCalendar'),
  '/quotes': () => import('@/pages/Quotes'),
  '/tools/transliteration': () => import('@/pages/TransliterationTool'),
  '/tools/numerology': () => import('@/pages/tools/Numerology'),
  // Admin routes
  '/admin': () => import('@/pages/admin/Dashboard'),
  '/admin/books': () => import('@/pages/admin/Books'),
  '/admin/blog': () => import('@/pages/admin/BlogPosts'),
};

// Get prefetch function for a path
function getPrefetchFn(path: string): (() => Promise<any>) | null {
  // Remove language prefix
  const normalizedPath = path.replace(/^\/(uk|en)/, '');

  // Check exact match
  if (routePrefetchMap[normalizedPath]) {
    return routePrefetchMap[normalizedPath];
  }

  // Check prefix match
  for (const [route, fn] of Object.entries(routePrefetchMap)) {
    if (normalizedPath.startsWith(route)) {
      return fn;
    }
  }

  return null;
}

interface PrefetchLinkProps extends LinkProps {
  prefetch?: boolean;
}

export const PrefetchLink = forwardRef<HTMLAnchorElement, PrefetchLinkProps>(
  ({ prefetch = true, to, onMouseEnter, onFocus, children, ...props }, ref) => {
    const [prefetched, setPrefetched] = useState(false);

    const handlePrefetch = useCallback(() => {
      if (prefetched || !prefetch) return;

      const path = typeof to === 'string' ? to : to.pathname || '';
      const prefetchFn = getPrefetchFn(path);

      if (prefetchFn) {
        prefetchFn().catch(() => {
          // Ignore prefetch errors
        });
        setPrefetched(true);
      }
    }, [to, prefetch, prefetched]);

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        handlePrefetch();
        onMouseEnter?.(e);
      },
      [handlePrefetch, onMouseEnter]
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLAnchorElement>) => {
        handlePrefetch();
        onFocus?.(e);
      },
      [handlePrefetch, onFocus]
    );

    return (
      <Link
        ref={ref}
        to={to}
        onMouseEnter={handleMouseEnter}
        onFocus={handleFocus}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

PrefetchLink.displayName = 'PrefetchLink';

/**
 * Hook to prefetch multiple routes at once
 * Useful for preloading common routes on app initialization
 */
export function usePrefetchRoutes(routes: string[]) {
  const prefetch = useCallback(() => {
    routes.forEach((route) => {
      const prefetchFn = getPrefetchFn(route);
      if (prefetchFn) {
        // Use requestIdleCallback for non-blocking prefetch
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            prefetchFn().catch(() => {});
          });
        } else {
          setTimeout(() => {
            prefetchFn().catch(() => {});
          }, 100);
        }
      }
    });
  }, [routes]);

  return prefetch;
}

/**
 * Prefetch common routes when app is idle
 */
export function prefetchCommonRoutes() {
  const commonRoutes = [
    '/library',
    '/blog',
    '/audio',
  ];

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      commonRoutes.forEach((route) => {
        const prefetchFn = getPrefetchFn(route);
        if (prefetchFn) {
          prefetchFn().catch(() => {});
        }
      });
    }, { timeout: 3000 });
  }
}
