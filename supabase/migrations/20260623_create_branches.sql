-- Create branches table in public schema
CREATE TABLE IF NOT EXISTS public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  map_link TEXT,
  image_url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
DROP POLICY IF EXISTS "Public can view branches" ON public.branches;
CREATE POLICY "Public can view branches" ON public.branches
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert branches" ON public.branches;
CREATE POLICY "Authenticated users can insert branches" ON public.branches
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update branches" ON public.branches;
CREATE POLICY "Authenticated users can update branches" ON public.branches
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete branches" ON public.branches;
CREATE POLICY "Authenticated users can delete branches" ON public.branches
  FOR DELETE USING (auth.role() = 'authenticated');

-- Seed default branch locations
INSERT INTO public.branches (branch_name, city, state, address, phone, email, map_link, image_url, description, display_order, is_active)
VALUES
(
  'European R&D Centre',
  'Munich',
  'Bavaria, Germany',
  '88 Karlstrasse, 80335 Munich',
  '+49 89 2389 440',
  'munich.hub@corporate-eco.com',
  'https://maps.google.com/?q=Karlstrasse+88,+Munich',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800',
  'Focused on automation systems engineering, cyber-physical stress testing, and European network distribution. Houses our specialized climate-simulation chambers.',
  1,
  true
),
(
  'Silicon Valley Innovation Hub',
  'Cupertino',
  'California, USA',
  '10200 Infinite Loop, Cupertino, CA 95014',
  '+1 (408) 555-0192',
  'siliconvalley@corporate-eco.com',
  'https://maps.google.com/?q=Infinite+Loop+10200,+Cupertino',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800',
  'Our primary software engineering node specializing in decentralized database routing, user interface accessibility, and AI model coordination.',
  2,
  true
),
(
  'Asian Logistics & IoT Terminal',
  'Tokyo',
  'Koto City, Japan',
  '3-1-1 Ariake, Koto City, Tokyo 135-0063',
  '+81 3-5500-1111',
  'tokyo.iot@corporate-eco.com',
  'https://maps.google.com/?q=Ariake+3-1-1,+Koto+City,+Tokyo',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800',
  'Specializes in hardware manufacturing optimization, low-latency drone delivery routing layers, and edge sensor manufacturing validations.',
  3,
  true
)
ON CONFLICT DO NOTHING;
