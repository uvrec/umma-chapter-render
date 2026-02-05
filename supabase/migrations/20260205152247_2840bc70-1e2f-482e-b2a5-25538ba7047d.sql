-- Fix chat_sessions RLS policy to explicitly handle NULL user_id cases
-- Drop existing policy
DROP POLICY IF EXISTS "Users can manage own sessions" ON public.chat_sessions;

-- Create improved policy that explicitly handles NULL user_id
CREATE POLICY "Users can manage own sessions"
  ON public.chat_sessions
  FOR ALL
  TO authenticated
  USING (
    user_id IS NOT NULL 
    AND user_id = auth.uid()
  )
  WITH CHECK (
    user_id IS NOT NULL 
    AND user_id = auth.uid()
  );