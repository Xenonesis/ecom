import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ekhxvihpelhfnfhvheec.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVraHh2aWhwZWxoZm5maHZoZWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA0MDEyNDgsImV4cCI6MjA0NTk3NzI0OH0.WiPk1mNMLzPYglzLlOhRyy3P-MYuGwWJmakUIUbVYII'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔍 Checking policies on users table...\n')

// Query the pg_policies view to see policies
const { data, error } = await supabase.rpc('exec_sql', {
  sql: `SELECT policyname, cmd, qual::text, with_check::text 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'users';`
})

if (error) {
  console.log('❌ Error (expected - RPC not set up):', error.message)
  console.log('\nTrying alternative approach...\n')
  
  // Try direct query as service role would be needed for this
  console.log('Please check policies manually in Supabase Dashboard:')
  console.log('https://supabase.com/dashboard/project/ekhxvihpelhfnfhvheec/editor')
} else {
  console.log('Policies:', data)
}
