-- Stripe Payment Integration Tables
-- Creates tables for managing Stripe customers, subscriptions, and payment history

-- Table for linking Supabase users to Stripe customers
CREATE TABLE IF NOT EXISTS stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL UNIQUE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Table for tracking Stripe subscriptions
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for tracking one-time donations/payments
CREATE TABLE IF NOT EXISTS stripe_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  amount INTEGER NOT NULL, -- Amount in smallest currency unit (kopecks for UAH)
  currency TEXT NOT NULL DEFAULT 'uah',
  status TEXT NOT NULL DEFAULT 'pending',
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for Stripe products (subscription tiers)
CREATE TABLE IF NOT EXISTS stripe_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_product_id TEXT NOT NULL UNIQUE,
  stripe_price_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  amount INTEGER NOT NULL, -- Amount in smallest currency unit
  currency TEXT NOT NULL DEFAULT 'uah',
  interval TEXT, -- 'month', 'year', or NULL for one-time
  interval_count INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_stripe_id ON stripe_customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_user_id ON stripe_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_status ON stripe_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_stripe_payments_user_id ON stripe_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payments_status ON stripe_payments(status);

-- RLS Policies
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_products ENABLE ROW LEVEL SECURITY;

-- Users can read their own customer records
CREATE POLICY "Users can view own customer record"
  ON stripe_customers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can read their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON stripe_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can read their own payments
CREATE POLICY "Users can view own payments"
  ON stripe_payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Anyone can view active products
CREATE POLICY "Anyone can view active products"
  ON stripe_products FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

-- Service role can do everything (for webhooks)
CREATE POLICY "Service role full access to customers"
  ON stripe_customers FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to subscriptions"
  ON stripe_subscriptions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to payments"
  ON stripe_payments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to products"
  ON stripe_products FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_stripe_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER stripe_customers_updated_at
  BEFORE UPDATE ON stripe_customers
  FOR EACH ROW EXECUTE FUNCTION update_stripe_updated_at();

CREATE TRIGGER stripe_subscriptions_updated_at
  BEFORE UPDATE ON stripe_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_stripe_updated_at();

CREATE TRIGGER stripe_payments_updated_at
  BEFORE UPDATE ON stripe_payments
  FOR EACH ROW EXECUTE FUNCTION update_stripe_updated_at();

CREATE TRIGGER stripe_products_updated_at
  BEFORE UPDATE ON stripe_products
  FOR EACH ROW EXECUTE FUNCTION update_stripe_updated_at();

-- Insert default subscription products (these will be synced with Stripe)
-- Note: stripe_product_id and stripe_price_id should be updated after creating products in Stripe Dashboard
INSERT INTO stripe_products (stripe_product_id, stripe_price_id, name, description, amount, currency, interval, interval_count)
VALUES
  ('prod_basic_monthly', 'price_basic_monthly', 'Базова підтримка', 'Щомісячна базова підтримка проєкту', 5000, 'uah', 'month', 1),
  ('prod_standard_monthly', 'price_standard_monthly', 'Стандартна підтримка', 'Щомісячна стандартна підтримка проєкту', 10000, 'uah', 'month', 1),
  ('prod_premium_monthly', 'price_premium_monthly', 'Преміум підтримка', 'Щомісячна преміум підтримка проєкту', 20000, 'uah', 'month', 1)
ON CONFLICT (stripe_product_id) DO NOTHING;
