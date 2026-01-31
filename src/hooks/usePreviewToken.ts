// usePreviewToken.ts - Hook for managing preview tokens for unpublished content
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type ResourceType = 'book' | 'canto' | 'chapter' | 'verse';

interface PreviewToken {
  id: string;
  token: string;
  resource_type: ResourceType;
  resource_id: string;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
  access_count: number;
  note: string | null;
}

// Global token storage
let currentPreviewToken: string | null = null;

// Get current preview token (for use in API calls)
export function getPreviewToken(): string | null {
  return currentPreviewToken;
}

// Set preview token globally
export function setPreviewToken(token: string | null) {
  currentPreviewToken = token;
}

export function usePreviewToken() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  // Extract token from URL on mount
  useEffect(() => {
    const token = searchParams.get('preview');
    if (token) {
      setPreviewToken(token);
      // Store in sessionStorage for persistence during navigation
      sessionStorage.setItem('preview_token', token);
    } else {
      // Check sessionStorage for existing token
      const storedToken = sessionStorage.getItem('preview_token');
      if (storedToken) {
        setPreviewToken(storedToken);
      }
    }
  }, [searchParams]);

  // Generate a preview link for a resource
  const generatePreviewLink = useCallback(async (
    resourceType: ResourceType,
    resourceId: string,
    options?: {
      expiresInDays?: number;
      note?: string;
    }
  ): Promise<string | null> => {
    if (!isAdmin) {
      toast.error('Тільки адміністратори можуть створювати превью-посилання');
      return null;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.rpc('generate_preview_token', {
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_expires_in_days: options?.expiresInDays ?? null,
        p_note: options?.note ?? null,
      });

      if (error) {
        console.error('Error generating preview token:', error);
        toast.error('Помилка створення превью-посилання');
        return null;
      }

      const token = data as string;
      const url = new URL(window.location.href);
      url.searchParams.set('preview', token);

      return url.toString();
    } catch (err) {
      console.error('Error generating preview link:', err);
      toast.error('Помилка створення превью-посилання');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [isAdmin]);

  // Generate preview link for current page
  const generateCurrentPageLink = useCallback(async (
    resourceType: ResourceType,
    resourceId: string,
    options?: {
      expiresInDays?: number;
      note?: string;
    }
  ): Promise<void> => {
    const link = await generatePreviewLink(resourceType, resourceId, options);
    if (link) {
      await navigator.clipboard.writeText(link);
      toast.success('Превью-посилання скопійовано!', {
        description: options?.expiresInDays
          ? `Діє ${options.expiresInDays} днів`
          : 'Без обмеження терміну',
      });
    }
  }, [generatePreviewLink]);

  // Get all preview tokens for a resource (admin only)
  const getTokensForResource = useCallback(async (
    resourceType: ResourceType,
    resourceId: string
  ): Promise<PreviewToken[]> => {
    if (!isAdmin) return [];

    const { data, error } = await supabase
      .from('preview_tokens')
      .select('*')
      .eq('resource_type', resourceType)
      .eq('resource_id', resourceId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching preview tokens:', error);
      return [];
    }

    return data as PreviewToken[];
  }, [isAdmin]);

  // Deactivate a preview token
  const deactivateToken = useCallback(async (tokenId: string): Promise<boolean> => {
    if (!isAdmin) return false;

    const { error } = await supabase
      .from('preview_tokens')
      .update({ is_active: false })
      .eq('id', tokenId);

    if (error) {
      console.error('Error deactivating token:', error);
      toast.error('Помилка деактивації токена');
      return false;
    }

    toast.success('Токен деактивовано');
    return true;
  }, [isAdmin]);

  // Check if current page has preview access
  const hasPreviewAccess = currentPreviewToken !== null;

  // Clear preview token
  const clearPreviewToken = useCallback(() => {
    setPreviewToken(null);
    sessionStorage.removeItem('preview_token');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('preview');
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return {
    previewToken: currentPreviewToken,
    hasPreviewAccess,
    isGenerating,
    generatePreviewLink,
    generateCurrentPageLink,
    getTokensForResource,
    deactivateToken,
    clearPreviewToken,
  };
}

// Helper to build preview URL
export function buildPreviewUrl(
  basePath: string,
  token: string,
  language: string = 'uk'
): string {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://vedavoice.org';

  const url = new URL(`/${language}${basePath}`, baseUrl);
  url.searchParams.set('preview', token);
  return url.toString();
}
