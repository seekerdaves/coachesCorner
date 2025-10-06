# Quick Setup Guide

## ✅ Step-by-Step Setup

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key (starts with `AIza...`)

### 2. Add API Key to the App

1. Open the `.env` file in the `bowling-coach-app` folder
2. Replace the empty value with your API key:
   ```
   VITE_GEMINI_API_KEY=AIzaYourActualKeyHere
   ```
3. Save the file

### 3. Verify the App is Running

1. The dev server should already be running at: **http://localhost:5174**
2. Open this URL in your browser
3. You should see the Bowling Coach Post Generator interface
4. The API warning banner should disappear once you add your key and refresh

### 4. Test the App

1. Leave the default settings (Tip of the Day, All Levels, Proper Stance)
2. Click "Generate Post"
3. Wait 2-5 seconds for the AI to generate content
4. Review the generated post
5. Click "Copy to Clipboard" to copy it
6. Paste into Facebook or wherever you want to post

## 🔒 Security Checklist

Before pushing to GitHub, verify:

- [ ] `.env` file contains your API key (for local use)
- [ ] `.env` is NOT shown in `git status` (it should be ignored)
- [ ] Only `.env.example` will be committed (this is safe, it has no real key)
- [ ] Run `git status` and confirm `.env` is not listed

### To Test Git Safety:

```bash
cd bowling-coach-app
git status
```

You should see `.env.example` in the list, but **NOT** `.env`.

## 🚀 First Commit (Safe to Push)

When you're ready to push to GitHub:

```bash
cd bowling-coach-app

# Add all files (except .env, which is auto-ignored)
git add .

# Create your first commit
git commit -m "Initial commit: Bowling Coach Post Generator"

# Add your GitHub repository
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git

# Push to GitHub
git push -u origin master
```

## ⚠️ If You Accidentally Commit .env

If you somehow commit the `.env` file with your API key:

1. **Immediately rotate your API key** at [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Remove the file from git history:
   ```bash
   git rm --cached .env
   git commit -m "Remove .env file"
   ```
3. Update your local `.env` with the new API key

## 📝 Common Issues

### "API Key not found" error
- Make sure you saved the `.env` file
- Verify the key starts with `AIza`
- Restart the dev server (Ctrl+C, then `npm run dev`)

### White screen / blank page
- Check the browser console for errors (F12)
- Make sure the dev server is running
- Try refreshing the page (Ctrl+F5)

### Generated content is generic
- Add more context in the "Additional Context" field
- Try different topics
- Regenerate a few times to get different variations

## 🎯 Next Steps

1. ✅ Add your API key to `.env`
2. ✅ Test generating a post
3. ✅ Verify `.env` is ignored by git
4. ✅ Commit and push to GitHub
5. ✅ Start creating awesome bowling posts!

## 🆘 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review the USBC resources linked in the app
- Test with different post types and topics to find what works best
