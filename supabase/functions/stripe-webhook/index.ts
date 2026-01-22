// Supabase Edge Function: stripe-webhook
// Handles Stripe webhook events for payment confirmations and subscription updates
// Requires: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET in Edge Function secrets

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeKey || !webhookSecret) {
      console.error("[stripe-webhook] Missing configuration");
      return new Response(
        JSON.stringify({ error: "Webhook not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("[stripe-webhook] Missing Stripe signature");
      return new Response(
        JSON.stringify({ error: "Missing signature" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error("[stripe-webhook] Signature verification failed:", err);
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`[stripe-webhook] Received event: ${event.type}`);

    // Initialize Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[stripe-webhook] Checkout session completed: ${session.id}`);

        // Update payment record
        await supabaseAdmin
          .from("stripe_payments")
          .update({
            status: "completed",
            stripe_payment_intent_id: session.payment_intent as string,
            amount: session.amount_total || 0,
          })
          .eq("stripe_checkout_session_id", session.id);

        // If this is a subscription, the subscription events will handle the rest
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[stripe-webhook] Payment succeeded: ${paymentIntent.id}`);

        // Update payment record if it exists
        await supabaseAdmin
          .from("stripe_payments")
          .update({
            status: "succeeded",
            amount: paymentIntent.amount,
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[stripe-webhook] Payment failed: ${paymentIntent.id}`);

        await supabaseAdmin
          .from("stripe_payments")
          .update({
            status: "failed",
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[stripe-webhook] Subscription created: ${subscription.id}`);

        // Get the user ID from the customer
        const { data: customerData } = await supabaseAdmin
          .from("stripe_customers")
          .select("user_id")
          .eq("stripe_customer_id", subscription.customer as string)
          .single();

        if (customerData) {
          await supabaseAdmin.from("stripe_subscriptions").upsert({
            user_id: customerData.user_id,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            stripe_price_id: subscription.items.data[0]?.price.id || "",
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          });
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[stripe-webhook] Subscription updated: ${subscription.id}`);

        await supabaseAdmin
          .from("stripe_subscriptions")
          .update({
            status: subscription.status,
            stripe_price_id: subscription.items.data[0]?.price.id || "",
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: subscription.canceled_at
              ? new Date(subscription.canceled_at * 1000).toISOString()
              : null,
          })
          .eq("stripe_subscription_id", subscription.id);

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[stripe-webhook] Subscription deleted: ${subscription.id}`);

        await supabaseAdmin
          .from("stripe_subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[stripe-webhook] Invoice paid: ${invoice.id}`);

        // Record successful subscription payment
        if (invoice.subscription) {
          const { data: customerData } = await supabaseAdmin
            .from("stripe_customers")
            .select("user_id")
            .eq("stripe_customer_id", invoice.customer as string)
            .single();

          if (customerData) {
            await supabaseAdmin.from("stripe_payments").insert({
              user_id: customerData.user_id,
              stripe_payment_intent_id: invoice.payment_intent as string,
              stripe_customer_id: invoice.customer as string,
              amount: invoice.amount_paid,
              currency: invoice.currency,
              status: "succeeded",
              description: "Оплата підписки",
              metadata: {
                invoice_id: invoice.id,
                subscription_id: invoice.subscription,
              },
            });
          }
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[stripe-webhook] Invoice payment failed: ${invoice.id}`);

        // Update subscription status if needed
        if (invoice.subscription) {
          await supabaseAdmin
            .from("stripe_subscriptions")
            .update({
              status: "past_due",
            })
            .eq("stripe_subscription_id", invoice.subscription as string);
        }

        break;
      }

      default:
        console.log(`[stripe-webhook] Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("[stripe-webhook] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
