-- Migration to convert public.contact_details id from UUID to TEXT primary key safely

-- 1. Drop existing contact_details table (singleton settings configuration table)
DROP TABLE IF EXISTS public.contact_details CASCADE;

-- 2. Recreate contact_details table with TEXT type for ID
CREATE TABLE public.contact_details (
  id TEXT PRIMARY KEY DEFAULT 'contact-details-default',
  company_name TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  google_maps_url TEXT,
  website_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  youtube_url TEXT,
  business_hours TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.contact_details ENABLE ROW LEVEL SECURITY;

-- 4. Recreate security policies (adhering to public read and admin write limits)
CREATE POLICY "Public can view contact_details" ON public.contact_details
  FOR SELECT USING (true);

CREATE POLICY "Authenticated admins can modify contact_details" ON public.contact_details
  FOR ALL USING (public.is_admin());

-- 5. Seed default settings row if not present
INSERT INTO public.contact_details (
  id,
  company_name,
  phone,
  whatsapp,
  email,
  address,
  google_maps_url,
  website_url,
  facebook_url,
  instagram_url,
  linkedin_url,
  youtube_url,
  business_hours
) VALUES (
  'contact-details-default',
  'SKY SEVEN',
  '+91 XXXXX XXXXX',
  '919999999999',
  'info@sky7.com',
  'Tamil Nadu, India',
  'https://maps.google.com/?q=Tamil+Nadu,+India',
  'https://sky7.com',
  'https://facebook.com/sky7',
  'https://instagram.com/sky7',
  'https://linkedin.com/company/sky7',
  'https://youtube.com/sky7',
  'Mon - Sat: 9:00 AM - 6:00 PM'
) ON CONFLICT (id) DO NOTHING;
