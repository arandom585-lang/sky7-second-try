-- Create website_settings table in public schema
CREATE TABLE IF NOT EXISTS public.website_settings (
  id TEXT PRIMARY KEY DEFAULT 'settings-default',
  company_name TEXT NOT NULL,
  logo_url TEXT,
  favicon_url TEXT,
  theme_primary TEXT,
  theme_secondary TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Seed default settings row if not present
INSERT INTO public.website_settings (
  id,
  company_name,
  logo_url,
  favicon_url,
  theme_primary,
  theme_secondary,
  meta_title,
  meta_description
) VALUES (
  'settings-default',
  'SKY SEVEN',
  '/images/sky7_logo_premium.jpg',
  '',
  '#0B1B3D',
  '#C5A043',
  'SKY SEVEN - Corporate Ecosystem',
  'Building the Future of Digital Connected Ecosystems'
) ON CONFLICT (id) DO NOTHING;
