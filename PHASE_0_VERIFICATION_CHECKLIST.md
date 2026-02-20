# Phase 0: Authentication System - Verification Checklist

Use this checklist to verify that Phase 0 is completely set up and working.

---

## ✅ Code Implementation Status

### Files Created (Automatic Check)
- [x] `src/lib/supabase/client.ts` - Browser client
- [x] `src/lib/supabase/server.ts` - Server client  
- [x] `src/lib/supabase/middleware.ts` - Auth middleware
- [x] `src/middleware.ts` - Next.js middleware
- [x] `src/app/api/auth/signup/route.ts` - Signup API
- [x] `src/app/api/auth/login/route.ts` - Login API
- [x] `src/app/api/auth/logout/route.ts` - Logout API
- [x] `src/app/api/auth/session/route.ts` - Session API
- [x] `src/app/(auth)/signup/page.tsx` - Signup page
- [x] `src/app/(auth)/login/page.tsx` - Login page
- [x] `src/app/dashboard/page.tsx` - Dashboard page
- [x] `src/app/checkout/page.tsx` - Checkout page
- [x] `src/components/auth/SignupForm.tsx` - Signup form
- [x] `src/components/auth/LoginForm.tsx` - Login form
- [x] `src/types/database.ts` - TypeScript types
- [x] `supabase/auth_migration.sql` - Database migration

**Status**: ✅ All code files are in place

---

## 🔧 Setup Steps - Manual Verification Required

### Step 1: Database Migration ✅/❌

**Action Required**: Run the SQL migration in Supabase

1. Go to Supabase Dashboard → **SQL Editor**
2. Open `supabase/auth_migration.sql`
3. Copy and paste the entire script
4. Click **"Run this query"** (ignore the warning - it's safe)

**Verify Migration Success**:

Go to Supabase Dashboard → **Table Editor** and check:

- [ ] `profiles` table exists
  - Check: Table Editor → `profiles` table should be visible
- [ ] `profiles` table has correct columns:
  - `id` (UUID, Primary Key)
  - `email` (TEXT)
  - `full_name` (TEXT, nullable)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)
- [ ] `waitlist` table has new column:
  - `early_bird_cutoff_date` (TIMESTAMP, nullable)
  - Check: Table Editor → `waitlist` → should see this column

**If migration failed**: Check Supabase SQL Editor for error messages

---

### Step 2: Environment Variables ✅/❌

**Action Required**: Verify `.env.local` file exists and has correct values

Check that your `.env.local` file (in project root) contains:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Resend (already configured)
RESEND_API_KEY=your_resend_api_key_here
```

**Verify**:
- [ ] `.env.local` file exists in project root
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set (starts with `https://`)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set (starts with `eyJ`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set (starts with `eyJ`)
- [ ] `RESEND_API_KEY` is set (starts with `re_`)

**To get Supabase keys**:
1. Go to Supabase Dashboard → **Settings** → **API**
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

---

### Step 3: Supabase Auth Configuration ✅/❌

**Action Required**: Configure Supabase Authentication settings

1. Go to Supabase Dashboard → **Authentication** → **Settings**

**Verify**:
- [ ] **Email** provider is enabled (should be ON by default)
- [ ] **Site URL** is set to: `http://localhost:3000`
- [ ] **Redirect URLs** include:
  - `http://localhost:3000/dashboard`
  - `http://localhost:3000/checkout`
  - `https://fampo-marketing.com/dashboard` (production)
  - `https://fampo-marketing.com/checkout` (production)

**To configure**:
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:3000`
3. Add each redirect URL in **Redirect URLs** section
4. Click **Save**

---

### Step 4: Install Dependencies ✅/❌

**Action Required**: Ensure `@supabase/ssr` is installed

Run in terminal:
```bash
npm install @supabase/ssr
```

**Verify**:
- [ ] Package installed (check `package.json` for `@supabase/ssr`)
- [ ] No errors during installation

---

## 🧪 Testing Steps - Manual Verification Required

### Test 1: Start Development Server ✅/❌

**Action**: Start the Next.js development server

```bash
npm run dev
```

**Verify**:
- [ ] Server starts without errors
- [ ] Can access `http://localhost:3000`
- [ ] Home page loads correctly

---

### Test 2: Signup Flow ✅/❌

**Action**: Test user registration

1. Navigate to: `http://localhost:3000/signup`
   - OR click "Get Started" button on pricing card

2. Fill in the form:
   - Email: `test@example.com` (use a test email)
   - Password: `test123456` (min 6 characters)
   - Full Name: `Test User` (optional)

3. Click "Create Account"

**Expected Results**:
- [ ] Success message appears: "Account created successfully!"
- [ ] Redirects to `/checkout` page after 2 seconds
- [ ] No error messages displayed

**Verify in Supabase**:
- [ ] Go to Supabase Dashboard → **Authentication** → **Users**
- [ ] New user `test@example.com` appears in the list
- [ ] Go to **Table Editor** → `profiles` table
- [ ] Profile record exists with matching email

---

### Test 3: Login Flow ✅/❌

