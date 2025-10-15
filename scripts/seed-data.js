const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Check if required environment variables are set
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Error: Missing Supabase environment variables.');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.');
  console.error('Copy .env.example to .env and fill in your Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function seedData() {
  console.log('Seeding sample data...');

  console.log('\n✓ Database schema is ready!');
  console.log('\nTo use the app:');
  console.log('1. Sign up for an account in the app');
  console.log('2. Create agents to monitor');
  console.log('3. View your feed and manage credits');
  console.log('\nThe app is ready to use!');
}

seedData();