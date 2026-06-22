-- Create user_profiles table in public schema
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safely add missing columns if the table already exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'phone') THEN
    ALTER TABLE public.user_profiles ADD COLUMN phone TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'company_name') THEN
    ALTER TABLE public.user_profiles ADD COLUMN company_name TEXT;
  END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to recreate them safely
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

-- Create RLS Policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to handle user profile creation upon signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, phone, company_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'company_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run handle_new_user() after a new user insert in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable pgcrypto extension for bcrypt password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Safe seeding / resetting of the admin account
DO $$
DECLARE
  admin_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Check if admin user exists in auth.users
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@corporate.com') THEN
    -- Update the password to 'admin123' and ensure role is 'admin'
    UPDATE auth.users
    SET encrypted_password = crypt('admin123', gen_salt('bf', 10)),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin", "full_name": "SKY SEVEN Admin"}'::jsonb,
        updated_at = now()
    WHERE email = 'admin@corporate.com';
  ELSE
    -- Insert the admin user with password 'admin123'
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role,
      created_at,
      updated_at
    )
    VALUES (
      admin_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@corporate.com',
      crypt('admin123', gen_salt('bf', 10)),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"role": "admin", "full_name": "SKY SEVEN Admin"}',
      'authenticated',
      'authenticated',
      now(),
      now()
    );
  END IF;
END $$;
