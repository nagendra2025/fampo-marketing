# Phase 0: Step-by-Step Testing Guide

This guide provides detailed instructions for testing Phase 0 authentication features.

---

## ✅ Test 1 & 2: Already Completed!

You've successfully:
- ✅ Created an account (signup)
- ✅ Signed in (login)
- ✅ Reached the checkout page (protected route working)

---

## 🧪 Test 3: Protected Routes

**Goal**: Verify that unauthenticated users cannot access protected pages.

### Step-by-Step:

1. **Sign out first**:
   - Look for a "Sign Out" button on the page
   - If not visible, go to: `http://localhost:3000/dashboard`
   - Click "Sign Out" button there

2. **Try to access protected routes** (while logged out):
   
   **Test 3a: Dashboard Protection**
   - In the browser address bar, type: `http://localhost:3000/dashboard`
   - Press Enter
   - **Expected Result**: ✅ Should automatically redirect to `/login?redirect=/dashboard`
   - You should see the login page

   **Test 3b: Checkout Protection**
   - In the browser address bar, type: `http://localhost:3000/checkout`
   - Press Enter
   - **Expected Result**: ✅ Should automatically redirect to `/login?redirect=/checkout`
   - You should see the login page

3. **Test Auth Page Redirect** (while logged in):
   - Sign in again with your credentials
   - Once logged in, try to access: `http://localhost:3000/login`
   - **Expected Result**: ✅ Should redirect to `/dashboard` (since you're already logged in)

**✅ Test 3 Passes If**:
- [ ] Cannot access `/dashboard` when logged out (redirects to login)
- [ ] Cannot access `/checkout` when logged out (redirects to login)
- [ ] Cannot access `/login` when already logged in (redirects to dashboard)

---

## 🧪 Test 4: Session Persistence

**Goal**: Verify that user session persists across page refreshes.

### Step-by-Step:

1. **Sign in** to your account:
   - Go to `http://localhost:3000/login`
   - Enter your email and password
   - Click "Sign In"
   - You should be on the dashboard or checkout page

2. **Refresh the page**:
   - Press `F5` or `Ctrl + R` (Windows) / `Cmd + R` (Mac)
   - OR click the browser refresh button

3. **Check if still logged in**:
   - **Expected Result**: ✅ Should still be on the same page (dashboard/checkout)
   - ✅ Should NOT redirect to login page
   - ✅ User information should still be visible

4. **Test multiple refreshes**:
   - Refresh 2-3 more times
   - **Expected Result**: ✅ Session persists each time

5. **Close and reopen browser tab** (optional):
   - Close the browser tab
   - Open a new tab
   - Go to `http://localhost:3000/dashboard`
   - **Expected Result**: ✅ Should still be logged in (session persists)

**✅ Test 4 Passes If**:
- [ ] Session persists after page refresh
- [ ] No redirect to login page after refresh
- [ ] User remains logged in

---

## 🧪 Test 5: Logout

**Goal**: Verify that logout clears the session and redirects properly.

### Step-by-Step:

1. **Make sure you're logged in**:
   - You should be on `/dashboard` or `/checkout` page
   - If not, sign in first

2. **Find the Sign Out button**:
   - On `/dashboard` page: Look for "Sign Out" button in the top-right
   - If you're on `/checkout`, navigate to `/dashboard` first

3. **Click "Sign Out"**:
   - Click the "Sign Out" button
   - **Expected Result**: ✅ Should redirect to home page (`/`) or login page

4. **Verify logout worked**:
   - Try to access: `http://localhost:3000/dashboard`
   - **Expected Result**: ✅ Should redirect to `/login?redirect=/dashboard`
   - You should NOT be able to access protected routes

5. **Verify you're logged out**:
   - Try to access: `http://localhost:3000/checkout`
   - **Expected Result**: ✅ Should redirect to login page

**✅ Test 5 Passes If**:
- [ ] Sign out button works
- [ ] Redirects after logout
- [ ] Cannot access protected routes after logout
- [ ] Must sign in again to access protected routes

---

## 🧪 Test 6: Waitlist Integration

**Goal**: Verify that waitlist entries are linked to user accounts on signup.

### Step-by-Step:

1. **Add email to waitlist first**:
   - Go to home page: `http://localhost:3000`
   - Scroll down to the "Join Waitlist" section
   - Enter a test email: `waitlist-test@example.com`
   - Click "Join Waitlist"
   - **Expected Result**: ✅ Success message appears

2. **Verify email in waitlist** (in Supabase):
   - Go to Supabase Dashboard
   - Navigate to **Table Editor** → `waitlist` table
   - Find the entry with email `waitlist-test@example.com`
   - **Note the current values**:
     - `status` should be `'pending'`
     - `created_account_at` should be `null`

3. **Sign up with the same email**:
   - Go to: `http://localhost:3000/signup`
   - Enter email: `waitlist-test@example.com` (same as waitlist)
   - Enter password: `test123456`
   - Enter full name: `Waitlist Test User`
   - Click "Create Account"
   - **Expected Result**: ✅ Account created successfully

4. **Verify waitlist entry was updated** (in Supabase):
   - Go back to Supabase Dashboard → **Table Editor** → `waitlist` table
   - Find the entry with email `waitlist-test@example.com`
   - **Check the updated values**:
     - ✅ `status` should now be `'active'` (changed from `'pending'`)
     - ✅ `created_account_at` should have a timestamp (no longer null)
     - ✅ `early_bird_cutoff_date` should be set to `2025-03-31 23:59:59+00`

5. **Verify profile was created**:
   - Go to Supabase Dashboard → **Table Editor** → `profiles` table
   - Find the entry with email `waitlist-test@example.com`
   - **Check**:
     - ✅ Profile exists with matching email
     - ✅ `full_name` is set to `Waitlist Test User`

**✅ Test 6 Passes If**:
- [ ] Waitlist entry status changes from `'pending'` to `'active'`
- [ ] `created_account_at` timestamp is set
- [ ] Profile is created in `profiles` table
- [ ] Email matches between waitlist and profile

---

## 🧪 Test 7: Form Validation

**Goal**: Verify that form validation works correctly for invalid inputs.

### Step-by-Step:

#### Test 7a: Invalid Email Formats

1. **Go to signup page**: `http://localhost:3000/signup`

2. **Test Invalid Email 1**:
   - Email: `invalid-email` (no @ symbol)
   - Password: `test123456`
   - Click "Create Account"
   - **Expected Result**: ✅ Error message appears: "Please enter a valid email address"

3. **Test Invalid Email 2**:
   - Email: `test@` (incomplete domain)
   - Password: `test123456`
   - Click "Create Account"
   - **Expected Result**: ✅ Error message appears

4. **Test Invalid Email 3**:
   - Email: `@example.com` (missing username)
   - Password: `test123456`
   - Click "Create Account"
   - **Expected Result**: ✅ Error message appears

5. **Test Valid Email**:
   - Email: `valid@example.com`
   - Password: `test123456`
   - Click "Create Account"
   - **Expected Result**: ✅ Form accepts valid email (may show other errors if email already exists)

#### Test 7b: Invalid Password

1. **Go to signup page**: `http://localhost:3000/signup`

2. **Test Short Password**:
   - Email: `test-password@example.com`
   - Password: `12345` (only 5 characters)
   - Click "Create Account"
   - **Expected Result**: ✅ Error message appears: "Password must be at least 6 characters long"

3. **Test Valid Password**:
   - Email: `test-password@example.com`
   - Password: `123456` (6 characters - minimum)
   - Click "Create Account"
   - **Expected Result**: ✅ Form accepts password (account creation proceeds)

#### Test 7c: Empty Fields

1. **Go to signup page**: `http://localhost:3000/signup`

2. **Test Empty Email**:
   - Email: (leave empty)
   - Password: `test123456`
   - Click "Create Account"
   - **Expected Result**: ✅ Browser shows validation error (required field)

3. **Test Empty Password**:
   - Email: `test@example.com`
   - Password: (leave empty)
   - Click "Create Account"
   - **Expected Result**: ✅ Browser shows validation error (required field)

#### Test 7d: Login Form Validation

1. **Go to login page**: `http://localhost:3000/login`

2. **Test Invalid Credentials**:
   - Email: `nonexistent@example.com`
   - Password: `wrongpassword`
   - Click "Sign In"
   - **Expected Result**: ✅ Error message: "Invalid email or password"

3. **Test Valid Credentials**:
   - Email: (use your actual account email)
   - Password: (use your actual password)
   - Click "Sign In"
   - **Expected Result**: ✅ Successfully logs in

**✅ Test 7 Passes If**:
- [ ] Invalid email formats show error messages
- [ ] Short passwords (less than 6 chars) show error
- [ ] Empty required fields show validation errors
- [ ] Valid inputs are accepted
- [ ] Invalid login credentials show error
- [ ] Valid login credentials work

---

## 📋 Quick Test Checklist

Use this checklist to track your testing progress:

### Test 3: Protected Routes
- [ ] Cannot access `/dashboard` when logged out
- [ ] Cannot access `/checkout` when logged out
- [ ] Cannot access `/login` when already logged in

### Test 4: Session Persistence
- [ ] Session persists after page refresh
- [ ] Session persists after closing/reopening tab

### Test 5: Logout
- [ ] Sign out button works
- [ ] Cannot access protected routes after logout

### Test 6: Waitlist Integration
- [ ] Waitlist entry status updates to 'active'
- [ ] `created_account_at` timestamp is set
- [ ] Profile created in database

### Test 7: Form Validation
- [ ] Invalid emails show errors
- [ ] Short passwords show errors
- [ ] Empty fields show validation
- [ ] Valid inputs work correctly

---

## 🎯 All Tests Complete?

Once all tests pass, Phase 0 is **100% complete** and you're ready for **Phase 1: Foundation & Database Setup** (Stripe integration)!

---

## 🐛 Troubleshooting

### If Test 3 fails (protected routes):
- Check that `src/middleware.ts` exists
- Verify middleware is working (check browser console)
- Restart dev server: `npm run dev`

### If Test 4 fails (session persistence):
- Check browser cookies are enabled
- Clear browser cache and try again
- Verify environment variables are correct

### If Test 6 fails (waitlist integration):
- Check Supabase database connection
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Check Supabase logs for errors

### If Test 7 fails (validation):
- Check browser console for JavaScript errors
- Verify form components are loading correctly
- Test in a different browser

---

**Need Help?** If any test fails, check the error messages and let me know what you see!







