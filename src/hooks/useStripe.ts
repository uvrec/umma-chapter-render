/**
 * useStripe - Hook for managing Stripe payments and subscriptions
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface StripeProduct {
  id: string;
  stripe_product_id: string;
  stripe_price_id: string;
  name: string;
  description: string | null;
  amount: number;
  currency: string;
  interval: string | null;
  interval_count: number | null;
  is_active: boolean;
}

export interface StripeSubscription {
  id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export interface StripePayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  created_at: string;
}

interface UseStripeResult {
  // Data
  products: StripeProduct[];
  subscription: StripeSubscription | null;
  payments: StripePayment[];
  hasActiveSubscription: boolean;

  // Loading states
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;

  // Actions
  createCheckoutSession: (options: CheckoutOptions) => Promise<string | null>;
  openCustomerPortal: () => Promise<string | null>;
  refreshData: () => Promise<void>;
}

interface CheckoutOptions {
  priceId?: string;
  amount?: number; // Amount in kopecks (smallest currency unit)
  mode: 'payment' | 'subscription';
}

export function useStripe(): UseStripeResult {
  const { user, session } = useAuth();
  const userId = user?.id;

  // State
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [subscription, setSubscription] = useState<StripeSubscription | null>(null);
  const [payments, setPayments] = useState<StripePayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current base URL for success/cancel redirects
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  // Load products (available to everyone)
  const loadProducts = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('stripe_products')
        .select('*')
        .eq('is_active', true)
        .order('amount', { ascending: true });

      if (fetchError) throw fetchError;
      setProducts((data || []) as StripeProduct[]);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  }, []);

  // Load user-specific data (subscription, payments)
  const loadUserData = useCallback(async () => {
    if (!userId) {
      setSubscription(null);
      setPayments([]);
      return;
    }

    try {
      // Load active subscription
      const { data: subData, error: subError } = await supabase
        .from('stripe_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['active', 'trialing', 'past_due'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subError) throw subError;
      setSubscription(subData as StripeSubscription | null);

      // Load payment history
      const { data: paymentData, error: paymentError } = await supabase
        .from('stripe_payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (paymentError) throw paymentError;
      setPayments((paymentData || []) as StripePayment[]);
    } catch (err) {
      console.error('Failed to load user payment data:', err);
    }
  }, [userId]);

  // Initial load
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await Promise.all([loadProducts(), loadUserData()]);
      setIsLoading(false);
    };
    load();
  }, [loadProducts, loadUserData]);

  // Create checkout session
  const createCheckoutSession = useCallback(async (options: CheckoutOptions): Promise<string | null> => {
    if (!session?.access_token) {
      setError('Будь ласка, увійдіть в обліковий запис для оплати');
      return null;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const baseUrl = getBaseUrl();
      const { data, error: fnError } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          priceId: options.priceId,
          amount: options.amount,
          mode: options.mode,
          successUrl: `${baseUrl}/payment/success`,
          cancelUrl: `${baseUrl}/payment/card`,
        },
      });

      if (fnError) {
        throw new Error(fnError.message || 'Помилка створення сесії оплати');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
        return data.url;
      }

      throw new Error('Не вдалося отримати посилання на оплату');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Помилка оплати';
      setError(message);
      console.error('Checkout error:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [session?.access_token]);

  // Open customer portal for subscription management
  const openCustomerPortal = useCallback(async (): Promise<string | null> => {
    if (!session?.access_token) {
      setError('Будь ласка, увійдіть в обліковий запис');
      return null;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const baseUrl = getBaseUrl();
      const { data, error: fnError } = await supabase.functions.invoke('stripe-portal', {
        body: {
          returnUrl: `${baseUrl}/payment/card`,
        },
      });

      if (fnError) {
        throw new Error(fnError.message || 'Помилка відкриття порталу');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.url) {
        window.location.href = data.url;
        return data.url;
      }

      throw new Error('Не вдалося отримати посилання на портал');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Помилка';
      setError(message);
      console.error('Portal error:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [session?.access_token]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([loadProducts(), loadUserData()]);
    setIsLoading(false);
  }, [loadProducts, loadUserData]);

  // Check if user has active subscription
  const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trialing';

  return {
    products,
    subscription,
    payments,
    hasActiveSubscription,
    isLoading,
    isProcessing,
    error,
    createCheckoutSession,
    openCustomerPortal,
    refreshData,
  };
}

// Helper function to format amount in UAH
export function formatAmount(amount: number, currency = 'uah'): string {
  const value = amount / 100; // Convert from kopecks to hryvnia
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
