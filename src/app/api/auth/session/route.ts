import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { user: null, authenticated: false },
        { status: 200 }
      );
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          ...(profile || {}),
        },
        authenticated: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json(
      { user: null, authenticated: false },
      { status: 200 }
    );
  }
}

