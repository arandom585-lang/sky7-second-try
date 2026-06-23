-- Create buckets if they do not exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('founders-images', 'founders-images', true),
  ('branch-images', 'branch-images', true),
  ('product-images', 'product-images', true),
  ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid duplicate conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Insert" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;

-- Policy for Select (Public Access)
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id IN ('founders-images', 'branch-images', 'product-images', 'gallery-images'));

-- Policy for Authenticated Insert
CREATE POLICY "Authenticated Insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('founders-images', 'branch-images', 'product-images', 'gallery-images') 
    AND auth.role() = 'authenticated'
  );

-- Policy for Authenticated Update
CREATE POLICY "Authenticated Update" ON storage.objects
  FOR UPDATE USING (
    bucket_id IN ('founders-images', 'branch-images', 'product-images', 'gallery-images') 
    AND auth.role() = 'authenticated'
  );

-- Policy for Authenticated Delete
CREATE POLICY "Authenticated Delete" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('founders-images', 'branch-images', 'product-images', 'gallery-images') 
    AND auth.role() = 'authenticated'
  );
