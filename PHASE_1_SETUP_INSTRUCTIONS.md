# Phase 1: Foundation & Database Setup - Setup Instructions

## 📋 Overview

This guide will help you complete Phase 1 setup: Stripe account, database migration, and environment variables.

---

## Step 1: Create Stripe Account & Get API Keys

### Detailed Guide
Follow the guide: **`STRIPE_ACCOUNT_SETUP_GUIDE.md`**

### Quick Steps:
1. Go to https://stripe.com and create account
2. Verify email
3. Go to Dashboard → Developers → API keys
4. Make sure **Test mode** is active (toggle in top right)
5. Copy **Publishable key** (`pk_test_...`)
6. Copy **Secret key** (`sk_test_...`)

### What You'll Get:
- ✅ Publishable Key: `pk_test_...`
- ✅ Secret Key: `sk_test_...`

**Save these keys** - you'll add them to `.env.local` in Step 3.

---

## Step 2: Run Database Migration

### Action Required

1. **Go to Supabase Dashboard**:
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**:
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New query"**

3. **Run Migration**:
   - Open file: `supabase/subscriptions_migration.sql`
   - Copy the **entire SQL script**
   - Paste into SQL Editor
   - Click **"Run"** (or press Ctrl+Enter)

4. **Verify Success**:
   - You should see "Success. No rows returned"
   - If you see a warning about "destructive operation", click **"Run this query"** (it's safe)

### Verify Tables Created

1. **Go to Table Editor**:
   - Click **"Table Editor"** in left sidebar

2. **Check Tables**:
   - ✅ `subscriptions` table should be visible
   - ✅ `payments` table should be visible

3. **Check Columns** (subscriptions table):
   - `id`, `user_id`, `stripe_subscription_id`, `stripe_customer_id`
   - `status`, `plan_type`, `price_amount`, `currency`
   - `trial_start`, `trial_end`, `current_period_start`, `current_period_end`
   - `cancel_at_period_end`, `created_at`, `updated_at`

4. **Check Columns** (payments table):
   - `id`, `subscription_id`, `stripe_payment_intent_id`
   - `amount`, `currency`, `status`
   - `paid_at`, `refunded_at`, `created_at`

---

## Step 3: Configure Environment Variables

### Action Required

1. **Open `.env.local` file** in your project root
   - If it doesn't exist, create it

2. **Add Stripe Keys**:
   ```env
   # Stripe Configuration (Test Mode)
   STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
   ```

3. **Replace Placeholders**:
   - Replace `YOUR_SECRET_KEY_HERE` with your actual Stripe Secret Key
   - Replace `YOUR_PUBLISHABLE_KEY_HERE` with your actual Stripe Publishable Key

4. **Save the file**

### Example `.env.local`:

```env
# Supabase Configuration (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend (already configured)
RESEND_API_KEY=your_resend_api_key

# Stripe Configuration (NEW - Test Mode)
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
```

---

## Step 4: Verify Installation

### Check Stripe Package

Run in terminal:
```bash
npm list stripe
```

**Expected**: Should show `stripe@x.x.x` (version number)

### Check Stripe Client

The Stripe client should initialize without errors. Test by starting dev server:
```bash
npm run dev
```

**Expected**: Server starts without Stripe-related errors

---

## ✅ Verification Checklist

### Stripe Setup
- [ ] Stripe account created
- [ ] Test mode API keys obtained
- [ ] Keys added to `.env.local`
- [ ] Stripe package installed (`npm list stripe`)

### Database Setup
- [ ] Migration script run in Supabase
- [ ] `subscriptions` table exists
- [ ] `payments` table exists
- [ ] RLS policies active
- [ ] Indexes created

### Code Setup
- [ ] Stripe client utility exists (`src/lib/stripe/client.ts`)
- [ ] Stripe utils exist (`src/lib/stripe/utils.ts`)
- [ ] TypeScript types updated (`src/types/database.ts`)

---

## 🧪 Quick Test

### Test Stripe Client Initialization

Create a test file (optional, for verification):

```typescript
// test-stripe.ts (temporary file, delete after testing)
import { getStripeClient, isTestMode } from '@/lib/stripe/client';

try {
  const stripe = getStripeClient();
  console.log('✅ Stripe client initialized');
  console.log('Test mode:', isTestMode());
} catch (error) {
  console.error('❌ Stripe client error:', error);
}
```

**Expected**: Should log "✅ Stripe client initialized" and "Test mode: true"

---

## 🐛 Troubleshooting

### Issue: "STRIPE_SECRET_KEY is missing"
**Solution**: Check `.env.local` file exists and has `STRIPE_SECRET_KEY` set

### Issue: Migration fails
**Solution**: 
- Check you're in the correct Supabase project
- Verify SQL script is complete
- Check for syntax errors in SQL

### Issue: Tables not visible
**Solution**:
- Refresh Supabase Table Editor
- Check if migration actually ran (look for success message)
- Verify you're looking at the correct project

### Issue: Stripe client error
**Solution**:
- Verify API keys are correct (start with `sk_test_` and `pk_test_`)
- Check keys are in `.env.local` (not `.env`)
- Restart dev server after adding keys

---

## 📝 Next Steps

Once Phase 1 is complete:

1. ✅ Stripe account created
2. ✅ Database tables created
3. ✅ Environment variables configured
4. ✅ Code files in place

**Ready for Phase 2**: Checkout Flow Implementation

---

## 📚 Additional Resources

- **Stripe Dashboard**: https://dashboard.stripe.com
- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Test Cards**: https://stripe.com/docs/testing

---

**Phase 1 Status**: ⏳ **In Progress**  
**Next**: Complete setup steps above, then proceed to Phase 2







