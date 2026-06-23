-- Create testimonials table in public schema
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  company_name TEXT,
  designation TEXT,
  testimonial TEXT NOT NULL,
  profile_image_url TEXT,
  rating INTEGER DEFAULT 5 NOT NULL,
  display_order INTEGER DEFAULT 0 NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
DROP POLICY IF EXISTS "Public can view testimonials" ON public.testimonials;
CREATE POLICY "Public can view testimonials" ON public.testimonials
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert testimonials" ON public.testimonials;
CREATE POLICY "Authenticated users can insert testimonials" ON public.testimonials
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update testimonials" ON public.testimonials;
CREATE POLICY "Authenticated users can update testimonials" ON public.testimonials
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete testimonials" ON public.testimonials;
CREATE POLICY "Authenticated users can delete testimonials" ON public.testimonials
  FOR DELETE USING (auth.role() = 'authenticated');

-- Seed default testimonials
INSERT INTO public.testimonials (client_name, designation, company_name, rating, testimonial, profile_image_url, display_order, is_featured, is_active)
VALUES
(
  'Elena Rostova',
  'Franchise Owner',
  'Rostova Logistics',
  5,
  'The SKY7 ecosystem provided me with the structured business education and cashflow frameworks that allowed me to launch my own franchise branch within 9 months. The community support is absolutely unparalleled.',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800',
  1,
  true,
  true
),
(
  'Marcus Vance',
  'Elite Achiever',
  'Vance Corporate Systems',
  5,
  'Training under the SKY7 Foundation trainers changed how our team structures sales and leadership. We grew our distribution network by 120% in a single quarter.',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800',
  2,
  false,
  true
),
(
  'Sarah Jenkins',
  'Pool Achiever',
  'Jenkins Logistics Solutions',
  5,
  'As a distributor, the Utilities and E-Channelling benefits save my family significant monthly costs, allowing me to reinvest directly into my business growth.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800',
  3,
  false,
  true
)
ON CONFLICT DO NOTHING;
