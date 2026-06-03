CREATE TABLE public.saved_searches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  label TEXT,
  price_min INTEGER,
  price_max INTEGER,
  min_beds INTEGER,
  property_types TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_searches_own" ON public.saved_searches
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
