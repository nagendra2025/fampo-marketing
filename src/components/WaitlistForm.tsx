'use client';

import { useState } from 'react';
import { ArrowRight, Check, Loader2, AlertCircle } from 'lucide-react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Successfully joined waitlist! Check your email for details.');
        setEmail(''); // Clear the input
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={status === 'loading'}
          className="flex-1 rounded-full border-2 border-white/20 bg-white/95 px-6 py-3.5 text-base font-medium text-zinc-900 placeholder:text-zinc-500 shadow-lg backdrop-blur-sm focus:border-white/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Email address for waitlist"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Joining...</span>
            </>
          ) : (
            <>
              Join Waitlist
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 flex-shrink-0" />
            <p className="font-medium">{message}</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="font-medium">{message}</p>
          </div>
        </div>
      )}

      <p className="text-sm text-blue-100">
        Early access • No spam • Unsubscribe anytime
      </p>
    </div>
  );
}


