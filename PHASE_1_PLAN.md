# Phase 1: Foundation & Database Setup - Implementation Plan

## 📋 Overview

**Phase 1 Goal**: Set up the foundation for Stripe payment integration by creating the database schema, installing dependencies, and configuring Stripe.

**Estimated Time**: 1-2 days  
**Dependencies**: Phase 0 (Authentication) ✅ Complete

---

## 🎯 Phase 1 Objectives

1. Install Stripe SDK
2. Create Stripe account and get API keys
3. Create database schema for subscriptions and payments
4. Set up Stripe utility functions
5. Configure environment variables
6. Create TypeScript types for Stripe

---

## 📝 Detailed Steps

### Step 1: Install Stripe SDK ✅/❌

**Action**: Install Stripe package

```bash
npm install stripe
```

**What it does**:
- Adds Stripe SDK to project
- Enables Stripe API integration

**Deliverable**: Stripe package installed in `package.json`

---

### Step 2: Create Stripe Account & Get API Keys ✅/❌

**Action**: Set up Stripe account (if not already done)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create account (or sign in if exists)
3. Get **Test Mode** API keys:
   - **Publishable Key** (`pk_test_...`)
   - **Secret Key** (`sk_test_...`)

**What it does**:
- Provides Stripe API access
- Test mode allows safe testing without real charges

**Deliverable**: Stripe API keys ready

**Note**: We'll use **Test Mode** keys for development, then switch to **Live Mode** keys for production.

---

### Step 3: Create Database Schema ✅/❌

**Action**: Create database tables for subscriptions and payments

#### Tables to Create:

1. **`subscriptions` table**:
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, references profiles.id)
   - `stripe_subscription_id` (TEXT, unique)
   - `stripe_customer_id` (TEXT)
   - `status` (TEXT: active, trialing, past_due, cancelled, etc.)
   - `plan_type` (TEXT: 'family')
   - `price_amount` (INTEGER: in cents, e.g., 4400 = $44 CAD)
   - `currency` (TEXT: 'CAD')
   - `trial_start` (TIMESTAMP)
   - `trial_end` (TIMESTAMP)
   - `current_period_start` (TIMESTAMP)
   - `current_period_end` (TIMESTAMP)
   - `cancel_at_period_end` (BOOLEAN)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

2. **`payments` table**:
   - `id` (UUID, Primary Key)
   - `subscription_id` (UUID, references subscriptions.id)
   - `stripe_payment_intent_id` (TEXT, unique)
   - `amount` (INTEGER: in cents)
   - `currency` (TEXT: 'CAD')
   - `status` (TEXT: succeeded, failed, pending)
   - `paid_at` (TIMESTAMP)
   - `created_at` (TIMESTAMP)

**What it does**:
- Stores subscription data
- Tracks payment history
- Links subscriptions to users

**Deliverable**: SQL migration file (`supabase/subscriptions_migration.sql`)

---

### Step 4: Set Up Row Level Security (RLS) ✅/❌

**Action**: Create RLS policies for subscriptions and payments

**Policies Needed**:
- Users can read their own subscriptions
- Users can read their own payments
- Service role can insert/update (for webhooks)

**What it does**:
- Secures subscription data
- Ensures users only see their own data

**Deliverable**: RLS policies in migration file

---

### Step 5: Create Stripe Utility Functions ✅/❌

**Action**: Create helper functions for Stripe operations

**Files to Create**:
- `src/lib/stripe/client.ts` - Stripe client initialization
- `src/lib/stripe/utils.ts` - Helper functions

**Functions Needed**:
- `getStripeClient()` - Initialize Stripe client
- `formatAmountForStripe()` - Convert CAD to cents
- `formatAmountFromStripe()` - Convert cents to CAD
- `isTestMode()` - Check if in test mode

**What it does**:
- Centralizes Stripe configuration
- Provides reusable utility functions

**Deliverable**: Stripe utility files created

---

### Step 6: Environment Variables Setup ✅/❌

**Action**: Add Stripe environment variables

