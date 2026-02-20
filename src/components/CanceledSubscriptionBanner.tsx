'use client';

import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

/**
 * Canceled Subscription Banner Component
 * 
 * WHY THIS IS A CLIENT COMPONENT:
 * - Prevents hydration errors by handling subscription check on client
 * - Can use useEffect to check subscription status after mount
 * - Ensures consistent rendering between server and client
 */
export default function CanceledSubscriptionBanner() {
  return (
    <div className="mb-4 mx-auto max-w-2xl rounded-lg bg-red-50 border border-red-200 p-4 text-left">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-900 mb-1">
            Your subscription has been canceled
          </p>
          <p className="text-sm text-red-700 mb-3">
            Want to subscribe again? Click "Get Started" below to start a new subscription.
          </p>
        </div>
      </div>
    </div>
  );
}


