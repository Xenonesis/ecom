import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
      return NextResponse.json(
        { error: `User profile not found: ${profileError.message}` },
        { status: 404 }
      )
    }

    if (!profile) {
      console.error('No profile found for user:', user.id)
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Check if user is already a seller
    if (profile.role === 'seller' || profile.role === 'admin') {
      return NextResponse.json(
        { error: 'User is already a seller or admin' },
        { status: 400 }
      )
    }

    // Update user role to seller
    // Note: updated_at will be automatically set by the database trigger
    const { data: updatedProfile, error: updateError } = await supabase
      .from('users')
      .update({ 
        role: 'seller'
      })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating user role:', updateError)
      return NextResponse.json(
        { error: 'Failed to update user role' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Successfully switched to seller account',
      profile: updatedProfile
    })
  } catch (error) {
    console.error('Error in switch-to-seller:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
