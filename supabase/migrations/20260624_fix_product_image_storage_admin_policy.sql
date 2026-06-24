-- Ensure product image uploads work for authenticated admin dashboard users.

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('founders-images', 'founders-images', true),
  ('branch-images', 'branch-images', true),
  ('product-images', 'product-images', true),
  ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  profile_role TEXT;
  user_email TEXT;
  metadata_role TEXT;
  metadata_is_admin BOOLEAN;
BEGIN
  SELECT role
  INTO profile_role
  FROM public.user_profiles
  WHERE id = auth.uid();

  IF profile_role = 'admin' THEN
    RETURN TRUE;
  END IF;

  SELECT
    email,
    raw_user_meta_data->>'role',
    CASE
      WHEN lower(COALESCE(raw_user_meta_data->>'is_admin', 'false')) = 'true' THEN TRUE
      ELSE FALSE
    END
  INTO user_email, metadata_role, metadata_is_admin
  FROM auth.users
  WHERE id = auth.uid();

  RETURN user_email = 'admin@corporate.com'
    OR metadata_role = 'admin'
    OR metadata_is_admin = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

INSERT INTO public.user_profiles (id, email, full_name, role)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', ''), 'admin'
FROM auth.users
WHERE email = 'admin@corporate.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin',
    email = EXCLUDED.email,
    updated_at = timezone('utc'::text, now());

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Insert" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
DROP POLICY IF EXISTS "Admin Insert" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (
    bucket_id IN ('founders-images', 'branch-images', 'product-images', 'gallery-images')
  );

CREATE POLICY "Admin Insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('founders-images', 'branch-images', 'product-images', 'gallery-images')
    AND public.is_admin()
  );

CREATE POLICY "Admin Update" ON storage.objects
  FOR UPDATE USING (
    bucket_id IN ('founders-images', 'branch-images', 'product-images', 'gallery-images')
    AND public.is_admin()
  )
  WITH CHECK (
    bucket_id IN ('founders-images', 'branch-images', 'product-images', 'gallery-images')
    AND public.is_admin()
  );

CREATE POLICY "Admin Delete" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('founders-images', 'branch-images', 'product-images', 'gallery-images')
    AND public.is_admin()
  );
