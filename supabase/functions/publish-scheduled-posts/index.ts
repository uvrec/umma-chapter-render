/**
 * Edge Function: publish-scheduled-posts
 * 
 * Publishes blog posts that are scheduled for publication.
 * 
 * SECURITY: 
 * - HTTP endpoint requires admin authentication
 * - Cron job uses internal service role (not HTTP)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Validate admin authentication
 */
async function validateAdminAuth(req: Request): Promise<{ isAdmin: boolean } | Response> {
  const authHeader = req.headers.get("Authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Unauthorized: Missing Authorization header" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getClaims(token);
  
  if (error || !data?.claims?.sub) {
    console.error("[publish-scheduled-posts] Auth error:", error?.message);
    return new Response(
      JSON.stringify({ error: "Unauthorized: Invalid token" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const userId = data.claims.sub as string;

  // Check admin role
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();

  if (roleError || !roleData) {
    console.warn(`[publish-scheduled-posts] Non-admin user attempted access: ${userId}`);
    return new Response(
      JSON.stringify({ error: "Forbidden: Admin access required" }),
      { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  console.log(`[publish-scheduled-posts] Admin access granted: ${userId}`);
  return { isAdmin: true };
}

/**
 * Core logic: publish scheduled posts
 */
async function publishScheduledPosts(): Promise<{ publishedCount: number; error?: string }> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Find posts scheduled for publication
  const { data: scheduledPosts, error: fetchError } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', false)
    .not('scheduled_publish_at', 'is', null)
    .lte('scheduled_publish_at', new Date().toISOString());

  if (fetchError) {
    console.error('Error fetching scheduled posts:', fetchError);
    return { publishedCount: 0, error: fetchError.message };
  }

  let publishedCount = 0;

  if (scheduledPosts && scheduledPosts.length > 0) {
    for (const post of scheduledPosts) {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          is_published: true,
          published_at: new Date().toISOString(),
          scheduled_publish_at: null
        })
        .eq('id', post.id);

      if (updateError) {
        console.error(`Error publishing post ${post.id}:`, updateError);
      } else {
        console.log(`Published post: ${post.title_uk || post.title_en}`);
        publishedCount++;
      }
    }
  }

  return { publishedCount };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate admin authentication for HTTP requests
  const authResult = await validateAdminAuth(req);
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const result = await publishScheduledPosts();

    if (result.error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Published ${result.publishedCount} scheduled posts`,
        publishedPosts: result.publishedCount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in publish-scheduled-posts function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// Cron job: runs with service role internally (no HTTP auth needed)
Deno.cron("Publish scheduled posts", "0 0 * * *", async () => {
  console.log("Running scheduled post publication via cron...");
  
  try {
    const result = await publishScheduledPosts();
    console.log('Cron job result:', result);
  } catch (error) {
    console.error('Cron job error:', error);
  }
});
