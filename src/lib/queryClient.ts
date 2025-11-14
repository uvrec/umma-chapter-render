import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed queries 2 times before giving up
      retry: 2,

      // Retry delay increases exponentially (1s, 2s, 4s)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,

      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,

      // Refetch on window focus for fresh data
      refetchOnWindowFocus: false,

      // Don't refetch on mount if data is still fresh
      refetchOnMount: false,

      // Don't throw errors, just return them in the error state
      throwOnError: false,
    },
    mutations: {
      // Don't retry mutations by default (can be overridden per mutation)
      retry: 0,

      // Don't throw errors, handle them in onError callbacks
      throwOnError: false,
    },
  },
});
