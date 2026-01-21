# Fampo Rename - Complete Steps Guide

## ✅ Phase 1: Local Codebase (COMPLETED)

All local codebase changes have been completed:
- ✅ Created new Fampo logo component (`src/components/FampoLogo.tsx`)
- ✅ Updated all "Famjam" → "Fampo" text references in `src/app/page.tsx`
- ✅ Updated metadata in `src/app/layout.tsx`
- ✅ Updated `package.json` name
- ✅ Updated `cursor.rules`
- ✅ Replaced logo in navigation and footer

**Note:** `package-lock.json` will auto-update when you run `npm install`

---

## 📋 Phase 2: GitHub Repository Rename (YOU DO THIS)

### Steps:
1. **Go to GitHub:**
   - Navigate to: https://github.com/YOUR_USERNAME/famjam
   - Click on **Settings** (top right of repository page)

2. **Rename Repository:**
   - Scroll down to **"Repository name"** section
   - Change from: `famjam`
   - Change to: `fampo`
   - Click **"Rename"** button
   - Confirm the rename

3. **Update Local Git Remote:**
   ```bash
   git remote set-url origin https://github.com/YOUR_USERNAME/fampo.git
   ```

4. **Verify Remote:**
   ```bash
   git remote -v
   ```
   Should show: `origin  https://github.com/YOUR_USERNAME/fampo.git`

5. **Commit and Push Changes:**
   ```bash
   git add .
   git commit -m "Rename project from Famjam to Fampo"
   git push origin main
   ```
   (or `master` if that's your default branch)

---

## 🚀 Phase 3: Vercel Project Update (YOU DO THIS)

### Steps:

1. **Go to Vercel Dashboard:**
   - Navigate to: https://vercel.com/dashboard
   - Find your project (currently named "famjam" or similar)

2. **Rename Project:**
   - Click on your project
   - Go to **Settings** → **General**
   - Find **"Project Name"**
   - Change to: `fampo`
   - Click **"Save"**

3. **Update Domain:**
   - Go to **Settings** → **Domains**
   - You should see: `famjam-eta.vercel.app`
   - Click **"Remove"** or **"Edit"** on the old domain
   - Click **"Add Domain"**
   - Enter: `fampo.vercel.app`
   - Click **"Add"**
   - Vercel will automatically configure it

4. **Verify GitHub Connection:**
   - Go to **Settings** → **Git**
   - Ensure it's connected to: `YOUR_USERNAME/fampo`
   - If it still shows `famjam`, click **"Disconnect"** and **"Connect Git Repository"**
   - Select your renamed `fampo` repository

5. **Redeploy (if needed):**
   - Go to **Deployments** tab
   - Click **"Redeploy"** on the latest deployment
   - Or push a new commit to trigger auto-deployment

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] Local code shows "Fampo" everywhere
- [ ] New logo appears in navigation and footer
- [ ] GitHub repository renamed to `fampo`
- [ ] Local git remote updated
- [ ] Vercel project renamed to `fampo`
- [ ] New domain `fampo.vercel.app` is active
- [ ] Vercel connected to renamed GitHub repo
- [ ] Site deployed and accessible at new domain

---

## 🎨 Logo Details

The new Fampo logo features:
- Three connected people forming a community circle
- Blue gradient background (matching brand colors)
- Modern, clean design
- Scalable SVG format
- Used in navigation bar and footer

---

## 📝 Notes

- `package-lock.json` will update automatically on next `npm install`
- If you have any custom domains, update DNS settings separately
- All environment variables in Vercel remain unchanged
- Deployment history is preserved in Vercel

---

## 🆘 Troubleshooting

**If Vercel shows deployment errors:**
- Check that GitHub repository name matches exactly
- Verify git remote URL is correct
- Try disconnecting and reconnecting the repository

**If domain doesn't work:**
- Wait a few minutes for DNS propagation
- Check Vercel domain settings show "Valid Configuration"
- Clear browser cache

---

**Ready to proceed?** Start with Phase 2 (GitHub rename) first, then Phase 3 (Vercel update).

