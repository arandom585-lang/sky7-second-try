-- Create contact_details table in public schema
CREATE TABLE IF NOT EXISTS public.contact_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_details ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
DROP POLICY IF EXISTS "Public can view contact_details" ON public.contact_details;
CREATE POLICY "Public can view contact_details" ON public.contact_details
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can update contact_details" ON public.contact_details;
CREATE POLICY "Authenticated users can update contact_details" ON public.contact_details
  FOR ALL USING (auth.role() = 'authenticated');

-- Seed initial row
INSERT INTO public.contact_details (
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
) ON CONFLICT DO NOTHING;
