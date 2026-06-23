-- Create missing tables in public schema

-- 1. home_content
CREATE TABLE IF NOT EXISTS public.home_content (
  id TEXT PRIMARY KEY DEFAULT 'home-default',
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  hero_description TEXT NOT NULL,
  partner_button_text TEXT NOT NULL,
  explore_button_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view home_content" ON public.home_content;
CREATE POLICY "Public can view home_content" ON public.home_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated admins can modify home_content" ON public.home_content;
CREATE POLICY "Authenticated admins can modify home_content" ON public.home_content FOR ALL USING (public.is_admin());

-- Seed default home_content
INSERT INTO public.home_content (
  id,
  hero_title,
  hero_subtitle,
  hero_description,
  partner_button_text,
  explore_button_text
) VALUES (
  'home-default',
  'Building the Future of Digital Connected Ecosystems',
  'A unified operational technology system for modern multi-sector industries.',
  'We integrate advanced machine intelligence, eco-friendly physical design, and secure distributed protocols. Our platform powers enterprise branches and products worldwide with zero performance compromises.',
  'Become a Partner',
  'Explore Opportunities'
) ON CONFLICT (id) DO NOTHING;


-- 2. about_content
CREATE TABLE IF NOT EXISTS public.about_content (
  id TEXT PRIMARY KEY DEFAULT 'about-default',
  about_title TEXT NOT NULL,
  about_description TEXT NOT NULL,
  ecosystem_title TEXT NOT NULL,
  ecosystem_description TEXT NOT NULL,
  opportunities_title TEXT NOT NULL,
  opportunities_description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view about_content" ON public.about_content;
CREATE POLICY "Public can view about_content" ON public.about_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated admins can modify about_content" ON public.about_content;
CREATE POLICY "Authenticated admins can modify about_content" ON public.about_content FOR ALL USING (public.is_admin());

-- Seed default about_content
INSERT INTO public.about_content (
  id,
  about_title,
  about_description,
  ecosystem_title,
  ecosystem_description,
  opportunities_title,
  opportunities_description
) VALUES (
  'about-default',
  'Innovating at Global Scale',
  'Founded with the mission to bridge heavy industry with quantum-safe automation, our firm leads enterprise infrastructure evolution. We deploy highly resilient software layers, hardware modules, and strategic partnerships to secure operations on six continents.',
  'Dividends of a Connected Network',
  'The Unified Ecosystem operates continuously from data harvesting up to high-executive decision engines. By joining our connected platform, regional branches operate with local speed while benefiting from collective network learning and shared market resources.',
  'Ecosystem Venture Initiatives',
  'We actively co-develop projects spanning high-performance IoT grids, grid-level thermal management systems, and smart industrial complexes. Partners gain direct APIs to our pre-built software stack, physical testing yards, and immediate co-marketing programs.'
) ON CONFLICT (id) DO NOTHING;


-- 3. contacts
CREATE TABLE IF NOT EXISTS public.contacts (
  id TEXT PRIMARY KEY DEFAULT 'contact-default',
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  address TEXT NOT NULL,
  facebook TEXT,
  twitter TEXT,
  instagram TEXT,
  linkedin TEXT,
  youtube TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view contacts" ON public.contacts;
CREATE POLICY "Public can view contacts" ON public.contacts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated admins can modify contacts" ON public.contacts;
CREATE POLICY "Authenticated admins can modify contacts" ON public.contacts FOR ALL USING (public.is_admin());

-- Seed default contacts
INSERT INTO public.contacts (
  id,
  email,
  phone,
  whatsapp_number,
  address,
  facebook,
  twitter,
  instagram,
  linkedin,
  youtube
) VALUES (
  'contact-default',
  'info@sky7.com',
  '+91 XXXXX XXXXX',
  '919999999999',
  'Tamil Nadu, India',
  'https://facebook.com',
  'https://twitter.com',
  'https://instagram.com',
  'https://linkedin.com',
  'https://youtube.com'
) ON CONFLICT (id) DO NOTHING;


-- 4. success_stories
CREATE TABLE IF NOT EXISTS public.success_stories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  achievement TEXT NOT NULL,
  image TEXT NOT NULL,
  stars INTEGER NOT NULL DEFAULT 5 CHECK (stars >= 1 AND stars <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view success_stories" ON public.success_stories;
CREATE POLICY "Public can view success_stories" ON public.success_stories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated admins can modify success_stories" ON public.success_stories;
CREATE POLICY "Authenticated admins can modify success_stories" ON public.success_stories FOR ALL USING (public.is_admin());

-- Seed default success_stories
INSERT INTO public.success_stories (id, name, achievement, image, stars)
VALUES
('s1', 'Kenji Takahashi', 'Franchise Owner', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', 5),
('s2', 'Amanda Seyfried', 'MacBook Achiever', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', 5),
('s3', 'David Beckham', 'Pool Achiever', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200', 5),
('s4', 'Emily Watson', 'Elite Achiever', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', 5),
('s5', 'Chris Evans', 'Franchise Owner', 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=200', 5),
('s6', 'Natalie Portman', 'MacBook Achiever', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200', 5)
ON CONFLICT (id) DO NOTHING;


-- 5. contact_submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Partner', 'Investor', 'Customer', 'Other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit contact form" ON public.contact_submissions;
CREATE POLICY "Public can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admins can view contact submissions" ON public.contact_submissions;
CREATE POLICY "Authenticated admins can view contact submissions" ON public.contact_submissions FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated admins can delete contact submissions" ON public.contact_submissions;
CREATE POLICY "Authenticated admins can delete contact submissions" ON public.contact_submissions FOR DELETE USING (public.is_admin());
