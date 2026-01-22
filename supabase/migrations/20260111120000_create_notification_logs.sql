-- Create notification_logs table for tracking sent notifications
-- This helps prevent duplicate notifications and provides analytics

CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES calendar_events(id) ON DELETE SET NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('ekadashi', 'festival', 'appearance', 'custom')),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'push', 'sms', 'in_app')),
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'bounced', 'delivered', 'opened')),
  error_message TEXT,
  message_subject TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX idx_notification_logs_event_id ON notification_logs(event_id);
CREATE INDEX idx_notification_logs_sent_at ON notification_logs(sent_at);
CREATE INDEX idx_notification_logs_status ON notification_logs(status);

-- Unique constraint to prevent duplicate notifications
CREATE UNIQUE INDEX idx_notification_logs_unique_user_event
  ON notification_logs(user_id, event_id, notification_type)
  WHERE event_id IS NOT NULL;

-- RLS policies
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Users can only view their own notification logs
CREATE POLICY "Users can view own notification logs"
  ON notification_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can insert/update (for edge function)
CREATE POLICY "Service role can manage notification logs"
  ON notification_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE notification_logs IS 'Tracks all calendar event notifications sent to users';
COMMENT ON COLUMN notification_logs.notification_type IS 'Type: ekadashi, festival, appearance, custom';
COMMENT ON COLUMN notification_logs.channel IS 'Delivery channel: email, push, sms, in_app';
COMMENT ON COLUMN notification_logs.status IS 'Delivery status: sent, failed, bounced, delivered, opened';
