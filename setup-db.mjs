import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = 'https://ekhxvihpelhfnfhvheec.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVraHh2aWhwZWxoZm5maHZoZWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NDA1NTIsImV4cCI6MjA3NzUxNjU1Mn0.7ulEjNFb2zbUmxtoA9tkSPDfCIclakiGZlxx-uotwVQ'

console.log('🚀 Setting up database...\n')

const supabase = createClient(supabaseUrl, supabaseKey)

// Read schema file
const schemaPath = join(__dirname, 'supabase', 'schema.sql')
const schema = readFileSync(schemaPath, 'utf8')

console.log('📝 Executing schema.sql...')
console.log('⚠️  Note: This uses the anon key, which may not have permissions for DDL.')
console.log('📌 Please run the SQL manually in Supabase Dashboard SQL Editor.\n')
console.log('Instructions:')
console.log('1. Go to: https://supabase.com/dashboard/project/ekhxvihpelhfnfhvheec/sql')
console.log('2. Click "New Query"')
console.log('3. Copy and paste the content from: supabase/schema.sql')
console.log('4. Click "Run"\n')

// Try to get tables to verify connection
const { data, error } = await supabase
  .from('products')
  .select('count')
  .limit(1)

if (error && error.code === '42P01') {
  console.log('❌ Tables not created yet. Please run schema.sql in Supabase Dashboard.')
} else if (error) {
  console.log('⚠️  Connection error:', error.message)
} else {
  console.log('✅ Database connection successful!')
  console.log('✅ Tables appear to be already set up!')
}

console.log('\n📖 See DATABASE_SETUP.md for detailed instructions.')
