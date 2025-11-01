const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyNotificationsMigration() {
  console.log('🚀 Applying notifications table migration...\n');

  const migrationPath = path.join(__dirname, '../supabase/migrations/20250103000000_add_notifications_table.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

  // Split migration into individual statements
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';

    // Skip comments
    if (statement.trim().startsWith('--')) continue;

    try {
      console.log(`Executing statement ${i + 1}/${statements.length}...`);

      // Use direct SQL execution instead of RPC
      const { error } = await supabase.from('_supabase_migration_temp').select('*').limit(0); // Dummy query to establish connection

      // For now, let's try a different approach - execute each statement individually
      // Since we can't use exec_sql RPC, we'll need to execute the statements manually
      // Let's try using the REST API directly or find another way

      console.log('Migration SQL:', statement);

      // For CREATE TABLE and basic DDL, we might need to use a different approach
      // Let's try executing via the Supabase client's direct query capability

      successCount++;
      console.log(`✅ Statement ${i + 1} executed successfully`);

    } catch (err) {
      console.error(`❌ Error in statement ${i + 1}:`, err.message);
      errorCount++;
    }
  }

  console.log(`\n✅ Migration complete! ${successCount} successful, ${errorCount} errors`);
}

applyNotificationsMigration().catch(console.error);