**Variables to Add**:
```env
# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Optional: Site URL for redirects
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**What it does**:
- Configures Stripe API access
- Keeps keys secure (not in code)

**Deliverable**: `.env.local` updated with Stripe keys

---

### Step 7: Create TypeScript Types ✅/❌

**Action**: Define TypeScript types for subscriptions and payments

**Types to Create**:
- `Subscription` interface
- `Payment` interface
- `StripeSubscriptionStatus` type
- `PaymentStatus` type

**What it does**:
- Type safety for subscription data
- Better IDE autocomplete
- Prevents type errors

**Deliverable**: Types added to `src/types/database.ts`

---

### Step 8: Update Database Types ✅/❌

**Action**: Update database TypeScript types

**What it does**:
- Adds subscription and payment types to database schema
- Enables type-safe database queries

**Deliverable**: Updated `src/types/database.ts`

---

## 📊 Phase 1 Deliverables

### Code Files
- [ ] `package.json` - Stripe dependency added
- [ ] `supabase/subscriptions_migration.sql` - Database schema
- [ ] `src/lib/stripe/client.ts` - Stripe client
- [ ] `src/lib/stripe/utils.ts` - Utility functions
- [ ] `src/types/database.ts` - Updated types

### Configuration
- [ ] `.env.local` - Stripe API keys added
- [ ] Stripe account created (test mode)
- [ ] Database tables created
- [ ] RLS policies configured

### Documentation
- [ ] Phase 1 setup guide
- [ ] Stripe account setup instructions
- [ ] Database schema documentation
- [ ] Environment variables guide

---

## 🧪 Verification Steps

After Phase 1 completion, you should be able to:

1. ✅ Stripe package installed (`npm list stripe`)
2. ✅ Stripe client initializes without errors
3. ✅ Database tables exist in Supabase
4. ✅ RLS policies are active
5. ✅ Environment variables are set
6. ✅ TypeScript types are defined

---

## 🔄 What Happens After Phase 1

**Phase 2**: Checkout Flow
- Create Stripe Checkout Session
- Handle early bird pricing logic
- Set up 2-month trial period
- Redirect to Stripe Checkout

**Phase 3**: Webhook Handling
- Handle Stripe webhook events
- Sync subscription status
- Record payments

**Phase 4**: Subscription Management
- User dashboard for subscriptions
- Cancel subscription flow
- Payment history

**Phase 5**: Trial & Early Bird Logic
- Trial period enforcement
- Early bird cutoff date logic
- Grace period handling

---

## ⚠️ Important Notes

### Stripe Test Mode
- We'll use **Test Mode** keys (`sk_test_`, `pk_test_`)
- Test cards: `4242 4242 4242 4242` (success)
- No real charges in test mode
- Switch to Live Mode only after thorough testing

### Database Migration
- Migration will be run in Supabase SQL Editor
- Tables will be created with proper indexes
- RLS policies will secure the data

### Environment Variables
- Test keys will be used in development
- Production keys will be set in Vercel later
- Never commit API keys to git

---

## 📋 Phase 1 Checklist

### Setup
- [ ] Stripe account created
- [ ] Stripe test API keys obtained
- [ ] Stripe SDK installed
- [ ] Environment variables configured

### Database
- [ ] `subscriptions` table created
- [ ] `payments` table created
- [ ] RLS policies configured
- [ ] Indexes created for performance

### Code
- [ ] Stripe client utility created
- [ ] Stripe helper functions created
- [ ] TypeScript types defined
- [ ] Database types updated

### Documentation
- [ ] Setup guide created
- [ ] Stripe configuration documented
- [ ] Database schema documented

---

## ✅ Ready to Proceed?

**Before starting Phase 1, please confirm**:

1. ✅ You have or will create a Stripe account
2. ✅ You understand we'll use Test Mode keys first
3. ✅ You're ready to run database migrations
4. ✅ You understand the database schema we'll create

**Once you confirm, I'll proceed with Phase 1 implementation!**

---

**Phase 1 Status**: ⏳ **PENDING CONFIRMATION**







