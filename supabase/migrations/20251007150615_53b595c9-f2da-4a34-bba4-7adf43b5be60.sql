-- Add new fields to books table for dynamic library management
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS display_category text CHECK (display_category IN ('classics', 'small')) DEFAULT 'classics',
ADD COLUMN IF NOT EXISTS purchase_url text;