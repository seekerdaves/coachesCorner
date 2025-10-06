

# 🔥 Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or use existing project
3. Name it: "Bowling Coach App" (or whatever you prefer)
4. **Disable** Google Analytics (not needed)
5. Click "Create project"

## Step 2: Enable Google Authentication

1. In Firebase Console, go to **Authentication** → **Get started**
2. Click **Sign-in method** tab
3. Click **Google** → Enable
4. Add your email as authorized domain if asked
5. Click **Save**

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll add custom rules)
4. Choose a location (e.g., `us-central`)
5. Click **Enable**

## Step 4: Set Up Security Rules (WHITELIST)

1. In Firestore, go to **Rules** tab
2. Copy the rules from `firestore.rules` file in your project
3. **IMPORTANT:** Replace `your-email@gmail.com` with YOUR actual Gmail address
4. Add any other emails you want to allow (assistant coaches, etc.)
5. Click **Publish**

**Security Rules Example:**
```javascript
function isAllowedUser() {
  return request.auth != null && (
    request.auth.token.email in [
      'john.smith@gmail.com',        // You
      'jane.doe@gmail.com',          // Assistant coach
      'team-manager@gmail.com',      // Team manager
    ]
  );
}
```

## Step 5: Get Firebase Configuration

1. In Firebase Console, click **Project settings** (gear icon)
2. Scroll down to "Your apps"
3. Click **Web** icon (`</>`)
4. Register app name: "Bowling Coach Web App"
5. **Don't** check "Firebase Hosting"
6. Click **Register app**
7. Copy the `firebaseConfig` object

## Step 6: Add to Your Project

1. Create `.env` file in your project root (copy from `.env.example`)
2. Add your Firebase config:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=bowling-coach-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bowling-coach-app
VITE_FIREBASE_STORAGE_BUCKET=bowling-coach-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

3. **IMPORTANT:** Add `.env` to your `.gitignore` file (should already be there)

## Step 7: Test Locally

```bash
npm run dev
```

1. Visit localhost
2. You should see "Sign in with Google" button
3. Sign in with your whitelisted Google account
4. If successful, you'll see the app!
5. If you see "Access denied", check:
   - Your email is in the whitelist in Firestore Rules
   - Rules are published
   - Try signing out and back in

## Step 8: Deploy to Netlify

1. **Remove API key from .env before committing:**
   - Your Gemini API key should NOT be in the repo
   - Users will add their own via Settings

2. **Add Firebase config to Netlify:**
   - Go to Netlify → Site settings → Build & deploy → Environment variables
   - Add all `VITE_FIREBASE_*` variables
   - Values from Firebase console

3. **Deploy:**
```bash
git add .
git commit -m "Add Firebase authentication"
git push
```

4. Netlify will auto-deploy!

## Adding/Removing Users

To allow new users to access your app:

1. Get their Gmail address
2. Go to Firebase Console → Firestore → Rules
3. Add their email to the whitelist array
4. Click **Publish**
5. They can now sign in!

To remove access:
1. Remove their email from the whitelist
2. Publish rules
3. They'll be blocked on next page load

## Security Notes

✅ **What's Protected:**
- Only whitelisted emails can access the app
- Users can only read/write their own data
- API keys stored in user's browser only
- All data syncs to Firestore (accessible from any device)

✅ **What's NOT Protected:**
- Your Firebase config (api keys in env) - this is fine, they're meant to be public
- The Gemini API keys are user-provided, not in your codebase

## Costs

**Firebase Free Tier (Spark Plan):**
- 1 GB stored data
- 10 GB/month network egress
- 50,000 reads/day
- 20,000 writes/day

**For a few coaches:** Completely FREE forever!

**If you exceed limits:** Upgrade to Pay-as-you-go (Blaze Plan)
- Still essentially free for small usage
- ~$0.25/month for 5-10 active users

## Troubleshooting

**"Access denied" after sign in:**
- Check Firestore Rules - is your email in the whitelist?
- Make sure rules are published
- Try different browser/incognito

**"Firebase not configured":**
- Check `.env` file has all VITE_FIREBASE_* variables
- Restart dev server after adding .env
- On Netlify, check environment variables are set

**Can't sign in at all:**
- Check Firebase Authentication is enabled
- Check Google sign-in method is enabled
- Check authorized domains in Firebase console

---

🎉 **You're done!** Your app is now secure with Google Sign-In!
