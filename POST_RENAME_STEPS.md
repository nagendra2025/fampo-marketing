# Steps After Renaming Repository to `fampo-marketing`

## 🚀 Step 1: Rename Repository on GitHub (DO THIS FIRST)

Before updating your local git remote, you need to rename the repository on GitHub:

### Detailed Steps:

1. **Go to Your Repository on GitHub:**
   - Navigate to: https://github.com/nagendra2025/fampo
   - (Or whatever your current repository name is)

2. **Open Repository Settings:**
   - Click on the **"Settings"** tab (located at the top of the repository page, next to "Code", "Issues", "Pull requests", etc.)
   - You need to be the repository owner or have admin access to see this tab

3. **Find the Repository Name Section:**
   - Scroll down in the Settings page
   - Look for the **"Repository name"** section (usually near the top of the Settings page)
   - You'll see a text input field with your current repository name

4. **Rename the Repository:**
   - Change the name from: `fampo` (or whatever it currently is)
   - Change it to: `fampo-marketing`
   - Click the **"Rename"** button

5. **Confirm the Rename:**
   - GitHub will show you a warning about what will happen
   - It will tell you that the URL will change
   - Type the new repository name again to confirm
   - Click **"I understand, rename my repository"** or similar confirmation button

6. **Wait for Confirmation:**
   - GitHub will process the rename (usually instant)
   - You'll be redirected to the new repository URL: `https://github.com/nagendra2025/fampo-marketing`

### ⚠️ Important Notes:
- **All existing URLs will redirect** - GitHub automatically redirects old URLs to the new one
- **Webhooks and integrations** - You may need to update webhook URLs in third-party services (like Vercel)
- **Local clones** - You'll need to update your local git remote (we'll do this next)

---

## ✅ Step 2: Update Git Remote URL

Now that you've renamed the repository on GitHub to `fampo-marketing`, update your local git remote:

```bash
git remote set-url origin https://github.com/nagendra2025/fampo-marketing.git
```

**Verify the remote was updated:**
```bash
git remote -v
```

You should see:
```
origin  https://github.com/nagendra2025/fampo-marketing.git (fetch)
origin  https://github.com/nagendra2025/fampo-marketing.git (push)
```

---

## ✅ Step 3: Test the Connection

Test that you can fetch from the new remote:

```bash
git fetch origin
```

If successful, you're connected to the new repository.

---

## ✅ Step 4: Push Any Local Changes

If you have any uncommitted or unpushed changes:

```bash
# Check status
git status

# Add any changes
git add .

# Commit (if needed)
git commit -m "Update repository name to fampo-marketing"

# Push to the new repository
git push origin main
```

