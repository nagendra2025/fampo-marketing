# Stripe Customer Portal Configuration Guide

## 📋 What to Enable for Phase 4

Based on the Phase 4 features we implemented, here's what you need to enable:

---

## ✅ REQUIRED Settings (Must Enable)

### 1. Payment Methods ✅ REQUIRED
**Location**: "Payment methods" section

**Enable**: ✅ **YES - Required**

**Why**:
- Phase 4 feature: "Update Payment Method" uses this
- Users need to update expired/changed cards
- This is the core feature we implemented

**What to Enable**:
- ✅ "Allow customers to update payment methods"
- ✅ "Allow customers to add payment methods" (recommended)

**How to Enable**:
1. Click on "Payment methods" section (expand it)
2. Toggle "Allow customers to update payment methods" to **ON**
3. Optionally enable "Allow customers to add payment methods"

---

### 2. Invoices ✅ REQUIRED
**Location**: "Invoices" section

**Enable**: ✅ **YES - Required**

**Why**:
- Phase 4 feature: "Download Receipts" uses this
- Users need to view and download invoices/receipts
- This is required for the receipt download feature

**What to Enable**:
- ✅ "Show invoice history"

**How to Enable**:
1. Click on "Invoices" section (expand it)
2. Toggle "Show invoice history" to **ON**

---

## ⚠️ RECOMMENDED Settings (Should Enable)

### 3. Customer Information ⚠️ RECOMMENDED
**Location**: "Customer information" section

**Enable**: ⚠️ **Recommended (but not required)**

**Why**:
- Users may want to update billing address
- Users may want to update email/phone
- Better user experience

**What to Enable**:
- ✅ "Allow customers to view and update their billing information"

**How to Enable**:
1. Click on "Customer information" section (expand it)
2. Toggle "Allow customers to view and update their billing information" to **ON**

---

## ❓ OPTIONAL Settings (Your Choice)

### 4. Cancellations ❓ OPTIONAL
**Location**: "Cancellations" section

**Enable**: ❓ **Optional**

**Why**:
- We already have cancel buttons in our dashboard
- Portal cancellation is redundant but gives users another option
- You can enable if you want users to cancel via portal too

**What to Enable** (if you want):
- "Allow customers to cancel their subscription"

**Recommendation**: 
- **You can leave this OFF** - We have our own cancel buttons
- **Or enable it** - Gives users more options

---

### 5. Subscriptions ❓ OPTIONAL
**Location**: "Subscriptions" section

**Enable**: ❓ **Optional (Not needed for Phase 4)**

**Why**:
- Phase 4 doesn't include subscription upgrades/downgrades
- We only have one plan (Family Plan) currently
- Not needed unless you want plan switching

**What's in This Section**:
- "Customers can switch plans" - ❌ Not needed (we only have one plan)
- "Customers can change quantity" - ❌ Not needed (we only have one plan)

**Recommendation**: 
- **Leave this OFF** - Not needed for current implementation

---

## 📋 Recommended Configuration

### Minimum Required (Phase 4 Features Work):
- ✅ **Payment methods**: Enable "Allow customers to update payment methods"
- ✅ **Invoices**: Enable "Show invoice history"

### Recommended (Better User Experience):
- ✅ **Payment methods**: Enable (required)
- ✅ **Invoices**: Enable (required)
- ✅ **Customer information**: Enable (recommended)

### Optional (Your Choice):
- ❓ **Cancellations**: Optional (we have our own cancel buttons)
- ❓ **Subscriptions**: Leave OFF (not needed)

---

## 🎯 Quick Setup Steps

### Step 1: Enable Payment Methods (REQUIRED)
1. Find "Payment methods" section
2. Click to expand it
3. Toggle "Allow customers to update payment methods" to **ON**
4. Optionally enable "Allow customers to add payment methods"

### Step 2: Enable Invoices (REQUIRED)
1. Find "Invoices" section
2. Click to expand it
3. Toggle "Show invoice history" to **ON**

### Step 3: Enable Customer Information (RECOMMENDED)
1. Find "Customer information" section
2. Click to expand it
3. Toggle "Allow customers to view and update their billing information" to **ON**

### Step 4: Save Changes
1. Scroll to bottom
2. Click **"Save changes"** button (purple button)

---

## ✅ Final Checklist

**Required for Phase 4**:
- [ ] Payment methods: "Allow customers to update payment methods" - ✅ ON
- [ ] Invoices: "Show invoice history" - ✅ ON

**Recommended**:
- [ ] Customer information: "Allow customers to view and update their billing information" - ✅ ON

**Optional**:
- [ ] Cancellations: "Allow customers to cancel their subscription" - ❓ Your choice
- [ ] Subscriptions: "Customers can switch plans" - ❌ Leave OFF (not needed)

---

## 🎯 Summary

**Minimum Required**:
- ✅ Payment methods (for update payment method feature)
- ✅ Invoices (for download receipts feature)

**Recommended**:
- ✅ Customer information (better UX)

**Optional**:
- ❓ Cancellations (we have our own buttons)
- ❌ Subscriptions (not needed - only one plan)

**After Configuration**:
1. Click "Save changes"
2. Test the features
3. Verify everything works

---

**Configuration Status**: ⏳ **AWAITING YOUR SETUP**

**Next**: Enable the required settings above, then test Phase 4 features!




