import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Logout API Route
 * 
 * WHY: Handles user logout and redirects to home page
 * - Signs out user from Supabase Auth
 * - Redirects to home page instead of showing JSON
 * - Provides better user experience
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      // Even if there's an error, redirect to home page
      // This ensures user doesn't see error JSON
      return NextResponse.redirect(new URL('/', request.url));
    }

    // WHY: Redirect to home page after successful logout
    // This provides better UX than showing JSON response
    // User is automatically taken back to marketing page
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Logout API error:', error);
    // Even on unexpected errors, redirect to home page
    // Prevents user from seeing error JSON
    return NextResponse.redirect(new URL('/', request.url));
  }
}

