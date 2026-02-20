import Stripe from 'stripe';

// Initialize Stripe client
// Uses test mode keys by default (sk_test_...)
// Switch to live mode keys (sk_live_...) in production
export function getStripeClient(): Stripe {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY is missing. Please add it to your .env.local file.'
    );
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: '2026-01-28.clover',
    typescript: true,
  });
}

// Check if we're in test mode
export function isTestMode(): boolean {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  return stripeSecretKey?.startsWith('sk_test_') ?? false;
}







