# Phase 2: Checkout Flow - Verification Checklist

## ✅ Implementation Status

**Phase 2**: ✅ **COMPLETE**

All code has been implemented. Use this checklist to verify everything works correctly.

---

## 📋 Pre-Testing Setup

### 1. Environment Variables
- [ ] `STRIPE_SECRET_KEY` is set in `.env.local` (test mode: `sk_test_...`)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set in `.env.local` (test mode: `pk_test_...`)
- [ ] Dev server can start without errors: `npm run dev`

### 2. Database
- [ ] `subscriptions` table exists (from Phase 1)
- [ ] `payments` table exists (from Phase 1)
- [ ] `waitlist` table has entries with `early_bird` field
- [ ] At least one waitlist entry with `early_bird = true` for testing

---

## 🧪 Testing Checklist

### Test 1: Authentication & Access Control

**Purpose**: Verify only authenticated users can access checkout

**Steps**:
1. [ ] Open browser in incognito/private mode
2. [ ] Navigate to `/checkout`
3. [ ] **Expected**: Should redirect to `/signup`
4. [ ] Sign up or log in
5. [ ] Navigate to `/checkout` again
6. [ ] **Expected**: Should load checkout page (not redirect)

**Status**: ⬜ Pass / ⬜ Fail

---

### Test 2: Checkout Page Loading

**Purpose**: Verify checkout page loads and shows loading state

**Steps**:
1. [ ] Sign in to your account
2. [ ] Navigate to `/checkout`
3. [ ] **Expected**: Should see loading spinner
4. [ ] **Expected**: Should see progress indicators:
   - ✅ "Verifying your account"
   - ✅ "Checking early bird eligibility"
   - ⏳ "Creating secure checkout session"
5. [ ] **Expected**: Should redirect to Stripe Checkout within 2-3 seconds

**Status**: ⬜ Pass / ⬜ Fail

---

### Test 3: Early Bird Pricing (User in Waitlist)

**Purpose**: Verify early bird users get $44 CAD/month pricing

**Prerequisites**:
- User's email exists in `waitlist` table
- `early_bird = true` for that email

**Steps**:
1. [ ] Sign in with email that's in waitlist with `early_bird = true`
2. [ ] Navigate to `/checkout`
3. [ ] Wait for redirect to Stripe Checkout
4. [ ] **Expected**: Should see **$44.00 CAD/month** in Stripe Checkout
5. [ ] **Expected**: Should see "2-month free trial" mentioned
6. [ ] **Expected**: Email should be pre-filled in Stripe form

**Status**: ⬜ Pass / ⬜ Fail

**Notes**: _________________________________

---

### Test 4: Regular Pricing (User Not in Waitlist)

**Purpose**: Verify non-waitlist users get $62 CAD/month pricing

**Prerequisites**:
- User's email does NOT exist in `waitlist` table (or `early_bird = false`)

**Steps**:
1. [ ] Sign in with email NOT in waitlist (or with `early_bird = false`)
2. [ ] Navigate to `/checkout`
3. [ ] Wait for redirect to Stripe Checkout
4. [ ] **Expected**: Should see **$62.00 CAD/month** in Stripe Checkout
5. [ ] **Expected**: Should see "2-month free trial" mentioned
6. [ ] **Expected**: Email should be pre-filled in Stripe form

**Status**: ⬜ Pass / ⬜ Fail

**Notes**: _________________________________

---

### Test 5: Trial Period Configuration

**Purpose**: Verify 2-month trial period is set correctly

**Steps**:
1. [ ] Complete Test 3 or Test 4 (reach Stripe Checkout)
2. [ ] Look for trial period information in Stripe Checkout
3. [ ] **Expected**: Should see "2-month free trial" or "60-day trial"
4. [ ] **Expected**: Trial end date should be approximately 2 months from today
5. [ ] Check Stripe Dashboard → Subscriptions → Verify trial period is 60 days

**Status**: ⬜ Pass / ⬜ Fail

**Notes**: _________________________________

---

### Test 6: Successful Payment Flow

**Purpose**: Verify complete payment flow works end-to-end

**Steps**:
1. [ ] Sign in to your account
2. [ ] Navigate to `/checkout`
3. [ ] Wait for redirect to Stripe Checkout
4. [ ] Enter test card: `4242 4242 4242 4242`
5. [ ] Enter any future expiry date (e.g., 12/25)
6. [ ] Enter any CVC (e.g., 123)
7. [ ] Enter any ZIP code (e.g., 12345)
8. [ ] Click "Subscribe" or "Pay" in Stripe
9. [ ] **Expected**: Should redirect to `/checkout/success`
10. [ ] **Expected**: Should see success message with:
    - ✅ "Welcome to Fampo! 🎉"
    - ✅ "Your subscription is active"
    - ✅ "2-Month Free Trial Started"
    - ✅ "Go to Dashboard" button
11. [ ] Click "Go to Dashboard"
12. [ ] **Expected**: Should navigate to `/dashboard`

**Status**: ⬜ Pass / ⬜ Fail

**Notes**: _________________________________

---

### Test 7: Cancel Flow

**Purpose**: Verify cancel flow works correctly

