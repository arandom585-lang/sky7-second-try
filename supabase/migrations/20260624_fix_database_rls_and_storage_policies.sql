-- 1. Add role column to user_profiles if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'role') THEN
    ALTER TABLE public.user_profiles ADD COLUMN role TEXT DEFAULT 'user' NOT NULL;
  END IF;
END $$;

-- 2. Define secure admin checking function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    COALESCE(
      (
        SELECT role FROM public.user_profiles
        WHERE id = auth.uid()
      ),
      'user'
    ) = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Trigger to prevent client sessions from updating their own roles
CREATE OR REPLACE FUNCTION public.protect_user_role()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NEW.role IS DISTINCT FROM OLD.role THEN
    -- Only allow role update if the calling session is an admin
    IF NOT public.is_admin() THEN
      NEW.role := OLD.role;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS protect_user_role_trigger ON public.user_profiles;
CREATE TRIGGER protect_user_role_trigger
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE PROCEDURE public.protect_user_role();

-- 4. Secure the new user trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, phone, company_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'company_name', ''),
    CASE 
      WHEN new.email = 'admin@corporate.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure seeded admin is updated with the admin role in profiles
INSERT INTO public.user_profiles (id, email, full_name, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@corporate.com', 'SKY SEVEN Admin', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 5. Harden RLS policies for audited tables

-- public.branches
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can insert branches" ON public.branches;
DROP POLICY IF EXISTS "Authenticated users can update branches" ON public.branches;
DROP POLICY IF EXISTS "Authenticated users can delete branches" ON public.branches;
DROP POLICY IF EXISTS "Public can view branches" ON public.branches;

CREATE POLICY "Public can view branches" ON public.branches FOR SELECT USING (true);
CREATE POLICY "Authenticated admins can insert branches" ON public.branches FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated admins can update branches" ON public.branches FOR UPDATE USING (public.is_admin());
CREATE POLICY "Authenticated admins can delete branches" ON public.branches FOR DELETE USING (public.is_admin());

-- public.contact_details
ALTER TABLE public.contact_details ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view contact_details" ON public.contact_details;
DROP POLICY IF EXISTS "Authenticated users can update contact_details" ON public.contact_details;

CREATE POLICY "Public can view contact_details" ON public.contact_details FOR SELECT USING (true);
CREATE POLICY "Authenticated admins can modify contact_details" ON public.contact_details FOR ALL USING (public.is_admin());

-- public.founders_team
ALTER TABLE public.founders_team ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view founders_team" ON public.founders_team;
DROP POLICY IF EXISTS "Authenticated users can insert founders_team" ON public.founders_team;
DROP POLICY IF EXISTS "Authenticated users can update founders_team" ON public.founders_team;
DROP POLICY IF EXISTS "Authenticated users can delete founders_team" ON public.founders_team;

CREATE POLICY "Public can view founders_team" ON public.founders_team FOR SELECT USING (true);
CREATE POLICY "Authenticated admins can insert founders_team" ON public.founders_team FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated admins can update founders_team" ON public.founders_team FOR UPDATE USING (public.is_admin());
CREATE POLICY "Authenticated admins can delete founders_team" ON public.founders_team FOR DELETE USING (public.is_admin());

-- public.media_library
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view media_library" ON public.media_library;
DROP POLICY IF EXISTS "Authenticated users can insert media_library" ON public.media_library;
DROP POLICY IF EXISTS "Authenticated users can update media_library" ON public.media_library;
DROP POLICY IF EXISTS "Authenticated users can delete media_library" ON public.media_library;

CREATE POLICY "Public can view media_library" ON public.media_library FOR SELECT USING (true);
CREATE POLICY "Authenticated admins can insert media_library" ON public.media_library FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated admins can update media_library" ON public.media_library FOR UPDATE USING (public.is_admin());
CREATE POLICY "Authenticated admins can delete media_library" ON public.media_library FOR DELETE USING (public.is_admin());

-- public.products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Authenticated admins can insert products" ON public.products FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated admins can update products" ON public.products FOR UPDATE USING (public.is_admin());
CREATE POLICY "Authenticated admins can delete products" ON public.products FOR DELETE USING (public.is_admin());

-- public.testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can delete testimonials" ON public.testimonials;

CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Authenticated admins can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated admins can update testimonials" ON public.testimonials FOR UPDATE USING (public.is_admin());
CREATE POLICY "Authenticated admins can delete testimonials" ON public.testimonials FOR DELETE USING (public.is_admin());

-- public.website_settings
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view website_settings" ON public.website_settings;
DROP POLICY IF EXISTS "Authenticated admins can insert website_settings" ON public.website_settings;
DROP POLICY IF EXISTS "Authenticated admins can update website_settings" ON public.website_settings;
DROP POLICY IF EXISTS "Authenticated admins can delete website_settings" ON public.website_settings;

CREATE POLICY "Public can view website_settings" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated admins can insert website_settings" ON public.website_settings FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Authenticated admins can update website_settings" ON public.website_settings FOR UPDATE USING (public.is_admin());
CREATE POLICY "Authenticated admins can delete website_settings" ON public.website_settings FOR DELETE USING (public.is_admin());

-- 6. Harden Supabase Storage Policies
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated Insert" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;

CREATE POLICY "Admin Insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('founders-images', 'branch-images', 'product-images', 'gallery-images') 
    AND public.is_admin()
  );

CREATE POLICY "Admin Update" ON storage.objects
  FOR UPDATE USING (
    bucket_id IN ('founders-images', 'branch-images', 'product-images', 'gallery-images') 
    AND public.is_admin()
  );

CREATE POLICY "Admin Delete" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('founders-images', 'branch-images', 'product-images', 'gallery-images') 
    AND public.is_admin()
  );
