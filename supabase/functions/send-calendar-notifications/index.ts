/**
 * Edge Function: send-calendar-notifications
 *
 * Sends notification reminders for upcoming Ekadashi and festivals.
 * Runs daily via cron, checking each user's timezone to send at their preferred time.
 *
 * Features:
 * - Checks user notification preferences (notify_ekadashi, notify_festivals, notify_day_before)
 * - Respects user's notification_time setting
 * - Sends to user's location-specific calendar events
 * - Logs all notifications to notification_logs table
 * - Supports email notifications (Resend API)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationResult {
  sent: number;
  failed: number;
  skipped: number;
  errors: string[];
}

interface UserCalendarSettings {
  user_id: string;
  notify_ekadashi: boolean;
  notify_festivals: boolean;
  notify_day_before: boolean;
  notification_time: string;
  location_id: string | null;
  custom_timezone: string | null;
}

interface CalendarEvent {
  id: string;
  event_date: string;
  ekadashi_id: string | null;
  festival_id: string | null;
  appearance_day_id: string | null;
  ekadashi_info?: {
    name_ua: string;
    name_en: string;
    glory_text_ua: string;
    glory_text_en: string;
    fasting_rules_ua: string;
    fasting_rules_en: string;
  };
  vaishnava_festivals?: {
    name_ua: string;
    name_en: string;
    description_ua: string;
    description_en: string;
  };
  appearance_days?: {
    name_ua: string;
    name_en: string;
    description_ua: string;
    description_en: string;
    fasting_type: string;
  };
  sunrise_time: string;
  sunset_time: string;
  parana_start_time: string;
  parana_end_time: string;
}

interface UserProfile {
  email: string;
  display_name: string | null;
}

/**
 * Get tomorrow's date in YYYY-MM-DD format for a given timezone
 */
function getTomorrowDate(timezone: string): string {
  const now = new Date();
  // Add 24 hours to get tomorrow
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Format in the given timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formatter.format(tomorrow);
}

/**
 * Check if it's time to send notification for a user
 */
function isNotificationTime(notificationTime: string, timezone: string): boolean {
  const now = new Date();

  // Get current hour in user's timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    hour12: false,
  });

  const currentHour = parseInt(formatter.format(now), 10);

  // Parse notification_time (format: "HH:MM:SS" or "HH:MM")
  const [notifHour] = notificationTime.split(':').map(Number);

  // Check if current hour matches notification hour
  return currentHour === notifHour;
}

/**
 * Format event notification message
 */
