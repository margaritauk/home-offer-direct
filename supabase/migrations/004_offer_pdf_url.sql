-- Migration 004: Add pdf_url column to offers table
-- Stores the Supabase Storage public URL of the generated offer PDF.

ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS pdf_url TEXT;
