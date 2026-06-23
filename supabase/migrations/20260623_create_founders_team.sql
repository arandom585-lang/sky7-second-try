-- Create founders_team table in public schema
CREATE TABLE IF NOT EXISTS public.founders_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  bio TEXT,
  image_url TEXT NOT NULL,
  linkedin_url TEXT,
  email TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  display_order INTEGER DEFAULT 0 NOT NULL,
  is_founder BOOLEAN DEFAULT false NOT NULL,
  is_cofounder BOOLEAN DEFAULT false NOT NULL,
  is_leadership BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.founders_team ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
DROP POLICY IF EXISTS "Public can view founders_team" ON public.founders_team;
CREATE POLICY "Public can view founders_team" ON public.founders_team
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert founders_team" ON public.founders_team;
CREATE POLICY "Authenticated users can insert founders_team" ON public.founders_team
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update founders_team" ON public.founders_team;
CREATE POLICY "Authenticated users can update founders_team" ON public.founders_team
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete founders_team" ON public.founders_team;
CREATE POLICY "Authenticated users can delete founders_team" ON public.founders_team
  FOR DELETE USING (auth.role() = 'authenticated');

-- Seed default team data
INSERT INTO public.founders_team (name, role, department, bio, image_url, linkedin_url, email, social_links, display_order, is_founder, is_cofounder, is_leadership)
VALUES 
(
  'Mr. Sudhakar', 
  'Managing Director — SKY7', 
  NULL,
  'Mr. Sudhakar is a business leader focused on creating real opportunities and structured growth systems. He is passionate about empowering individuals and building a community of entrepreneurs to grow, earn, and achieve their dreams.', 
  '/images/founder_sudhakar.jpg', 
  'https://linkedin.com', 
  'info@sky7.com',
  '{}'::jsonb,
  1, 
  true, 
  false, 
  false
),
(
  'Sarah Jenkins', 
  'Co-Founder & Chief Operations', 
  'Operations',
  'Sarah oversees the expansion of our distributed branch networks and logistics optimization programs across six regions.', 
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600', 
  'https://linkedin.com', 
  'sarah@sky7.com',
  '{}'::jsonb,
  2, 
  false, 
  true, 
  false
),
(
  'Alex Chen', 
  'Lead Systems Architect', 
  'Technology',
  'Alex Chen is a dedicated Lead Systems Architect overseeing the corporate ecosystem branch networks, software pipelines, and edge validations.', 
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', 
  'https://linkedin.com', 
  'alex.chen@sky7.com',
  '{"twitter": "https://twitter.com"}'::jsonb,
  3, 
  false, 
  false, 
  true
),
(
  'Emily Davis', 
  'Head of Product Experience', 
  'Design',
  'Emily Davis oversees design consistency, front-end accessibility audits, and cohesive application layout architectures.', 
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', 
  'https://linkedin.com', 
  'emily.davis@sky7.com',
  '{}'::jsonb,
  4, 
  false, 
  false, 
  true
)
ON CONFLICT DO NOTHING;