function formatNotificationMessage(
  event: CalendarEvent,
  lang: 'ua' | 'en' = 'ua'
): { subject: string; body: string } {
  let eventName = '';
  let eventDescription = '';
  let fastingInfo = '';

  if (event.ekadashi_info) {
    eventName = lang === 'ua' ? event.ekadashi_info.name_ua : event.ekadashi_info.name_en;
    eventDescription = lang === 'ua'
      ? event.ekadashi_info.glory_text_ua
      : event.ekadashi_info.glory_text_en;
    fastingInfo = lang === 'ua'
      ? event.ekadashi_info.fasting_rules_ua
      : event.ekadashi_info.fasting_rules_en;
  } else if (event.vaishnava_festivals) {
    eventName = lang === 'ua'
      ? event.vaishnava_festivals.name_ua
      : event.vaishnava_festivals.name_en;
    eventDescription = lang === 'ua'
      ? event.vaishnava_festivals.description_ua
      : event.vaishnava_festivals.description_en;
  } else if (event.appearance_days) {
    eventName = lang === 'ua'
      ? event.appearance_days.name_ua
      : event.appearance_days.name_en;
    eventDescription = lang === 'ua'
      ? event.appearance_days.description_ua
      : event.appearance_days.description_en;
    fastingInfo = lang === 'ua'
      ? `Тип посту: ${event.appearance_days.fasting_type}`
      : `Fasting type: ${event.appearance_days.fasting_type}`;
  }

  // Format date
  const eventDate = new Date(event.event_date);
  const dateFormatted = eventDate.toLocaleDateString(lang === 'ua' ? 'uk-UA' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const subject = lang === 'ua'
    ? `Завтра: ${eventName}`
    : `Tomorrow: ${eventName}`;

  let body = lang === 'ua'
    ? `Шановний відданий,\n\nЗавтра, ${dateFormatted}, відбувається ${eventName}.\n\n`
    : `Dear devotee,\n\nTomorrow, ${dateFormatted}, is ${eventName}.\n\n`;

  if (eventDescription) {
    body += eventDescription + '\n\n';
  }

  if (fastingInfo) {
    body += (lang === 'ua' ? 'Правила посту:\n' : 'Fasting rules:\n') + fastingInfo + '\n\n';
  }

  // Add sunrise/parana info for Ekadashi
  if (event.ekadashi_info && event.sunrise_time && event.parana_start_time) {
    body += lang === 'ua'
      ? `Схід сонця: ${event.sunrise_time}\nПарана (переривання посту): ${event.parana_start_time} - ${event.parana_end_time}\n\n`
      : `Sunrise: ${event.sunrise_time}\nParana (breaking fast): ${event.parana_start_time} - ${event.parana_end_time}\n\n`;
  }

  body += lang === 'ua'
    ? 'Харе Крішна!\n\n— Ваш Вайшнавський Календар'
    : 'Hare Krishna!\n\n— Your Vaishnava Calendar';

  return { subject, body };
}

/**
 * Send email notification using Resend API
 */
async function sendEmailNotification(
  to: string,
  subject: string,
  body: string
): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');

  if (!resendApiKey) {
    console.warn('[notifications] RESEND_API_KEY not configured, skipping email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vaishnava Calendar <calendar@yourdomain.com>',
        to: [to],
        subject: subject,
        text: body,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[notifications] Resend API error:', error);
      return { success: false, error: `Email API error: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error('[notifications] Email send error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Main notification logic
 */
async function sendNotifications(): Promise<NotificationResult> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const result: NotificationResult = {
    sent: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  console.log('[notifications] Starting notification check...');

  // Get all users with notifications enabled
  const { data: userSettings, error: settingsError } = await supabase
    .from('user_calendar_settings')
    .select('*')
    .or('notify_ekadashi.eq.true,notify_festivals.eq.true');

  if (settingsError) {
    console.error('[notifications] Error fetching user settings:', settingsError);
    result.errors.push(`Settings fetch error: ${settingsError.message}`);
    return result;
  }

  if (!userSettings || userSettings.length === 0) {
    console.log('[notifications] No users with notifications enabled');
    return result;
  }

  console.log(`[notifications] Found ${userSettings.length} users with notifications enabled`);

  // Process each user
  for (const settings of userSettings as UserCalendarSettings[]) {
    const timezone = settings.custom_timezone || 'Europe/Kyiv';
    const notificationTime = settings.notification_time || '06:00:00';

    // Check if it's time to send notification for this user
    if (!isNotificationTime(notificationTime, timezone)) {
      result.skipped++;
      continue;
    }

    console.log(`[notifications] Processing user ${settings.user_id}`);

    // Get user email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
      settings.user_id
    );

    if (userError || !userData?.user?.email) {
      console.warn(`[notifications] Could not get email for user ${settings.user_id}`);
      result.skipped++;
      continue;
    }

    const userEmail = userData.user.email;
    const tomorrowDate = getTomorrowDate(timezone);

    // Get tomorrow's events for this user's location
    const { data: events, error: eventsError } = await supabase
      .from('calendar_events')
      .select(`
        id,
        event_date,
        ekadashi_id,
        festival_id,
        appearance_day_id,
        sunrise_time,
        sunset_time,
        parana_start_time,
        parana_end_time,
        ekadashi_info (
          name_ua,
          name_en,
          glory_text_ua,
          glory_text_en,
          fasting_rules_ua,
          fasting_rules_en
        ),
        vaishnava_festivals (
          name_ua,
          name_en,
          description_ua,
          description_en
        ),
        appearance_days (
          name_ua,
          name_en,
          description_ua,
          description_en,
          fasting_type
        )
      `)
      .eq('event_date', tomorrowDate)
      .eq('location_id', settings.location_id)
      .eq('is_published', true);

    if (eventsError) {
      console.error(`[notifications] Error fetching events for user ${settings.user_id}:`, eventsError);
      result.errors.push(`Events fetch error for ${settings.user_id}: ${eventsError.message}`);
      continue;
    }

    if (!events || events.length === 0) {
      result.skipped++;
      continue;
    }

    // Send notification for each relevant event
    for (const event of events as unknown as CalendarEvent[]) {
      // Check if user wants this type of notification
      const isEkadashi = !!event.ekadashi_id;
      const isFestival = !!event.festival_id || !!event.appearance_day_id;

      if (isEkadashi && !settings.notify_ekadashi) continue;
      if (isFestival && !settings.notify_festivals) continue;

      // Check if we already sent this notification
      const { data: existingLog } = await supabase
        .from('notification_logs')
        .select('id')
        .eq('user_id', settings.user_id)
        .eq('event_id', event.id)
        .maybeSingle();

      if (existingLog) {
        console.log(`[notifications] Already sent notification for event ${event.id} to user ${settings.user_id}`);
        result.skipped++;
        continue;
      }

      // Format and send notification
      const { subject, body } = formatNotificationMessage(event, 'ua');
      const emailResult = await sendEmailNotification(userEmail, subject, body);

      // Log the notification attempt
      const { error: logError } = await supabase.from('notification_logs').insert({
        user_id: settings.user_id,
        event_id: event.id,
        notification_type: isEkadashi ? 'ekadashi' : 'festival',
        channel: 'email',
        status: emailResult.success ? 'sent' : 'failed',
        error_message: emailResult.error || null,
      });

      if (logError) {
        console.error('[notifications] Error logging notification:', logError);
      }

      if (emailResult.success) {
        result.sent++;
        console.log(`[notifications] Sent notification to ${userEmail} for event ${event.id}`);
      } else {
        result.failed++;
        result.errors.push(`Failed to send to ${userEmail}: ${emailResult.error}`);
      }
    }
  }

  console.log('[notifications] Notification check complete:', result);
  return result;
}

/**
 * Validate admin authentication for HTTP requests
 */
async function validateAdminAuth(req: Request): Promise<{ isAdmin: boolean } | Response> {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }),
      { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user?.id) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Invalid token' }),
      { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }

  const userId = data.user.id;

  // Check admin role
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();

  if (roleError || !roleData) {
    return new Response(
      JSON.stringify({ error: 'Forbidden: Admin access required' }),
      { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }

  return { isAdmin: true };
}

// HTTP handler
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
    const result = await sendNotifications();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent ${result.sent} notifications, ${result.failed} failed, ${result.skipped} skipped`,
        ...result,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('[notifications] Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// Cron job: runs every hour to check each user's notification time in their timezone
Deno.cron('Send calendar notifications', '0 * * * *', async () => {
  console.log('[notifications] Running hourly notification check via cron...');

  try {
    const result = await sendNotifications();
    console.log('[notifications] Cron job result:', result);
  } catch (error) {
    console.error('[notifications] Cron job error:', error);
  }
});
