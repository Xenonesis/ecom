import { createBrowserClient } from '@supabase/ssr'
import { Database } from './database.types'

// Lazy, env-safe browser client factory. Avoids throwing during build/SSG.
export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    // In the browser, this will surface a clear error when actually used.
    // During static build, simply avoid evaluating by not calling createClient.
    throw new Error(
      '@supabase/ssr: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Ensure these are set in your environment.'
    )
  }

  return createBrowserClient<Database>(url, anon)
}
