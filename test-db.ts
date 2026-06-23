import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from the workspace .env file
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key length:', supabaseAnonKey.length);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in env!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tables = [
  'branches',
  'products',
  'founders_team',
  'testimonials',
  'website_settings',
  'contact_details',
  'user_profiles',
  'home_content',
  'about_content',
  'contacts',
  'success_stories',
  'contact_submissions'
];

async function runAudit() {
  console.log('--- STARTING DATABASE TABLES AUDIT ---');
  for (const table of tables) {
    try {
      const { data, error, status } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`[FAIL] Table: ${table} | Status: ${status} | Error Code: ${error.code} | Message: ${error.message} | Details: ${error.details}`);
      } else {
        console.log(`[OK] Table: ${table} | Status: ${status} | Rows returned: ${data?.length || 0}`);
      }
    } catch (e: any) {
      console.log(`[EXC] Table: ${table} | Exception: ${e.message}`);
    }
  }
  console.log('--- AUDIT COMPLETED ---');
}

runAudit();
