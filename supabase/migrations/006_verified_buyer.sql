-- Add identity verification columns to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS id_verified_at TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS id_document_path TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS proof_of_funds_path TEXT;

-- Create the identity-documents storage bucket (private)
INSERT INTO storage.buckets (id, name, public)
  VALUES ('identity-documents', 'identity-documents', false)
  ON CONFLICT DO NOTHING;

-- NOTE: Storage bucket RLS policies cannot be set via SQL migration in Supabase.
-- The following policies must be created manually in the Supabase dashboard
-- under Storage > identity-documents > Policies:
--
-- Policy 1 — "Users can upload their own documents"
--   Operation: INSERT
--   Target roles: authenticated
--   USING expression: (storage.foldername(name))[1] = auth.uid()::text
--
-- Policy 2 — "Users can read their own documents"
--   Operation: SELECT
--   Target roles: authenticated
--   USING expression: (storage.foldername(name))[1] = auth.uid()::text
--
-- Policy 3 — "Users can update their own documents"
--   Operation: UPDATE
--   Target roles: authenticated
--   USING expression: (storage.foldername(name))[1] = auth.uid()::text
--
-- Policy 4 — "Service role has full access" (for API route uploads via service key)
--   Operation: ALL
--   Target roles: service_role
--   USING expression: true
