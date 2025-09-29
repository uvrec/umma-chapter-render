import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
      throw fetchError;
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
          console.log(`Published post: ${post.title_ua || post.title_en}`);
          publishedCount++;
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Published ${publishedCount} scheduled posts`,
        publishedPosts: publishedCount
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

// Schedule this function to run daily at midnight
Deno.cron("Publish scheduled posts", "0 0 * * *", async () => {
  console.log("Running scheduled post publication...");
  
  try {
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/publish-scheduled-posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    console.log('Cron job result:', result);
  } catch (error) {
    console.error('Cron job error:', error);
  }
});