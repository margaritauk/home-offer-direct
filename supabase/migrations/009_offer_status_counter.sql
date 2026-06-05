-- Add 'counter' to the offers status CHECK constraint
-- Without this, PATCH /api/offers/[id]/status with status='counter' fails at DB level

ALTER TABLE public.offers DROP CONSTRAINT IF EXISTS offers_status_check;

ALTER TABLE public.offers ADD CONSTRAINT offers_status_check
  CHECK (status IN (
    'draft', 'submitted', 'pending', 'pending_response',
    'accepted', 'rejected', 'counter', 'withdrawn', 'cancelled'
  ));
