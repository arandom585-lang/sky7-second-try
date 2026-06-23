import { db } from './src/supabaseService';
import * as dotenv from 'dotenv';

dotenv.config();

async function runTest() {
  console.log('--- TESTING SUPABASE SERVICE METHODS ---');
  
  const methods = [
    { name: 'getHomeContent', fn: () => db.getHomeContent() },
    { name: 'getAboutContent', fn: () => db.getAboutContent() },
    { name: 'getBranches(true)', fn: () => db.getBranches(true) },
    { name: 'getProducts(true)', fn: () => db.getProducts(true) },
    { name: 'getReviews(true)', fn: () => db.getReviews(true) },
    { name: 'getFounders', fn: () => db.getFounders() },
    { name: 'getTeamMembers', fn: () => db.getTeamMembers() },
    { name: 'getSuccessStories', fn: () => db.getSuccessStories() },
    { name: 'getContacts', fn: () => db.getContacts() },
    { name: 'getSettings', fn: () => db.getSettings() },
    { name: 'getMediaLibrary', fn: () => db.getMediaLibrary() },
    { name: 'getContactDetails', fn: () => db.getContactDetails() }
  ];

  for (const m of methods) {
    try {
      console.log(`Calling ${m.name}...`);
      const res = await m.fn();
      console.log(`[RESOLVED] ${m.name} returned type: ${typeof res} | Value:`, JSON.stringify(res).slice(0, 100) + '...');
    } catch (e: any) {
      console.error(`[REJECTED] ${m.name} threw error:`, e.message);
    }
  }

  console.log('--- TEST COMPLETED ---');
}

runTest();
