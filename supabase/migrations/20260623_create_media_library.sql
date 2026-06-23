-- Create media_library table in public schema
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  category TEXT,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
DROP POLICY IF EXISTS "Public can view media_library" ON public.media_library;
CREATE POLICY "Public can view media_library" ON public.media_library
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert media_library" ON public.media_library;
CREATE POLICY "Authenticated users can insert media_library" ON public.media_library
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update media_library" ON public.media_library;
CREATE POLICY "Authenticated users can update media_library" ON public.media_library
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete media_library" ON public.media_library;
CREATE POLICY "Authenticated users can delete media_library" ON public.media_library
  FOR DELETE USING (auth.role() = 'authenticated');

-- Seed default files if not present
INSERT INTO public.media_library (title, file_name, file_url, file_type, file_size, category, alt_text, display_order, is_active)
VALUES
(
  'Founder Mr. Sudhakar',
  'founder_sudhakar.jpg',
  '/images/founder_sudhakar.jpg',
  'image/jpeg',
  247808,
  'Images',
  'SKY7 Managing Director Mr. Sudhakar',
  1,
  true
),
(
  'Sky Seven Premium Water Bottling Layout',
  'sky_seven_water.jpg',
  '/images/sky_seven_water.jpg',
  'image/jpeg',
  189440,
  'Images',
  'Sky Seven Premium Water package thumbnail',
  2,
  true
)
ON CONFLICT DO NOTHING;
