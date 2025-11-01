import { createBrowserClient } from '@supabase/ssr'
import { Database } from './database.types'

export const createClient = () => 
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: 'sb-auth-token',
        path: '/',
        sameSite: 'lax',
        secure: false, // Set to true in production with HTTPS
      }
    }
  )

