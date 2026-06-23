-- Create products table in public schema
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  category TEXT,
  short_description TEXT,
  full_description TEXT,
  image_url TEXT,
  gallery_images JSONB DEFAULT '{}'::jsonb,
  brochure_url TEXT,
  display_order INTEGER DEFAULT 0 NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
CREATE POLICY "Authenticated users can insert products" ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
CREATE POLICY "Authenticated users can update products" ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;
CREATE POLICY "Authenticated users can delete products" ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Seed default product
INSERT INTO public.products (product_name, category, short_description, image_url, gallery_images, display_order, is_featured, is_active)
VALUES (
  'Sky Seven Premium Water',
  'Beverage',
  'Pure, refreshing, premium drinking water sourced and bottled to the highest standards. Experience ultimate hydration with a clean, crisp taste.',
  '/images/sky_seven_water.jpg',
  '{"price": "20 Rs", "partner_link": "/contact?subject=Product_Sky_Seven_Water", "features": ["100% Pure & Filtered", "Premium Quality Standards", "Clean & Refreshing Taste"], "specs": {"Capacity": "500 ml / 1 L", "Source": "Natural Springs", "Filtration": "Multi-stage Reverse Osmosis"}, "whatsapp_number": "14085550100"}'::jsonb,
  1,
  true,
  true
)
ON CONFLICT DO NOTHING;
