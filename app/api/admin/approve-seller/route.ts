import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { sellerId } = await req.json()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: admin } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Approve seller
    const { error } = await supabase
      .from('users')
      .update({ verified: true })
      .eq('id', sellerId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Seller approval error:', error)
    return NextResponse.json(
      { error: 'Failed to approve seller' },
      { status: 500 }
    )
  }
}
