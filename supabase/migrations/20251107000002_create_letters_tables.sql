-- Create letters table for storing Srila Prabhupada's letters
CREATE TABLE public.letters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE, -- 'letter-to-mahatma-gandhi'
  recipient_en TEXT NOT NULL,
  recipient_ua TEXT,
  letter_date DATE NOT NULL,
  location_en TEXT NOT NULL,
  location_ua TEXT,
  reference TEXT, -- '47-07-12' - vedabase reference
  address_block TEXT, -- Recipient's address
  content_en TEXT NOT NULL,
  content_ua TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_letters_date ON public.letters(letter_date DESC);
CREATE INDEX idx_letters_recipient ON public.letters(recipient_en);
CREATE INDEX idx_letters_location ON public.letters(location_en);
CREATE INDEX idx_letters_reference ON public.letters(reference);

-- Enable RLS on letters table
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for letters (public read, admin write)
CREATE POLICY "Anyone can view letters"
  ON public.letters FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert letters"
  ON public.letters FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update letters"
  ON public.letters FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete letters"
  ON public.letters FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_letters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at
CREATE TRIGGER update_letters_updated_at_trigger
  BEFORE UPDATE ON public.letters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_letters_updated_at();
