-- Create team_members table in public schema
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('founder', 'co-founder', 'team_member')),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT NOT NULL,
  linkedin_url TEXT,
  email TEXT,
  department TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  display_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
DROP POLICY IF EXISTS "Public can view team members" ON public.team_members;
CREATE POLICY "Public can view team members" ON public.team_members
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert team members" ON public.team_members;
CREATE POLICY "Authenticated users can insert team members" ON public.team_members
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update team members" ON public.team_members;
CREATE POLICY "Authenticated users can update team members" ON public.team_members
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete team members" ON public.team_members;
CREATE POLICY "Authenticated users can delete team members" ON public.team_members
  FOR DELETE USING (auth.role() = 'authenticated');
