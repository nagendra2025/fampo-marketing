import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password (minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // IMPORTANT: Sign out any existing session first to prevent showing wrong user
    // This ensures the new account is created with the correct email
    await supabase.auth.signOut();
    
    // Sign up the user with the email from the form
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(), // Ensure email is lowercase and trimmed
      password,
      options: {
        data: {
          full_name: fullName || null,
        },
        emailRedirectTo: `${request.nextUrl.origin}/dashboard`,
      },
    });

    if (authError) {
      console.error('Signup error:', authError);
      
      // Provide user-friendly error messages
      let errorMessage = authError.message || 'Failed to create account';
      
      if (authError.message?.toLowerCase().includes('rate limit') || 
          authError.message?.toLowerCase().includes('too many')) {
        errorMessage = 'Too many signup attempts. Please wait 1 hour and try again, or try logging in if you already have an account.';
      } else if (authError.message?.toLowerCase().includes('already registered') ||
                 authError.message?.toLowerCase().includes('user already')) {
        errorMessage = 'This email is already registered. Please try logging in instead.';
      } else if (authError.message?.toLowerCase().includes('email')) {
        errorMessage = 'There was an issue with the email address. Please check and try again.';
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Link waitlist entry if email exists in waitlist
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      const serviceClient = createServiceClient(supabaseUrl, supabaseServiceKey);
      
      // Update waitlist entry if exists
      const { data: waitlistEntry } = await serviceClient
        .from('waitlist')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (waitlistEntry) {
        await serviceClient
          .from('waitlist')
          .update({
            status: 'active',
            created_account_at: new Date().toISOString(),
          })
          .eq('email', email.toLowerCase());
      }
    }

    return NextResponse.json(
      {
        message: 'Account created successfully! Please check your email to verify your account.',
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

