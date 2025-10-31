import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ekhxvihpelhfnfhvheec.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVraHh2aWhwZWxoZm5maHZoZWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NDA1NTIsImV4cCI6MjA3NzUxNjU1Mn0.7ulEjNFb2zbUmxtoA9tkSPDfCIclakiGZlxx-uotwVQ'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🧪 Testing Backend Setup...\n')

// Test 1: Check products
const { data: products, error: productsError } = await supabase
  .from('products')
  .select('id, name, category, price')
  .limit(5)

if (productsError) {
  console.log('❌ Products Error:', productsError.message)
} else {
  console.log(`✅ Products Table: Found ${products.length} products`)
  products.forEach(p => console.log(`   - ${p.name} ($${p.price})`))
}

// Test 2: Check tables exist
const tables = ['users', 'products', 'orders', 'reviews', 'cart', 'wishlist']
console.log('\n📊 Checking Tables:')

for (const table of tables) {
  const { error } = await supabase.from(table).select('count').limit(1)
  if (error) {
    console.log(`   ❌ ${table}: ${error.message}`)
  } else {
    console.log(`   ✅ ${table}: OK`)
  }
}

console.log('\n🎉 Backend Setup Complete!')
console.log('\nNext Steps:')
console.log('1. Sign up a user via /signup')
console.log('2. Browse products at /products')
console.log('3. Test cart functionality')
console.log('4. Leave product reviews\n')
