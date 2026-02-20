# Waitlist Status Explanation

This document explains how the waitlist status system works and how it changes when users sign up.

---

## 📊 Waitlist Status Values

The `waitlist` table has a `status` column that can be one of three values:

1. **`'pending'`** - User is on the waitlist but hasn't created an account yet
2. **`'invited'`** - User has been invited (reserved for future use)
3. **`'active'`** - User has created an account and is linked to the waitlist

---

## 🔄 Complete Flow: From Waitlist to Account

### Step 1: User Joins Waitlist

**What happens:**
- User fills out the "Join Waitlist" form on the homepage
- Email is submitted to `/api/waitlist`
- New record is created in the `waitlist` table

**Database State:**
```sql
waitlist table:
┌─────────────────────┬──────────┬──────────────┬─────────────────────┐
│ email               │ status   │ early_bird   │ created_account_at  │
├─────────────────────┼──────────┼──────────────┼─────────────────────┤
│ user@example.com    │ pending  │ true         │ NULL                │
└─────────────────────┴──────────┴──────────────┴─────────────────────┘
```

**Status**: `'pending'` ✅
- User is on the waitlist
- No account created yet
- Waiting for user to sign up

---

### Step 2: User Signs Up (Creates Account)

**What happens:**
- User goes to `/signup` page
- Fills out signup form with email and password
- Account is created in Supabase Auth
- **System checks**: Does this email exist in the waitlist?
  - ✅ **YES** → Update waitlist entry
  - ❌ **NO** → Do nothing (user signed up without joining waitlist first)

**If email exists in waitlist:**
- Status changes: `'pending'` → `'active'`
- `created_account_at` is set to current timestamp

**Database State After Signup:**
```sql
waitlist table:
┌─────────────────────┬──────────┬──────────────┬─────────────────────┐
│ email               │ status   │ early_bird   │ created_account_at  │
├─────────────────────┼──────────┼──────────────┼─────────────────────┤
│ user@example.com    │ active   │ true         │ 2025-01-XX 10:30:00 │
└─────────────────────┴──────────┴──────────────┴─────────────────────┘

profiles table (NEW):
┌─────────────────────┬─────────────────────┬──────────────┐
│ id                  │ email                │ full_name    │
├─────────────────────┼─────────────────────┼──────────────┤
│ uuid-here           │ user@example.com    │ John Doe     │
└─────────────────────┴─────────────────────┴──────────────┘
```

**Status**: `'active'` ✅
- User has created an account
- Waitlist entry is linked to the account
- User is ready to proceed with checkout

---

### Step 3: User Signs In

**What happens:**
- User goes to `/login` page
- Enters email and password
- Session is created
- **Waitlist status does NOT change** - it stays `'active'`

**Status**: Still `'active'` ✅
- Sign in does not change waitlist status
- Status only changes from `'pending'` → `'active'` during signup

---

## 📋 Status Summary Table

| Action | Status Before | Status After | Notes |
|--------|--------------|--------------|-------|
| **Join Waitlist** | (none) | `'pending'` | New waitlist entry created |
| **Sign Up** (email in waitlist) | `'pending'` | `'active'` | Status changes, account created |
| **Sign Up** (email NOT in waitlist) | (none) | (none) | No waitlist entry, just account |
| **Sign In** | `'active'` | `'active'` | Status stays the same |
| **Sign In** | `'pending'` | `'pending'` | Status stays the same (no account yet) |

---

## 🔍 Real-World Examples

### Example 1: User Joins Waitlist First

1. **Day 1**: User visits homepage
   - Clicks "Join Waitlist"
   - Enters: `alice@example.com`
   - **Waitlist Status**: `'pending'` ✅

2. **Day 3**: User decides to sign up
   - Goes to `/signup`
   - Enters: `alice@example.com` (same email)
   - Creates password
   - **Waitlist Status**: `'pending'` → `'active'` ✅
   - **Account Created**: Yes ✅

3. **Day 4**: User signs in
   - Goes to `/login`
   - Enters credentials
   - **Waitlist Status**: Still `'active'` ✅ (no change)

---

### Example 2: User Signs Up Without Joining Waitlist

1. **Day 1**: User visits homepage
   - Does NOT join waitlist
   - Goes directly to `/signup`
   - Enters: `bob@example.com`
   - Creates password
   - **Waitlist Status**: No entry exists (user never joined waitlist)
   - **Account Created**: Yes ✅

2. **Day 2**: User signs in
   - Goes to `/login`
   - Enters credentials
   - **Waitlist Status**: Still no entry (user never joined waitlist)

---

### Example 3: User Joins Waitlist But Never Signs Up

