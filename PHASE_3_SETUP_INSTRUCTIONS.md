# Phase 3: Setup Instructions

## 📋 Overview

Phase 3 requires setting up Stripe webhooks to sync subscription data to your database. Follow these steps to complete the setup.

---

## Step 1: Get Stripe Webhook Secret

### For Production (Vercel/Deployed Site):

1. **Go to Stripe Dashboard**:
   - Visit: https://dashboard.stripe.com
   - Make sure **Test mode** is active (for testing)

2. **Navigate to Webhooks**:
   - Click **"Developers"** in left sidebar
   - Click **"Webhooks"**

3. **Create Webhook Endpoint**:
   - Click **"Add endpoint"** or **"Add webhook"**
   - **Endpoint URL**: `https://your-domain.com/api/webhooks/stripe`
     - Replace `your-domain.com` with your actual domain
     - Example: `https://fampo-marketing.com/api/webhooks/stripe`
   - **Description**: "Fampo Subscription Webhooks"

4. **Select Events to Listen To**:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

5. **Save and Get Secret**:
   - Click **"Add endpoint"** or **"Save"**
   - Click on the webhook endpoint you just created
   - Find **"Signing secret"** section
   - Click **"Reveal"** or **"Click to reveal"**
   - Copy the secret (starts with `whsec_...`)

6. **Add to Environment Variables**:
   - Add to `.env.local`:
     ```env
     STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
     ```
   - Add to Vercel (if deployed):
     - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
     - Add `STRIPE_WEBHOOK_SECRET` with your secret value

---

### For Local Development (Stripe CLI):

1. **Install Stripe CLI**:
   - Download from: https://stripe.com/docs/stripe-cli
   - Or install via package manager:
     ```bash
     # macOS
     brew install stripe/stripe-cli/stripe
     
     # Windows (using Scoop)
     scoop install stripe
     ```

2. **Login to Stripe CLI**:
   ```bash
   stripe login
   ```
   - This opens browser to authenticate

3. **Forward Webhooks to Local Server**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   - This will output a webhook signing secret
   - Copy the secret (starts with `whsec_...`)

4. **Add to `.env.local`**:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_LOCAL_SECRET_HERE
   ```

5. **Keep Stripe CLI Running**:
   - Keep the `stripe listen` command running in a terminal
   - It will forward webhook events to your local server

---

## Step 2: Verify Environment Variables

Check that all required variables are set in `.env.local`:

```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend (already configured)
RESEND_API_KEY=your_resend_api_key

# Stripe (already configured)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Webhook (NEW - Phase 3)
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Step 3: Test Webhook Endpoint

### Test 1: Verify Endpoint is Accessible

1. **Start Dev Server**:
   ```bash
   npm run dev
   ```

2. **Check Endpoint**:
   - Webhook endpoint should be at: `http://localhost:3000/api/webhooks/stripe`
   - Note: This endpoint only accepts POST requests from Stripe

### Test 2: Test with Stripe CLI (Local)

1. **Trigger Test Event**:
   ```bash
   stripe trigger checkout.session.completed
   ```

2. **Check Logs**:
   - Should see webhook processing in terminal
   - Check database for subscription record

### Test 3: Test with Real Checkout (Production)

1. **Complete Checkout**:
   - Go through checkout flow
   - Complete payment with test card

2. **Check Database**:
   - Go to Supabase Dashboard → Table Editor
   - Check `subscriptions` table → Should have new record
   - Check `payments` table → Should have payment record (after trial ends)

3. **Check Dashboard**:
   - Go to `/dashboard`
   - Should see subscription status
   - Should see trial end date

---

## Step 4: Verify Email Confirmation

### Test Email Sending:

1. **Complete Checkout**:
   - Go through checkout flow
   - Complete payment

2. **Check Email**:
   - Check inbox for confirmation email
   - Email should come from `hello@fampo-marketing.com`
   - Subject: "🎉 Welcome to Fampo - Your Subscription is Active!"

3. **Verify Email Content**:
   - Should include subscription details
   - Should show trial end date
   - Should have dashboard link

### Troubleshooting Email:

- **Email not received**:
  - Check spam/junk folder
  - Verify `RESEND_API_KEY` is set
  - Check Resend Dashboard → Emails → View sent emails
  - Verify domain is verified in Resend

---

## Step 5: Verify Dashboard UI

### Test Dashboard:

1. **Go to Dashboard**:
   - Navigate to `/dashboard`
   - Should see subscription status card

2. **Check Subscription Status**:
   - Should show "Trialing" or "Active" status
   - Should show plan type (Family Plan)
   - Should show monthly price
   - Should show trial end date (if in trial)

3. **Check Payment History**:
   - Should show payment history (if payments exist)
   - Payments appear after trial ends

4. **Check Account Information**:
   - Should show email
   - Should show full name (if set)
   - Should show account creation date

---

## ✅ Verification Checklist

### Setup:
- [ ] Stripe webhook endpoint created
- [ ] Webhook secret obtained
- [ ] `STRIPE_WEBHOOK_SECRET` added to `.env.local`
- [ ] Webhook events selected (6 events)
- [ ] Environment variables verified

### Testing:
- [ ] Webhook endpoint accessible
- [ ] Test event processed successfully
- [ ] Database syncs after checkout
- [ ] Email confirmation sent
- [ ] Dashboard shows subscription status
- [ ] Payment history displays correctly

---

## 🐛 Common Issues

### Issue: Webhook not receiving events
**Solution**:
- Verify webhook URL is correct
- Check webhook secret is set correctly
- Ensure webhook is enabled in Stripe Dashboard
- Check webhook logs in Stripe Dashboard

### Issue: Database not updating
**Solution**:
- Check webhook is receiving events (Stripe Dashboard → Webhooks → Your endpoint → Events)
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check server logs for errors
- Verify RLS policies allow service role writes

### Issue: Email not sending
**Solution**:
- Check `RESEND_API_KEY` is set
- Verify domain is verified in Resend
- Check Resend Dashboard for email logs
- Check server logs for errors

---

## 📝 Next Steps

Once setup is complete:

1. ✅ Test checkout flow end-to-end
2. ✅ Verify database sync
3. ✅ Check email confirmation
4. ✅ Test dashboard UI
5. ✅ Monitor webhook events in Stripe Dashboard

---

**Setup Status**: ⏳ **IN PROGRESS**  
**Next**: Complete setup steps above, then test Phase 3 features




