# Getting Your Gemini API Key to Work

## The Problem
You're seeing: `Model not found. Your API key may not have access to this model.`

## Solutions

### Option 1: Get a New API Key (Recommended)

The Gemini API has been updated, and older API keys may not work with current models.

1. **Go to Google AI Studio**: https://aistudio.google.com/app/apikey
   - Note: Use `aistudio.google.com`, NOT `makersuite.google.com`

2. **Sign in with your Google account**

3. **Click "Get API Key" or "Create API Key"**

4. **Choose "Create API key in new project"** (or select an existing project)

5. **Copy the new API key** (starts with `AIza...`)

6. **Update your `.env` file**:
   ```
   VITE_GEMINI_API_KEY=AIzaYourNewKeyHere
   ```

7. **Refresh the browser** (Ctrl+F5 or Cmd+Shift+R)

### Option 2: Try Different Model (If Key is New)

If you just created your API key, you might need to wait a few minutes or enable the API:

1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
2. Make sure "Generative Language API" is **enabled**
3. Wait 2-5 minutes for changes to propagate
4. Try again

### Option 3: Check API Key Format

Your API key should:
- Start with `AIza`
- Be about 39 characters long
- Have no spaces before or after it
- Be on a single line in the `.env` file

**Correct format in `.env`:**
```
VITE_GEMINI_API_KEY=AIzaSyABCDEF1234567890abcdefGHIJKLMNOP
```

**Incorrect formats:**
```
# ❌ Has spaces
VITE_GEMINI_API_KEY= AIzaSy...

# ❌ Missing equals sign
VITE_GEMINI_API_KEY AIzaSy...

# ❌ Wrapped in quotes (usually not needed)
VITE_GEMINI_API_KEY="AIzaSy..."

# ❌ Multiple lines
VITE_GEMINI_API_KEY=AIzaSy
...continuing on next line
```

## Testing Your API Key

Once you have your new API key:

1. **Stop the dev server** (Ctrl+C in the terminal)
2. **Update `.env`** with your new key
3. **Restart the dev server**:
   ```bash
   cd bowling-coach-app
   npm run dev
   ```
4. **Open http://localhost:5174** (or the port shown)
5. **Try generating a post**

## Still Having Issues?

### Check the Browser Console
1. Press **F12** to open developer tools
2. Go to the **Console** tab
3. Look for any error messages
4. Share those errors if you need more help

### Verify the API Key Works
You can test your API key directly at:
https://aistudio.google.com/app/prompts/new_freeform

If it works there but not in the app, the issue is with the app configuration.

## Common Error Messages

**"API_KEY_INVALID"**
- Your API key is incorrect or malformed
- Get a new one from https://aistudio.google.com/app/apikey

**"404 - models/gemini-pro not found"**
- The Generative Language API is not enabled
- Enable it at: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

**"RESOURCE_EXHAUSTED" or "quota"**
- You've hit the free tier limit
- Wait until tomorrow or upgrade to a paid plan

**"Failed to fetch"**
- Network issue or CORS problem
- Check your internet connection
- Make sure you're not using a VPN that blocks Google APIs

## Free Tier Limits

Google's Gemini API free tier includes:
- 60 requests per minute
- 1,500 requests per day
- 1 million tokens per day

This should be plenty for creating bowling posts!

## Need More Help?

1. Verify your API key at: https://aistudio.google.com/app/apikey
2. Check the Google AI documentation: https://ai.google.dev/tutorials/setup
3. Make sure you're using the NEW Google AI Studio URL (aistudio.google.com, not makersuite)
