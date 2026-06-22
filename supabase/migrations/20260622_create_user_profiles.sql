-- Create user_profiles table in public schema
create table public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  phone text,
  company_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.user_profiles enable row level security;

-- Create RLS Policies
create policy "Users can view their own profile" on public.user_profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.user_profiles
  for update using (auth.uid() = id);

create policy "Users can insert their own profile" on public.user_profiles
  for insert with check (auth.uid() = id);

-- Function to handle user profile creation upon signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email, full_name, phone, company_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'company_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to run handle_new_user() after a new user insert in auth.users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
