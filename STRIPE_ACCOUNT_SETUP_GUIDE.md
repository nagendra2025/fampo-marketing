# Stripe Account Setup Guide

## 🎯 Goal

Create a Stripe account and get your Test Mode API keys for Phase 1 implementation.

---

## 📋 Step-by-Step Instructions

### Step 1: Create Stripe Account

1. **Go to Stripe Website**:
   - Visit: https://stripe.com
   - Click **"Start now"** or **"Sign up"** button (top right)

2. **Sign Up**:
   - Enter your email address
   - Create a password
   - Click **"Create account"**

3. **Verify Email**:
   - Check your email inbox
   - Click the verification link from Stripe
   - Complete email verification

4. **Complete Account Setup**:
   - Fill in basic information:
     - Business name: "Fampo" (or your business name)
     - Country: Canada (or your country)
     - Business type: Select appropriate option
   - Click **"Continue"**

---

### Step 2: Access Stripe Dashboard

1. **Log In**:
   - Go to: https://dashboard.stripe.com
   - Log in with your credentials

2. **Dashboard Overview**:
   - You'll see the Stripe Dashboard
   - Notice the **"Test mode"** toggle in the top right
   - Make sure it says **"Test mode"** (not "Live mode")

---

### Step 3: Get Test Mode API Keys

1. **Navigate to API Keys**:
   - In the left sidebar, click **"Developers"**
   - Click **"API keys"** (under Developers)

2. **Find Test Mode Keys**:
   - You should see **"Test mode"** section (with toggle showing "Test mode")
   - If you see "Live mode", click the toggle to switch to **"Test mode"**

3. **Get Publishable Key**:
   - Find **"Publishable key"** (starts with `pk_test_...`)
   - Click **"Reveal test key"** or copy the key
   - **Save this key** - you'll need it for `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

4. **Get Secret Key**:
   - Find **"Secret key"** (starts with `sk_test_...`)
   - Click **"Reveal test key"** or click **"Reveal"** button
   - **Save this key** - you'll need it for `STRIPE_SECRET_KEY`
   - ⚠️ **Important**: Keep this key secret! Never share it publicly.

---

### Step 4: Verify Test Mode

1. **Check Mode Toggle**:
   - Top right of dashboard should show **"Test mode"**
   - If it shows "Live mode", click to switch to Test mode

2. **Test Mode Indicators**:
   - Test mode keys start with `pk_test_` and `sk_test_`
   - Live mode keys start with `pk_live_` and `sk_live_`
   - Make sure you're copying **test mode** keys

---

## 📝 What You'll Need

After completing setup, you'll have:

1. **Publishable Key**: `pk_test_...`
   - Used in: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Safe to use in frontend code

2. **Secret Key**: `sk_test_...`
   - Used in: `STRIPE_SECRET_KEY`
   - ⚠️ **Keep secret** - only use in backend/server code

---

## ✅ Verification Checklist

- [ ] Stripe account created
- [ ] Email verified
- [ ] Dashboard accessible
- [ ] Test mode is active (toggle shows "Test mode")
- [ ] Publishable key copied (`pk_test_...`)
- [ ] Secret key copied (`sk_test_...`)
- [ ] Keys saved securely (ready to add to `.env.local`)

---

## 🔒 Security Notes

### Test Mode Keys
- ✅ Safe to use in development
- ✅ No real charges
- ✅ Can be used with test cards
- ✅ Can be committed to git (if needed for team)

### Live Mode Keys (Future)
- ⚠️ **Never commit to git**
- ⚠️ Only use in production
- ⚠️ Keep extremely secure
- ⚠️ Use environment variables in Vercel

---

## 🧪 Test Cards (For Later Testing)

Once Phase 2 is complete, you can use these test cards:

| Card Number | Scenario | Result |
|------------|----------|--------|
| `4242 4242 4242 4242` | Success | Payment succeeds |
| `4000 0000 0000 0002` | Card Declined | Payment fails |
| `4000 0000 0000 9995` | Insufficient Funds | Payment fails |

**Test Card Details**:
- Expiry: Any future date (e.g., 12/25, 01/26)
- CVC: Any 3 digits (e.g., 123, 456)
- ZIP: Any postal code (e.g., 12345)

---

## 📋 Next Steps

After getting your API keys:

1. **Add to `.env.local`**:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

2. **Continue with Phase 1**:
   - Database migration
   - Stripe utility functions
   - TypeScript types

---

## 🆘 Troubleshooting

### Can't find API keys?
- Make sure you're in **Test mode** (toggle in top right)
- Go to: Developers → API keys
- Click "Reveal" buttons to show keys

### Account setup incomplete?
- Complete all required fields in account setup
- Verify your email address
- Add business information if prompted

### Need help?
- Stripe Support: https://support.stripe.com
- Stripe Documentation: https://stripe.com/docs

---

## ✅ Ready?

Once you have your Test Mode API keys, let me know and we'll continue with Phase 1!

**Status**: ⏳ **Waiting for Stripe account setup**







