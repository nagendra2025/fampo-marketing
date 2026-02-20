'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * Sync Subscription Button Component
 * 
 * WHY THIS IS NEEDED:
 * - Allows user to manually sync subscription if webhook failed
 * - Provides immediate feedback
 * - Shows sync status
 */
export default function SyncSubscriptionButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSync = async () => {
    setIsSyncing(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/subscription/sync', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Subscription synced successfully!');
        // Reload page after 1 second to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to sync subscription');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Syncing...' : 'Sync Subscription'}
      </button>
      
      {status === 'success' && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}
      
      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}