1. **Day 1**: User joins waitlist
   - Enters: `charlie@example.com`
   - **Waitlist Status**: `'pending'` ✅

2. **Day 2-30**: User never signs up
   - **Waitlist Status**: Still `'pending'` ✅
   - No account created
   - User remains on waitlist only

---

## 💡 Key Points to Remember

### ✅ Status = 'pending'
- **Meaning**: User is on the waitlist, but hasn't created an account yet
- **When**: Immediately after joining waitlist
- **Can sign in?**: ❌ No (no account exists yet)
- **Can access dashboard?**: ❌ No (needs to sign up first)

### ✅ Status = 'active'
- **Meaning**: User has created an account AND was on the waitlist
- **When**: After signup (if email was in waitlist)
- **Can sign in?**: ✅ Yes (account exists)
- **Can access dashboard?**: ✅ Yes (authenticated user)

### ⚠️ Important Notes

1. **Signup changes status**: Only signup (creating account) changes status from `'pending'` to `'active'`
2. **Sign in does NOT change status**: Signing in does not affect waitlist status
3. **Email matching**: The system matches emails (case-insensitive) to link waitlist to account
4. **Early bird eligibility**: Users with `early_bird = true` and `status = 'active'` get $44 CAD/month pricing

---

## 🔧 How It Works in Code

### When User Joins Waitlist (`/api/waitlist`)

```typescript
// Creates new waitlist entry
await supabase
  .from('waitlist')
  .insert({
    email: email.toLowerCase(),
    status: 'pending',  // ← Default status
    early_bird: true,
  });
```

**Result**: Status = `'pending'`

---

### When User Signs Up (`/api/auth/signup`)

```typescript
// 1. Create account in Supabase Auth
await supabase.auth.signUp({ email, password });

// 2. Check if email exists in waitlist
const { data: waitlistEntry } = await serviceClient
  .from('waitlist')
  .select('*')
  .eq('email', email.toLowerCase())
  .single();

// 3. If found, update status
if (waitlistEntry) {
  await serviceClient
    .from('waitlist')
    .update({
      status: 'active',  // ← Changes from 'pending' to 'active'
      created_account_at: new Date().toISOString(),
    })
    .eq('email', email.toLowerCase());
}
```

**Result**: Status = `'pending'` → `'active'` (if email was in waitlist)

---

### When User Signs In (`/api/auth/login`)

```typescript
// Just authenticates the user
await supabase.auth.signInWithPassword({ email, password });

// Waitlist status is NOT changed
```

**Result**: Status stays the same (no change)

---

## 🧪 Testing the Status Flow

### Test Scenario 1: Join Waitlist → Sign Up

1. **Join Waitlist**:
   - Email: `test-status@example.com`
   - Check Supabase: Status = `'pending'` ✅

2. **Sign Up**:
   - Email: `test-status@example.com` (same)
   - Check Supabase: Status = `'active'` ✅
   - Check: `created_account_at` has timestamp ✅

### Test Scenario 2: Sign Up Without Waitlist

1. **Sign Up** (no waitlist entry):
   - Email: `direct-signup@example.com`
   - Check Supabase: No waitlist entry exists ✅
   - Check: Account created in `profiles` table ✅

### Test Scenario 3: Join Waitlist → Never Sign Up

1. **Join Waitlist**:
   - Email: `never-signup@example.com`
   - Check Supabase: Status = `'pending'` ✅

2. **Wait** (don't sign up)
   - Check Supabase: Status still = `'pending'` ✅
   - Check: No account in `profiles` table ✅

---

## 📊 Database Query Examples

### Check All Pending Waitlist Entries

```sql
SELECT * FROM waitlist 
WHERE status = 'pending';
```

**Returns**: All users who joined waitlist but haven't signed up yet

---

### Check All Active Waitlist Entries

```sql
SELECT * FROM waitlist 
WHERE status = 'active';
```

**Returns**: All users who joined waitlist AND created accounts

---

### Check Waitlist Entry for Specific Email

```sql
SELECT * FROM waitlist 
WHERE email = 'user@example.com';
```

**Returns**: Waitlist entry showing current status

---

## ✅ Summary

| Question | Answer |
|----------|--------|
| **What does 'pending' mean?** | User is on waitlist, no account created yet |
| **What does 'active' mean?** | User created account and was on waitlist |
| **When does status change?** | Only during signup (if email was in waitlist) |
| **Does sign in change status?** | ❌ No, sign in does not change status |
| **Does signup always change status?** | Only if email exists in waitlist |
| **Can I have 'pending' status with an account?** | ❌ No, if account exists, status should be 'active' |

---

**Need more clarification?** Let me know which part you'd like me to explain further!







