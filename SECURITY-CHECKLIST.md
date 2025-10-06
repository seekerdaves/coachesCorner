# 🔒 Security Checklist - BEFORE DEPLOYING

## ✅ Current Status Review

### Your Gemini API Key Status:
- ❌ **OLD API KEY EXPOSED:** `AIzaSyC31lzVqLSGQIVcZ7Osmk654yLiUr1ra8g`
- ⚠️ **ACTION REQUIRED:** This key should be **DELETED** from Google AI Studio
- ✅ **Fixed in code:** Removed from .env file

### What You Need To Do NOW:

## 🚨 STEP 1: Delete the Exposed API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Find key: `AIzaSyC31lzVqLSGQIVcZ7Osmk654yLiUr1ra8g`
3. **DELETE IT** immediately
4. This prevents anyone from using it if they saw your previous deployment

## ✅ STEP 2: Verify .env is NOT in Git

```bash
git status
# Should NOT show .env file
# .gitignore already blocks it ✅
```

## ✅ STEP 3: Set Up Netlify Environment Variables

Go to: https://app.netlify.com/sites/coachpost/settings/env

Add these variables (NO quotes needed):

```
VITE_FIREBASE_API_KEY=AIzaSyDQMviwtsNgRxC5k1S0AdaHuKqsuMXlxVA
VITE_FIREBASE_AUTH_DOMAIN=bowling-coach-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bowling-coach-app
VITE_FIREBASE_STORAGE_BUCKET=bowling-coach-app.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=653246630371
VITE_FIREBASE_APP_ID=1:653246630371:web:e776d86e3617fc1a10f8d6
```

**DO NOT ADD:**
- ❌ `VITE_GEMINI_API_KEY` - Users provide their own!

## ✅ STEP 4: Set Up Firebase Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/project/bowling-coach-app/firestore)
2. Click **Firestore Database**
3. Click **Rules** tab
4. Replace with this (update with YOUR email):

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Whitelist of allowed email addresses
    function isAllowedUser() {
      return request.auth != null && (
        request.auth.token.email in [
          'your-actual-email@gmail.com',     // <- ADD YOUR EMAIL HERE
          // Add more emails as needed
        ]
      );
    }

    // Users can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId
                         && isAllowedUser();
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **Publish**

## ✅ STEP 5: Enable Google Sign-In in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/project/bowling-coach-app/authentication)
2. Click **Authentication** → **Get started**
3. Click **Sign-in method** tab
4. Enable **Google** provider
5. Save

## ✅ STEP 6: Verify Build is Clean

```bash
npm run build
```

Check that build output does NOT contain:
- ❌ Your old Gemini API key
- ❌ Any personal API keys
- ✅ Firebase config is OK to include (public by design)

## ✅ STEP 7: Deploy Clean Build

```bash
# Drag the 'dist' folder to Netlify
# OR push to git and let Netlify auto-deploy
```

## 🔍 STEP 8: Test Deployment

1. Visit: https://coachpost.netlify.app/
2. You should see: **"Sign in with Google"** button
3. Sign in with your whitelisted email
4. Should grant access ✅
5. Try signing in with different email (not whitelisted)
6. Should be blocked ❌

## 🎯 Final Security Status

After following all steps:

✅ **Your old Gemini API key:** DELETED from Google AI Studio
✅ **No API keys in code:** Users provide their own
✅ **Firebase Auth enabled:** Google Sign-In working
✅ **Firestore rules:** Only whitelisted users can access
✅ **Netlify env vars:** Firebase config set
✅ **.env file:** NOT in git repository

## 🔐 What's Safe vs What's Not

### ✅ SAFE to be public:
- Firebase API key (AIzaSyDQMviwtsNgRxC5k1S0AdaHuKqsuMXlxVA)
- Firebase project ID, auth domain, etc.
- Your app source code
- These are meant to be public!

### ❌ NOT SAFE (keep private):
- Gemini API keys (users provide their own)
- Firestore security rules (determines who can access)
- User data in Firestore

## 📝 Current Architecture

```
User visits site
     ↓
Sign in with Google (Firebase Auth)
     ↓
Check whitelist (Firestore Rules)
     ↓
If approved → Access granted
     ↓
User adds THEIR OWN Gemini API key
     ↓
User generates posts (using their key)
     ↓
Data saves to Firestore (their user document only)
```

## 💰 Cost Protection

✅ **Firebase:** Free tier (more than enough)
✅ **Netlify:** Free tier
✅ **Gemini API:** Each user uses their own (not yours!)

**Your total cost: $0/month**

## 🚀 Ready to Deploy Checklist

- [ ] Deleted old Gemini API key from Google AI Studio
- [ ] Verified .env is in .gitignore
- [ ] Added Firebase env vars to Netlify
- [ ] Set up Firestore security rules with your email
- [ ] Enabled Google Sign-In in Firebase
- [ ] Tested build locally
- [ ] Deployed to Netlify
- [ ] Tested sign-in on live site

---

**Once all checked:** You're secure and ready to go! 🎉
