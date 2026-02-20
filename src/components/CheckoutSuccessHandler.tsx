'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Checkout Success Handler Component
 * 
 * WHY THIS IS NEEDED:
 * - Server components can't reliably make async fetch calls
 * - We need client-side code to trigger sync and email
 * - Runs on page load to ensure sync happens
 * 
 * ARCHITECTURE FIX:
 * - This client component runs in the browser
 * - Makes API calls that actually work
 * - Provides proper error handling
 */
export default function CheckoutSuccessHandler() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    // Sync subscription
    const syncSubscription = async () => {
      setSyncStatus('syncing');
      try {
        console.log('🔄 Syncing subscription...');
        const response = await fetch('/api/subscription/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log('✅ Subscription synced successfully:', data);
          setSyncStatus('success');
        } else {
          console.error('❌ Sync failed:', data);
          setSyncStatus('error');
        }
      } catch (error) {
        console.error('❌ Sync error:', error);
        setSyncStatus('error');
      }
    };

    // Send email
    const sendEmail = async () => {
      setEmailStatus('sending');
      try {
        console.log('📧 Sending confirmation email...');
        const response = await fetch('/api/emails/send-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('✅ Email sent successfully:', data);
          setEmailStatus('success');
        } else {
          console.error('❌ Email send failed:', data);
          setEmailStatus('error');
        }
      } catch (error) {
        console.error('❌ Email error:', error);
        setEmailStatus('error');
      }
    };

    // Run both in parallel
    syncSubscription();
    sendEmail();
  }, [sessionId]);

  // This component doesn't render anything visible
  // It just handles the sync and email in the background
  return null;
}