**Steps**:
1. [ ] Sign in to your account
2. [ ] Navigate to `/checkout`
3. [ ] Wait for redirect to Stripe Checkout
4. [ ] Click "Cancel" or "X" button in Stripe Checkout
5. [ ] **Expected**: Should redirect to `/checkout/cancel`
6. [ ] **Expected**: Should see cancel message:
    - "Checkout Cancelled"
    - "No charges were made to your account"
7. [ ] **Expected**: Should see two buttons:
    - "Try Checkout Again"
    - "Go to Dashboard"
8. [ ] Click "Try Checkout Again"
9. [ ] **Expected**: Should start checkout flow again

**Status**: ⬜ Pass / ⬜ Fail

**Notes**: _________________________________

---

### Test 8: Error Handling

**Purpose**: Verify error handling works correctly

**Test 8a: Network Error**
1. [ ] Sign in to your account
2. [ ] Open browser DevTools → Network tab
3. [ ] Set network to "Offline" or throttle to "Offline"
4. [ ] Navigate to `/checkout`
5. [ ] **Expected**: Should show error message after timeout
6. [ ] **Expected**: Should see "Try Again" button
7. [ ] Set network back to "Online"
8. [ ] Click "Try Again"
9. [ ] **Expected**: Should retry checkout

**Status**: ⬜ Pass / ⬜ Fail

**Test 8b: API Error**
1. [ ] Temporarily remove `STRIPE_SECRET_KEY` from `.env.local`
2. [ ] Restart dev server
3. [ ] Sign in and navigate to `/checkout`
4. [ ] **Expected**: Should show error message
5. [ ] Restore `STRIPE_SECRET_KEY` in `.env.local`
6. [ ] Restart dev server
7. [ ] **Expected**: Checkout should work normally

**Status**: ⬜ Pass / ⬜ Fail

---

### Test 9: Stripe Dashboard Verification

**Purpose**: Verify subscription appears in Stripe Dashboard

**Steps**:
1. [ ] Complete Test 6 (successful payment)
2. [ ] Go to Stripe Dashboard: https://dashboard.stripe.com
3. [ ] Make sure **Test mode** is active (toggle in top right)
4. [ ] Go to **Customers** → Find your test customer
5. [ ] **Expected**: Should see customer with your email
6. [ ] Go to **Subscriptions** → Find your subscription
7. [ ] **Expected**: Should see subscription with:
    - Status: "Trialing" or "Active"
    - Trial end date: ~2 months from now
    - Price: $44.00 CAD or $62.00 CAD (depending on early bird status)
8. [ ] Click on subscription → Check **Metadata**
9. [ ] **Expected**: Should see:
    - `user_id`: Your user ID
    - `user_email`: Your email
    - `is_early_bird`: "true" or "false"
    - `price_amount`: "4400" or "6200"

**Status**: ⬜ Pass / ⬜ Fail

**Notes**: _________________________________

---

## 🐛 Common Issues & Solutions

### Issue: "STRIPE_SECRET_KEY is missing"
**Solution**: 
- Check `.env.local` file exists
- Verify `STRIPE_SECRET_KEY` is set
- Restart dev server after adding key

### Issue: Redirect to Stripe fails
**Solution**:
- Check browser console for errors
- Verify API route is working: Check Network tab in DevTools
- Verify Stripe keys are correct (test mode keys)

### Issue: Wrong pricing shown
**Solution**:
- Check `waitlist` table for user's email
- Verify `early_bird` field is set correctly
- Check API logs for pricing calculation

### Issue: Trial period not showing
**Solution**:
- Verify `trial_period_days: 60` in API route
- Check Stripe Dashboard → Subscription → Trial end date
- Ensure subscription is in "Trialing" status

---

## ✅ Final Verification

### Code Files
- [x] `src/app/api/checkout/create-session/route.ts` - ✅ Created
- [x] `src/app/checkout/page.tsx` - ✅ Updated
- [x] `src/app/checkout/success/page.tsx` - ✅ Created
- [x] `src/app/checkout/cancel/page.tsx` - ✅ Created

### Functionality
- [ ] Authentication check works
- [ ] Early bird pricing works
- [ ] Regular pricing works
- [ ] Trial period is 60 days
- [ ] Success page displays correctly
- [ ] Cancel page displays correctly
- [ ] Error handling works

### Stripe Integration
- [ ] Checkout session creates successfully
- [ ] Redirect to Stripe works
- [ ] Payment completes successfully
- [ ] Subscription appears in Stripe Dashboard
- [ ] Metadata is stored correctly

---

## 📊 Test Results Summary

**Total Tests**: 9  
**Passed**: ___ / 9  
**Failed**: ___ / 9

**Overall Status**: ⬜ Ready for Phase 3 / ⬜ Needs Fixes

**Notes**: _________________________________

---

## 🚀 Ready for Phase 3?

Once all tests pass, Phase 2 is complete and ready for **Phase 3: Webhooks & Subscription Management**.

**Phase 2 Status**: ⬜ **COMPLETE** / ⬜ **NEEDS FIXES**

---

**Verification Date**: _______________  
**Verified By**: _______________




