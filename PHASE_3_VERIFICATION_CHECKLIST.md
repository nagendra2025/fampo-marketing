# Phase 3: Verification Checklist

## ✅ Implementation Status

**Phase 3**: ✅ **CODE COMPLETE**

All code has been implemented. Use this checklist to verify everything works correctly.

---

## 📋 Pre-Testing Setup

### 1. Environment Variables
- [ ] `STRIPE_WEBHOOK_SECRET` is set in `.env.local`
- [ ] Webhook secret starts with `whsec_...`
- [ ] All other environment variables are set (from Phase 1 & 2)

### 2. Stripe Webhook Configuration
- [ ] Webhook endpoint created in Stripe Dashboard
- [ ] Endpoint URL: `https://your-domain.com/api/webhooks/stripe` (or localhost for dev)
- [ ] 6 events selected:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.payment_succeeded`
  - [ ] `invoice.payment_failed`

### 3. Database
- [ ] `subscriptions` table exists (from Phase 1)
- [ ] `payments` table exists (from Phase 1)
- [ ] RLS policies allow service role writes

---

## 🧪 Testing Checklist

### Test 1: Webhook Endpoint Setup

**Purpose**: Verify webhook endpoint is configured correctly

**Steps**:
1. [ ] Go to Stripe Dashboard → Developers → Webhooks
2. [ ] Verify webhook endpoint exists
3. [ ] Check endpoint URL is correct
4. [ ] Verify 6 events are selected
5. [ ] Copy webhook signing secret
6. [ ] Add to `.env.local` as `STRIPE_WEBHOOK_SECRET`
7. [ ] Restart dev server

**Status**: ⬜ Pass / ⬜ Fail

**Notes**: _________________________________

---

### Test 2: Database Sync After Checkout

**Purpose**: Verify subscription data syncs to database after checkout

**Steps**:
1. [ ] Sign in to your account
2. [ ] Navigate to `/checkout`
3. [ ] Complete checkout with test card (`4242 4242 4242 4242`)
4. [ ] Wait 5-10 seconds for webhook to process
5. [ ] Go to Supabase Dashboard → Table Editor
6. [ ] Check `subscriptions` table
7. [ ] **Expected**: Should see new subscription record with:
    - `user_id`: Your user ID
    - `stripe_subscription_id`: Subscription ID from Stripe
    - `status`: "trialing" or "active"
    - `price_amount`: 4400 (early bird) or 6200 (regular)
    - `trial_end`: Date 60 days from now

**Status**: ⬜ Pass / ⬜ Fail

**Notes**: _________________________________

---

### Test 3: Email Confirmation

**Purpose**: Verify confirmation email is sent after checkout

**Steps**:
1. [ ] Complete checkout (from Test 2)
2. [ ] Check email inbox
3. [ ] **Expected**: Should receive email from `hello@fampo-marketing.com`
4. [ ] **Expected**: Subject: "🎉 Welcome to Fampo - Your Subscription is Active!"
5. [ ] **Expected**: Email contains:
    - Subscription details
    - Trial end date
    - Monthly price
    - Dashboard link

**Status**: ⬜ Pass / ⬜ Fail

**Notes**: _________________________________

**If email not received**:
- [ ] Check spam/junk folder
- [ ] Check Resend Dashboard → Emails → View sent emails
- [ ] Verify `RESEND_API_KEY` is set
- [ ] Verify domain is verified in Resend

---

### Test 4: Dashboard Subscription Status

**Purpose**: Verify dashboard displays subscription status correctly

**Steps**:
1. [ ] Complete checkout (from Test 2)
2. [ ] Wait for webhook to sync (5-10 seconds)
3. [ ] Navigate to `/dashboard`
4. [ ] **Expected**: Should see "Subscription Status" card
5. [ ] **Expected**: Should show:
    - Status: "Trialing" or "Active"
    - Plan: "Family Plan"
    - Monthly Price: "$44.00 CAD" or "$62.00 CAD"
    - Trial End Date: Date 60 days from checkout
    - Days Remaining: ~60 days

**Status**: ⬜ Pass / ⬜ Fail

**Notes**: _________________________________

---

### Test 5: Payment History Display

**Purpose**: Verify payment history displays in dashboard

**Note**: Payments are recorded when trial ends or subscription renews. For testing, you can manually trigger a payment in Stripe Dashboard.

**Steps**:
1. [ ] Go to Stripe Dashboard → Subscriptions
2. [ ] Find your test subscription
3. [ ] Manually create a test invoice (optional, for testing)
4. [ ] Wait for webhook to process
5. [ ] Go to `/dashboard`
6. [ ] **Expected**: Should see "Payment History" section
7. [ ] **Expected**: Should show payment with:
    - Amount
    - Date
    - Status: "succeeded"

**Status**: ⬜ Pass / ⬜ Fail

**Notes**: _________________________________

---

### Test 6: Webhook Event Processing

**Purpose**: Verify webhook processes different events correctly

**Test 6a: checkout.session.completed**
1. [ ] Complete checkout
2. [ ] Check Stripe Dashboard → Webhooks → Your endpoint → Events
3. [ ] **Expected**: Should see `checkout.session.completed` event
4. [ ] **Expected**: Event status: "Succeeded"
5. [ ] Check database → Subscription should be created

**Status**: ⬜ Pass / ⬜ Fail

**Test 6b: customer.subscription.updated**
1. [ ] Go to Stripe Dashboard → Subscriptions
2. [ ] Find your subscription
3. [ ] Update subscription (e.g., change status)
4. [ ] Check webhook events
5. [ ] **Expected**: Should see `customer.subscription.updated` event
6. [ ] Check database → Subscription should be updated

**Status**: ⬜ Pass / ⬜ Fail

**Test 6c: invoice.payment_succeeded**
1. [ ] Create test invoice in Stripe (or wait for trial to end)
2. [ ] Check webhook events
3. [ ] **Expected**: Should see `invoice.payment_succeeded` event
4. [ ] Check database → Payment should be recorded in `payments` table

**Status**: ⬜ Pass / ⬜ Fail

---

### Test 7: No Subscription State

**Purpose**: Verify dashboard handles users without subscription

**Steps**:
1. [ ] Sign in with account that has no subscription
2. [ ] Navigate to `/dashboard`
3. [ ] **Expected**: Should see "No Active Subscription" message
4. [ ] **Expected**: Should see "Subscribe Now" button
5. [ ] Click "Subscribe Now"
6. [ ] **Expected**: Should redirect to `/checkout`

**Status**: ⬜ Pass / ⬜ Fail

**Notes**: _________________________________

---

### Test 8: Error Handling

**Purpose**: Verify error handling works correctly

**Test 8a: Missing Webhook Secret**
1. [ ] Temporarily remove `STRIPE_WEBHOOK_SECRET` from `.env.local`
2. [ ] Restart dev server
3. [ ] Trigger webhook event
4. [ ] **Expected**: Should see error in logs
5. [ ] Restore webhook secret

**Status**: ⬜ Pass / ⬜ Fail

**Test 8b: Invalid Webhook Signature**
1. [ ] Send test request to webhook endpoint with invalid signature
2. [ ] **Expected**: Should return 400 error
3. [ ] **Expected**: Should not process event

**Status**: ⬜ Pass / ⬜ Fail

---

## 📊 Test Results Summary

**Total Tests**: 8  
**Passed**: ___ / 8  
**Failed**: ___ / 8

**Overall Status**: ⬜ Ready for Production / ⬜ Needs Fixes

**Notes**: _________________________________

---

## 🐛 Common Issues & Solutions

### Issue: Webhook not receiving events
**Solution**:
- Check webhook URL is correct
- Verify webhook is enabled
- Check webhook secret is set
- Use Stripe CLI for local testing

### Issue: Database not updating
**Solution**:
- Check webhook events in Stripe Dashboard
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check server logs for errors
- Verify RLS policies

### Issue: Email not sending
**Solution**:
- Check `RESEND_API_KEY` is set
- Verify domain is verified
- Check Resend Dashboard for logs
- Check spam folder

### Issue: Dashboard shows no subscription
**Solution**:
- Wait for webhook to process (5-10 seconds)
- Check database for subscription record
- Verify user_id matches
- Refresh dashboard page

---

## ✅ Final Verification

### Code Files
- [x] `src/app/api/webhooks/stripe/route.ts` - ✅ Created
- [x] `src/app/api/emails/send-confirmation/route.ts` - ✅ Created
- [x] `src/app/checkout/success/page.tsx` - ✅ Updated
- [x] `src/app/dashboard/page.tsx` - ✅ Updated

### Functionality
- [ ] Webhook endpoint works
- [ ] Database syncs after checkout
- [ ] Email confirmation sent
- [ ] Dashboard shows subscription
- [ ] Payment history displays
- [ ] Error handling works

### Setup
- [ ] Webhook configured in Stripe
- [ ] Webhook secret set
- [ ] Environment variables configured
- [ ] All tests pass

---

## 🚀 Ready for Production?

Once all tests pass, Phase 3 is complete and ready for production!

**Phase 3 Status**: ⬜ **COMPLETE** / ⬜ **NEEDS FIXES**

---

**Verification Date**: _______________  
**Verified By**: _______________




