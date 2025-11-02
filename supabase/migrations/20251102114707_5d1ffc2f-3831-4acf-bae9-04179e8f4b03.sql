-- Create highlights table for storing text selections
CREATE TABLE public.highlights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID NOT NULL,
  canto_id UUID,
  chapter_id UUID NOT NULL,
  verse_id UUID,
  verse_number TEXT,
  selected_text TEXT NOT NULL,
  context_before TEXT,
  context_after TEXT,
  highlight_color TEXT DEFAULT 'yellow',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;

-- Admins can manage all highlights
CREATE POLICY "Admins can manage highlights"
ON public.highlights
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own highlights
CREATE POLICY "Users can view own highlights"
ON public.highlights
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own highlights
CREATE POLICY "Users can insert own highlights"
ON public.highlights
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own highlights
CREATE POLICY "Users can update own highlights"
ON public.highlights
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own highlights
CREATE POLICY "Users can delete own highlights"
ON public.highlights
FOR DELETE
USING (auth.uid() = user_id);

-- Add index for faster queries
CREATE INDEX idx_highlights_user_id ON public.highlights(user_id);
CREATE INDEX idx_highlights_chapter_id ON public.highlights(chapter_id);
CREATE INDEX idx_highlights_created_at ON public.highlights(created_at DESC);

-- Update trigger for updated_at
CREATE TRIGGER update_highlights_updated_at
BEFORE UPDATE ON public.highlights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();