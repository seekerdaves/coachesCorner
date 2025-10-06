# 🎳 Bowling Coach Social Hub - Deployment Guide

## ✅ Security Features

**Your app is now SAFE to deploy publicly!**

- ❌ No hardcoded API keys in the code
- ✅ Users provide their own free Gemini API keys
- ✅ API keys stored locally in browser only
- ✅ No server costs for you
- ✅ No risk of abuse on your account

## 🚀 Deploy to Netlify (Recommended)

### Step 1: Prepare for Deployment

1. Make sure your code is pushed to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - Bowling Coach App"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy to Netlify

**Option A: Drag & Drop (Easiest)**
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Sign up/login
4. Drag the `dist` folder to Netlify
5. Done! Your app is live

**Option B: Connect GitHub (Better for updates)**
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account
4. Select your repository
5. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click "Deploy site"
7. Done! Auto-deploys on every git push

### Step 3: Configure Domain (Optional)

1. In Netlify, go to "Domain settings"
2. Click "Add custom domain"
3. Follow instructions to point your domain to Netlify

## 📖 User Instructions

### For Users of Your App:

**First Time Setup:**
1. Visit your deployed site
2. Click "Settings" tab
3. Click "🔑 API Key" tab
4. Follow instructions to get a free Google Gemini API key
5. Paste your key and save
6. Start generating posts!

**Google Gemini API Key (Free Tier):**
- 1,500 requests per day (plenty for most coaches)
- Each post generation = 1 request
- Visit: https://aistudio.google.com/apikey

## 🔒 Privacy & Security

- User API keys are stored in their browser's localStorage only
- Keys are never sent to any server except Google's Gemini API
- No database needed
- No backend costs
- Each user pays $0 (free tier is very generous)

## 💰 Monetization Options

If you want to monetize this later:

### Option 1: Keep it Free (Current)
- Users bring their own API key
- You host on Netlify free tier
- Build your brand/portfolio

### Option 2: Freemium SaaS
- Add backend (Netlify Functions + Firebase)
- Move API key to secure backend
- Offer free tier (5 posts/month) + Pro tier ($9.99/month unlimited)
- You control API costs and rate limiting

### Option 3: One-Time Purchase
- Sell on Gumroad/LemonSqueezy for $29-49
- Users download and deploy themselves
- Or sell as a "deploy to Netlify" button

## 🎯 Current Architecture

```
┌─────────────┐
│   Browser   │ ← User provides API key
│ (localStorage)│
└──────┬──────┘
       │
       ↓
┌─────────────────┐
│  Bowling Coach  │ ← Your app (static files)
│       App       │
└──────┬──────────┘
       │
       ↓ (API key sent securely)
┌──────────────────┐
│  Google Gemini   │ ← Free tier (1,500/day)
│       API        │
└──────────────────┘
```

**Costs:**
- Netlify: FREE (or $19/mo for extra features)
- User's API: FREE (Google's free tier)
- Total: $0/month! 🎉

## 🌐 Environment Variables

No environment variables needed for production! Users provide their own API keys through the UI.

For local development, you can optionally add to `.env`:
```
VITE_GEMINI_API_KEY=your_dev_key_here
```

## 📝 Post-Deployment Checklist

- [ ] Site is live and accessible
- [ ] Settings → API Key tab works
- [ ] Can generate posts after adding API key
- [ ] Posts save to Library
- [ ] Can mark posts as "Posted"
- [ ] Profile settings save
- [ ] Resources can be added/edited/deleted

## 🎉 You're Done!

Share your app link with other coaches and tell them:
1. Get a free Google Gemini API key
2. Add it in Settings
3. Start generating engaging social media posts!

---

**Questions?** The app includes built-in instructions in the Settings → API Key tab.
