// Supabase Edge Function: stripe-checkout
// Creates Stripe Checkout Sessions for one-time payments and subscriptions
// Requires: STRIPE_SECRET_KEY in Edge Function secrets

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckoutRequest {
  priceId?: string;
  amount?: number; // Amount in smallest currency unit (kopecks for UAH)
  mode: "payment" | "subscription";
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("[stripe-checkout] STRIPE_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Payment system not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Validate authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("[stripe-checkout] Auth error:", userError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse request body
    const body: CheckoutRequest = await req.json();
    const { priceId, amount, mode, successUrl, cancelUrl, metadata = {} } = body;

    if (!mode || !successUrl || !cancelUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: mode, successUrl, cancelUrl" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (mode === "subscription" && !priceId) {
      return new Response(
        JSON.stringify({ error: "priceId is required for subscriptions" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (mode === "payment" && !priceId && !amount) {
      return new Response(
        JSON.stringify({ error: "Either priceId or amount is required for one-time payments" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Use service role client for database operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user already has a Stripe customer ID
    const { data: existingCustomer } = await supabaseAdmin
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let stripeCustomerId = existingCustomer?.stripe_customer_id;

    // Create or retrieve Stripe customer
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      stripeCustomerId = customer.id;

      // Save customer ID to database
      await supabaseAdmin.from("stripe_customers").insert({
        user_id: user.id,
        stripe_customer_id: stripeCustomerId,
        email: user.email,
      });

      console.log(`[stripe-checkout] Created new Stripe customer: ${stripeCustomerId} for user: ${user.id}`);
    }

    // Build checkout session parameters
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: stripeCustomerId,
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        ...metadata,
        supabase_user_id: user.id,
      },
      locale: "uk", // Ukrainian locale
      payment_method_types: ["card"],
    };

    // Add line items based on payment type
    if (priceId) {
      sessionParams.line_items = [
        {
          price: priceId,
          quantity: 1,
        },
      ];
    } else if (amount) {
      // Create a one-time payment with custom amount
      sessionParams.line_items = [
        {
          price_data: {
            currency: "uah",
            unit_amount: amount,
            product_data: {
              name: "Добровільний внесок",
              description: "Підтримка проєкту VedaVoice",
            },
          },
          quantity: 1,
        },
      ];
    }

    // For subscriptions, allow promotion codes
    if (mode === "subscription") {
      sessionParams.allow_promotion_codes = true;
      sessionParams.billing_address_collection = "auto";
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);

    // Record the pending payment
    await supabaseAdmin.from("stripe_payments").insert({
      user_id: user.id,
      stripe_checkout_session_id: session.id,
      stripe_customer_id: stripeCustomerId,
      amount: amount || 0, // Will be updated by webhook
      currency: "uah",
      status: "pending",
      description: mode === "subscription" ? "Підписка" : "Одноразовий внесок",
      metadata: {
        mode,
        price_id: priceId || null,
        ...metadata,
      },
    });

    console.log(`[stripe-checkout] Created checkout session: ${session.id} for user: ${user.id}`);

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("[stripe-checkout] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