(Use `master` instead of `main` if that's your default branch)

---

## ✅ Step 5: Update Vercel Project (If Deployed)

If you're using Vercel for deployment:

1. **Go to Vercel Dashboard:**
   - Navigate to: https://vercel.com/dashboard
   - Find your project

2. **Update GitHub Connection:**
   - Click on your project
   - Go to **Settings** → **Git**
   - If it still shows the old repository name (`fampo`), click **"Disconnect"**
   - Click **"Connect Git Repository"**
   - Select your renamed `fampo-marketing` repository
   - Confirm the connection

3. **Rename Project:**
   - Go to **Settings** → **General**
   - Find **"Project Name"**
   - Change to: `fampo-marketing`
   - Click **"Save"**
   - ⚠️ Note: This will automatically create a new domain `fampo-marketing.vercel.app`

4. **Update Domains (IMPORTANT - Remove Old Domains and Add New One):**

   **Step 4a: Remove Old Domains**
   
   For each old domain (`fampo.vercel.app` and `famjam-eta.vercel.app`):
   
   - Go to **Settings** → **Domains**
   - Find the domain you want to remove (e.g., `fampo.vercel.app`)
   - Click the **"Edit"** button next to the domain
   - In the edit dialog/modal that opens, look for:
     - A **"Remove"** or **"Delete"** button (usually at the bottom)
     - Or a trash/delete icon
     - Or a dropdown menu with "Remove Domain" option
   - Click **"Remove"** or **"Delete"**
   - Confirm the removal when prompted
   - Repeat for the second old domain (`famjam-eta.vercel.app`)
   
   **Alternative method if "Edit" doesn't show remove option:**
   - Click on the domain name itself (not the Edit button)
   - This might open a detail view where you can remove it
   - Or try right-clicking on the domain row
   
   **Step 4b: Add New Domain**
   
   - In the **Settings** → **Domains** page
   - Click the **"Add Existing"** button (top right)
   - In the input field, type: `fampo-marketing.vercel.app`
   - Click **"Add"** or **"Save"**
   - Wait for Vercel to configure it (shows "Valid Configuration" when ready)
   
   **Note:** If `fampo-marketing.vercel.app` already appears automatically after renaming the project, you can skip Step 4b. Just verify it shows "Valid Configuration".

5. **Redeploy:**
   - Go to **Deployments** tab
   - Click **"Redeploy"** on the latest deployment
   - Or push a new commit to trigger auto-deployment

---

## ⚠️ Important: Domain Behavior After Renaming

**Why `fampo.vercel.app` still works:**
- When you rename a Vercel project, the old domain (`fampo.vercel.app`) doesn't automatically stop working
- Vercel keeps both domains active until you explicitly remove the old one
- The new domain (`fampo-marketing.vercel.app`) is automatically created when you rename the project

**To stop the old domain:**
1. Go to **Settings** → **Domains** in Vercel
2. Find `fampo.vercel.app` in the list
3. Click **Remove** (or the three dots menu → Remove)
4. Confirm the removal

**After removing:**
- `fampo.vercel.app` will stop working (may take a few minutes)
- Only `fampo-marketing.vercel.app` will be active
- Any traffic to the old domain will get an error

---

## ✅ Step 6: Update Package.json (Optional)

The `package.json` currently has `"name": "fampo"`. You can optionally update it to match the repository name:

```json
{
  "name": "fampo-marketing",
  ...
}
```

This is optional and mainly affects npm registry publishing (which you're not doing since it's private).

---

## ✅ Step 7: Update Any CI/CD Configurations

If you have any CI/CD pipelines (GitHub Actions, etc.), check for hardcoded repository references:

- `.github/workflows/*.yml` files
- Any deployment scripts
- Environment variables in CI/CD platforms

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] Git remote URL updated to `fampo-marketing`
- [ ] `git remote -v` shows correct URL
- [ ] `git fetch origin` works without errors
- [ ] Can push to the repository successfully
- [ ] Vercel (or other deployment platform) connected to new repository
- [ ] Deployments are working correctly
- [ ] All CI/CD pipelines updated (if applicable)

---

## 🆘 Troubleshooting

**If `git fetch` or `git push` fails:**
- Verify the repository name is exactly `fampo-marketing` on GitHub
- Check that you have push access to the repository
- Try: `git remote remove origin` then `git remote add origin https://github.com/nagendra2025/fampo-marketing.git`

**If Vercel shows deployment errors:**
- Check that GitHub repository name matches exactly
- Verify git remote URL is correct
- Try disconnecting and reconnecting the repository in Vercel

**If you can't find the "Remove" option for domains in Vercel:**

Try these methods in order:

1. **Method 1: Edit Button**
   - Click **"Edit"** next to the domain
   - Look for a "Remove" or "Delete" button in the modal/dialog
   - It might be at the bottom, or in a dropdown menu within the edit dialog

2. **Method 2: Click on Domain Name**
   - Click directly on the domain name (e.g., `fampo.vercel.app`)
   - This might open a detail page where you can remove it

3. **Method 3: Hover for Options**
   - Hover your mouse over the domain row
   - Look for a trash icon or three-dot menu that appears on hover

4. **Method 4: Use Vercel CLI (Alternative)**
   ```bash
   # Install Vercel CLI if you haven't
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Remove domain (replace with your actual domain)
   vercel domains remove fampo.vercel.app
   vercel domains remove famjam-eta.vercel.app
   
   # Add new domain
   vercel domains add fampo-marketing.vercel.app
   ```

5. **Method 5: Contact Vercel Support**
   - If none of the above work, the domain might be locked or there's a UI issue
   - Go to Vercel Dashboard → Help/Support
   - Ask them to remove the old domains manually

---

## 📝 Quick Command Summary

```bash
# Update remote
git remote set-url origin https://github.com/nagendra2025/fampo-marketing.git

# Verify
git remote -v

# Test connection
git fetch origin

# Push changes (if any)
git push origin main
```

