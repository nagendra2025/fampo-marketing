# Phase 4: Setup Instructions

## 📋 Overview

Phase 4 requires minimal setup - most features work out of the box. However, you need to configure Stripe Customer Portal for the payment method update feature.

---

## Step 1: Configure Stripe Customer Portal

### Why This is Needed:
- Stripe Customer Portal must be configured in Stripe Dashboard
- Portal settings control what users can do
- Must be enabled for payment method updates to work

### Setup Steps:

1. **Go to Stripe Dashboard**:
   - Visit: https://dashboard.stripe.com
   - Make sure **Test mode** is active (for testing)

2. **Navigate to Customer Portal**:
   - Click **"Settings"** in left sidebar
   - Click **"Billing"** → **"Customer portal"**

3. **Enable Customer Portal**:
   - Toggle **"Enable customer portal"** to ON
   - This allows users to access the portal

4. **Configure Portal Features**:
   - **Allow customers to update payment methods**: ✅ Enable
   - **Allow customers to cancel subscriptions**: ✅ Enable (optional)
   - **Allow customers to update billing details**: ✅ Enable (optional)
   - **Allow customers to view invoices**: ✅ Enable (recommended)

5. **Set Business Information** (Optional):
   - Business name: "Fampo"
   - Support email: Your support email
   - Support phone: Your support phone (optional)

6. **Save Settings**:
   - Click **"Save"** at the bottom

### For Production:
- Repeat steps above in **Live mode** (not Test mode)
- Configure portal settings for production
- Test with real customers

---

## Step 2: Verify Environment Variables

Check that all required variables are set in `.env.local`:

```env
# Stripe (already configured from Phase 1)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend (already configured)
RESEND_API_KEY=your_resend_api_key
```

**No new environment variables needed for Phase 4!**

---

## Step 3: Test Features

### Test 1: Cancel Subscription
1. Go to `/dashboard`
2. Click "Cancel at Period End" or "Cancel Now"
3. Confirm cancellation
4. **Expected**: Success message, subscription status updated

### Test 2: Update Payment Method
1. Go to `/dashboard`
2. Click "Update Payment Method"
3. **Expected**: Redirected to Stripe Customer Portal
4. **Expected**: Can update payment method
5. **Expected**: Can return to dashboard

### Test 3: Download Receipt
1. Go to `/dashboard` (with payment history)
2. Click "Receipt" button on a payment
3. **Expected**: Receipt PDF opens in new tab
4. **Expected**: PDF shows correct invoice details

---

## ✅ Verification Checklist

### Setup:
- [ ] Stripe Customer Portal enabled
- [ ] Portal features configured
- [ ] Environment variables verified

### Testing:
- [ ] Cancel subscription works
- [ ] Update payment method works
- [ ] Download receipt works
- [ ] UI displays correctly
- [ ] Error handling works

---

## 🐛 Troubleshooting

### Issue: Portal doesn't open
**Solution**:
- Check Customer Portal is enabled in Stripe Dashboard
- Verify `STRIPE_SECRET_KEY` is set
- Check browser allows redirects
- Verify customer ID exists in Stripe

### Issue: Cancel doesn't work
**Solution**:
- Check subscription exists in database
- Verify subscription status is 'active' or 'trialing'
- Check browser console for errors
- Verify API endpoint is accessible

### Issue: Receipt download fails
**Solution**:
- Check payment exists in database
- Verify payment belongs to user
- Check invoice exists in Stripe
- Verify PDF URL is accessible

---

## 📝 Next Steps

Once setup is complete:

1. ✅ Test all Phase 4 features
2. ✅ Verify security (users can only manage their own subscriptions)
3. ✅ Test error handling
4. ✅ Configure portal for production (when ready)

---

**Setup Status**: ⏳ **IN PROGRESS**  
**Next**: Complete setup steps above, then test Phase 4 features




