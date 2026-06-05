-- Migration 002: Add offer wizard fields to offers table
-- These columns support standalone wizard offers not linked to a properties row.

-- Standalone address for offers created without a linked property row
ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS address TEXT;

-- Listing price captured at the time the offer is created
ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS list_price INTEGER;

-- Denormalized address shown on the dashboard.
-- Populated by the trigger below: uses the linked property address when
-- property_id is set, otherwise falls back to the wizard-entered address.
ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS property_address TEXT;

-- Trigger function: resolve property_address on insert/update
CREATE OR REPLACE FUNCTION resolve_offer_property_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.property_id IS NOT NULL THEN
    SELECT p.address INTO NEW.property_address
      FROM public.properties p
     WHERE p.id = NEW.property_id;
  ELSE
    NEW.property_address := NEW.address;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to offers (fires before insert or update)
DROP TRIGGER IF EXISTS offers_resolve_property_address ON public.offers;
CREATE TRIGGER offers_resolve_property_address
  BEFORE INSERT OR UPDATE OF property_id, address
  ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION resolve_offer_property_address();

-- Back-fill property_address for any existing rows
UPDATE public.offers o
SET property_address = COALESCE(
      (SELECT p.address FROM public.properties p WHERE p.id = o.property_id),
      o.address
    );
