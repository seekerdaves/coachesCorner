# API Key Issue - QUICK FIX

## Problem
Your Google Cloud Console API key doesn't work because the JavaScript SDK only supports Google AI Studio API keys.

## Solution (2 minutes)

### Step 1: Get Google AI Studio API Key
1. Go to: **https://aistudio.google.com/apikey**
2. Sign in with `davesfx@gmail.com` (or any Google account)
3. Click **"Create API key"**
4. Click **"Create API key in new project"** (or select existing)
5. **Copy the API key** (starts with `AIza...`)

### Step 2: Update Your .env File
1. Open `bowling-coach-app/.env`
2. Replace the old key with the new one:
   ```
   VITE_GEMINI_API_KEY=AIzaYourNewKeyFromAIStudio
   ```
3. **Save the file**

### Step 3: Test
1. **Refresh your browser** (Ctrl+Shift+R)
2. Click **"Generate Post"**
3. It should work immediately!

## Why This Works

- **Google AI Studio keys**: Work with the JavaScript SDK (v1beta API) ✅
- **Google Cloud Console keys**: Only work with v1 API (not supported in JS SDK) ❌

The Google AI Studio API key has the same free tier limits and will work perfectly for this app.

## Note on Billing

Google AI Studio API keys are FREE and include:
- 60 requests per minute
- 1,500 requests per day
- 1 million tokens per day

This is more than enough for creating bowling posts!

If you need higher limits later, you can enable billing in Google Cloud Console for the AI Studio project.
