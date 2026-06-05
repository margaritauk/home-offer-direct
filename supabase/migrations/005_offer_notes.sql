-- Migration 005: Add notes column to offers table
-- Stores agent/counter-offer notes recorded when updating offer status.

ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS notes TEXT;
