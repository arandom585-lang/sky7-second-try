import { createClient } from '@supabase/supabase-js';

const supabaseUrl = ((import.meta as any).env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = ((import.meta as any).env.VITE_SUPABASE_ANON_KEY as string) || '';


export const isSupabaseConfigured =
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== '' &&
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'));

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing or invalid. Falling back to simulated storage mode.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);
