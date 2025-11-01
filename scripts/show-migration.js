const fs = require('fs');
const path = require('path');

async function showMigration() {
  console.log('🚀 Notifications Migration SQL\n');
  console.log('Copy and paste this SQL into your Supabase SQL Editor:\n');
  console.log('=' .repeat(60));

  const migrationPath = path.join(__dirname, '../supabase/migrations/20250103000000_add_notifications_table.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

  console.log(migrationSQL);
  console.log('=' .repeat(60));
  console.log('\n� Supabase SQL Editor URL:');
  console.log('https://supabase.com/dashboard/project/ekhxvihpelhfnfhvheec/sql\n');
  console.log('⚠️  After applying, run: npm run build && npm run dev');
}

showMigration().catch(console.error);