**Action**: Test user sign-in

1. Navigate to: `http://localhost:3000/login`
   - OR click "Sign in" link from signup page

2. Fill in the form:
   - Email: `test@example.com`
   - Password: `test123456`

3. Click "Sign In"

**Expected Results**:
- [ ] Redirects to `/dashboard` page
- [ ] Dashboard shows welcome message
- [ ] User email is displayed
- [ ] "Sign Out" button is visible

---

### Test 4: Protected Routes ✅/❌

**Action**: Test route protection

**While Logged In**:
- [ ] Can access `http://localhost:3000/dashboard` ✅
- [ ] Can access `http://localhost:3000/checkout` ✅

**While Logged Out**:
1. Click "Sign Out" button
2. Try to access `http://localhost:3000/dashboard`

**Expected Results**:
- [ ] Redirects to `/login?redirect=/dashboard`
- [ ] Cannot access dashboard without login

**Test Auth Page Redirect**:
1. Sign in to your account
2. Try to access `http://localhost:3000/login`

**Expected Results**:
- [ ] Redirects to `/dashboard` (since already logged in)

---

### Test 5: Session Persistence ✅/❌

**Action**: Test that session persists across page refreshes

1. Sign in to your account
2. Refresh the page (F5 or Ctrl+R)
3. Check if still logged in

**Expected Results**:
- [ ] Session persists after refresh
- [ ] Still on dashboard page
- [ ] User remains logged in
- [ ] No redirect to login page

---

### Test 6: Logout ✅/❌

**Action**: Test user sign-out

1. While logged in, click "Sign Out" button
2. Check if session is cleared

**Expected Results**:
- [ ] Redirects to home page or login
- [ ] Cannot access protected routes
- [ ] Trying to access `/dashboard` redirects to login

---

### Test 7: Waitlist Integration ✅/❌

**Action**: Test that waitlist entries link to user accounts

1. **First**: Add an email to waitlist using the waitlist form on homepage
   - Use email: `waitlist-test@example.com`

2. **Then**: Sign up with the same email
   - Go to `/signup`
   - Use email: `waitlist-test@example.com`
   - Create account

3. **Verify in Supabase**:
   - Go to **Table Editor** → `waitlist` table
   - Find entry with email `waitlist-test@example.com`

**Expected Results**:
- [ ] `status` column is set to `'active'`
- [ ] `created_account_at` column has a timestamp
- [ ] `early_bird_cutoff_date` is set to `2025-03-31 23:59:59+00`

---

### Test 8: Form Validation ✅/❌

**Action**: Test input validation

**Test Invalid Email**:
- [ ] Try: `invalid-email` → Shows error ✅
- [ ] Try: `test@` → Shows error ✅
- [ ] Try: `@example.com` → Shows error ✅

**Test Invalid Password**:
- [ ] Try password: `12345` (5 chars) → Shows error ✅
- [ ] Try password: `123456` (6+ chars) → Accepts ✅

**Test Valid Input**:
- [ ] Valid email format → Accepts ✅
- [ ] Password 6+ characters → Accepts ✅

---

## 📊 Overall Status

### Code Implementation
- ✅ **Complete** - All files created and in place

### Setup Steps
- [ ] **Database Migration** - Run SQL script in Supabase
- [ ] **Environment Variables** - Verify `.env.local` has all keys
- [ ] **Supabase Auth Config** - Configure redirect URLs
- [ ] **Dependencies** - Install `@supabase/ssr`

### Testing
- [ ] **Signup Flow** - Test user registration
- [ ] **Login Flow** - Test user sign-in
- [ ] **Protected Routes** - Test route protection
- [ ] **Session Persistence** - Test session across refreshes
- [ ] **Logout** - Test sign-out
- [ ] **Waitlist Integration** - Test waitlist linking
- [ ] **Form Validation** - Test input validation

---

## 🎯 Phase 0 Completion Criteria

Phase 0 is **COMPLETE** when:

1. ✅ All code files are in place
2. ✅ Database migration has been run successfully
3. ✅ Environment variables are configured
4. ✅ Supabase Auth is configured with redirect URLs
5. ✅ All 8 test scenarios pass successfully

---

## 🐛 Troubleshooting

### If signup fails:
- Check Supabase Dashboard → Authentication → Settings → Email provider is enabled
- Verify environment variables are set correctly
- Check browser console for errors

### If login fails:
- Verify user was created successfully in Supabase
- Check if email confirmation is required (disable for testing)
- Verify password is correct

### If protected routes don't redirect:
- Check `src/middleware.ts` exists in root
- Verify middleware is exported correctly
- Check browser console for errors

### If session doesn't persist:
- Verify `@supabase/ssr` package is installed
- Check cookies are enabled in browser
- Verify environment variables are correct

---

## ✅ Ready for Phase 1?

Once all checkboxes above are marked ✅, Phase 0 is complete and you're ready to proceed to **Phase 1: Foundation & Database Setup** (Stripe integration).

---

**Last Updated**: [Current Date]
**Status**: [ ] In Progress / [ ] Complete







