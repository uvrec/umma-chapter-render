/**
 * Lazy Loading Utilities for Performance Optimization
 *
 * Provides:
 * - Lazy component loading with React.lazy()
 * - Suspense wrapper with loading fallback
 * - Route prefetching utilities
 * - Image lazy loading hooks
 */

/* eslint-disable react-refresh/only-export-components */
import React, { Suspense, lazy, useEffect, useState, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

/**
 * Loading spinner component
 */
export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

/**
 * Page loading skeleton
 */
export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-4 mt-8">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

/**
 * Card loading skeleton
 */
export function CardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

/**
 * Verse loading skeleton
 */
export function VerseSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-48 mx-auto" /> {/* Sanskrit */}
      <Skeleton className="h-6 w-full" /> {/* Transliteration */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="space-y-2 mt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

/**
 * HOC to wrap component with Suspense
 */
export function withSuspense<P extends object>(
  Component: ComponentType<P>,
  fallback: React.ReactNode = <PageSkeleton />
): React.FC<P> {
  return function SuspenseWrapper(props: P) {
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );
  };
}

/**
 * Create lazy component with custom fallback
 */
export function lazyWithFallback<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <PageSkeleton />
) {
  const LazyComponent = lazy(importFn);

  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Prefetch a route's component
 */
export function prefetchRoute(importFn: () => Promise<any>) {
  // Start loading the chunk in the background
  importFn();
}

/**
 * Hook for prefetching routes on hover/focus
 */
export function usePrefetch(importFn: () => Promise<any>) {
  const [prefetched, setPrefetched] = useState(false);

  const prefetch = () => {
    if (!prefetched) {
      prefetchRoute(importFn);
      setPrefetched(true);
    }
  };

  return { prefetch, prefetched };
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLDivElement>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

   
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      rootMargin: '100px',
      threshold: 0,
      ...options,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.rootMargin, options.threshold]);

  return [ref, isIntersecting];
}

/**
 * Lazy image component with loading placeholder
 */
export function LazyImage({
  src,
  alt,
  className = '',
  placeholderClassName = '',
}: {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
}) {
  const [ref, isIntersecting] = useIntersectionObserver();
  const [loaded, setLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (isIntersecting && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isIntersecting, shouldLoad]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {!loaded && (
        <Skeleton className={`absolute inset-0 ${placeholderClassName}`} />
      )}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}

/**
 * Component that only renders when visible in viewport
 */
export function LazyRender({
  children,
  placeholder = <CardSkeleton />,
  rootMargin = '200px',
}: {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  rootMargin?: string;
}) {
  const [ref, isIntersecting] = useIntersectionObserver({ rootMargin });
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    if (isIntersecting && !hasRendered) {
      setHasRendered(true);
    }
  }, [isIntersecting, hasRendered]);

  return (
    <div ref={ref}>
      {hasRendered ? children : placeholder}
    </div>
  );
}

// ============================================================
// Lazy-loaded page components
// ============================================================

// Admin pages - heavy, load on demand
export const LazyDashboard = lazy(() => import('@/pages/admin/Dashboard'));
export const LazyBooks = lazy(() => import('@/pages/admin/Books'));
export const LazyChapters = lazy(() => import('@/pages/admin/Chapters'));
export const LazyBlogPosts = lazy(() => import('@/pages/admin/BlogPosts'));
export const LazyUniversalImport = lazy(() => import('@/pages/admin/UniversalImportFixed'));
export const LazyBBTImport = lazy(() => import('@/pages/admin/BBTImportUniversal'));
export const LazyBookExport = lazy(() => import('@/pages/admin/BookExport'));
export const LazyLRCEditor = lazy(() => import('@/pages/admin/LRCEditorPage'));

// Tools pages - specialized, load on demand
export const LazyTransliterationTool = lazy(() => import('@/pages/TransliterationTool'));
export const LazyNumerology = lazy(() => import('@/pages/tools/Numerology'));
export const LazyScriptLearning = lazy(() => import('@/pages/tools/ScriptLearning'));
export const LazyJyotishCalculator = lazy(() => import('@/pages/tools/JyotishCalculator'));
export const LazyRagaExplorer = lazy(() => import('@/pages/tools/RagaExplorer'));

// Heavy content pages
export const LazyChat = lazy(() => import('@/pages/Chat'));
export const LazyLocalChat = lazy(() => import('@/pages/LocalChat'));
export const LazyKnowledgeCompiler = lazy(() => import('@/pages/KnowledgeCompiler'));

// Calendar pages
export const LazyVaishnavCalendar = lazy(() => import('@/pages/VaishnavCalendar'));
export const LazyEkadashiList = lazy(() => import('@/pages/EkadashiList'));
export const LazyEkadashiDetail = lazy(() => import('@/pages/EkadashiDetail'));
