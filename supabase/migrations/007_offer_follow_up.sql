-- Add follow-up tracking column to offers table
-- (notes column already added in 005_offer_notes.sql)
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS followed_up_at TIMESTAMPTZ;

-- Extend the status CHECK constraint to include 'pending_response'
ALTER TABLE public.offers DROP CONSTRAINT IF EXISTS offers_status_check;
ALTER TABLE public.offers ADD CONSTRAINT offers_status_check
  CHECK (status IN ('draft', 'submitted', 'pending', 'pending_response', 'accepted', 'rejected', 'withdrawn'));
