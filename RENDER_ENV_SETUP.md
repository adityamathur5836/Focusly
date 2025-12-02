# Setting Up Environment Variables in Render

## Issue
Error: "Gemini API key is not configured. Please add GEMINI_API to your environment variables."

This means the `GEMINI_API` environment variable is not set in your Render deployment.

## Step-by-Step Instructions

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or use an existing key
4. Copy the API key (it starts with `AIza...`)

### 2. Add Environment Variable in Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Sign in to your account

2. **Navigate to Your Backend Service**
   - Click on your backend service (e.g., "focusly-efcu")
   - Or go to: https://dashboard.render.com/web/[your-service-name]

3. **Open Environment Tab**
   - Click on "Environment" in the left sidebar
   - Or scroll down to "Environment Variables" section

4. **Add GEMINI_API Variable**
   - Click "Add Environment Variable" or "+ Add"
   - **Key:** `GEMINI_API`
   - **Value:** Paste your Gemini API key (e.g., `AIzaSyA_Pb0eUmiTqg75cGqgYWnmr1Ti__5cZI4`)
   - **Important:** No spaces, no quotes, just the key itself
   - Click "Save Changes"

5. **Redeploy Service**
   - After saving, Render will automatically redeploy
   - Or click "Manual Deploy" → "Deploy latest commit"
   - Wait 2-3 minutes for deployment to complete

### 3. Verify Setup

1. **Check Health Endpoint**
   - Visit: `https://focusly-efcu.onrender.com/api/health`
   - Look for: `"geminiApiKeyConfigured": true`
   - If `false`, the variable is still not set correctly

2. **Test Notes/Flashcard Generation**
   - Try generating notes or flashcards
   - Should work without the API key error

## Required Environment Variables

Make sure these are all set in Render:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | `your-secret-key` |
| `GEMINI_API` | Google Gemini API key | `AIzaSyA_Pb0eUmiTqg75cGqgYWnmr1Ti__5cZI4` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (optional) | `5001` |

## Common Issues

### Issue: "geminiApiKeyConfigured: false" after setting
**Solutions:**
- Check for extra spaces in the value
- Make sure the key name is exactly `GEMINI_API` (case-sensitive)
- Remove any quotes around the value
- Redeploy the service after making changes

### Issue: "Invalid API key" error
**Solutions:**
- Verify the API key in Google AI Studio
- Make sure the key is active and not revoked
- Check for any typos when copying the key
- Regenerate the key if needed

### Issue: "API quota exceeded"
**Solutions:**
- Check your Google Cloud Console for API usage
- Verify your billing is set up correctly
- Wait for quota reset or upgrade your plan

## Quick Test

After setting up, test with:

```bash
curl https://focusly-efcu.onrender.com/api/health
```

Expected response should include:
```json
{
  "status": "ok",
  "geminiApiKeyConfigured": true,
  ...
}
```

## Security Notes

- ✅ Never commit API keys to git
- ✅ Use environment variables for all secrets
- ✅ Rotate keys if they're accidentally exposed
- ✅ Use different keys for development and production

## Need Help?

If you're still having issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Look for "GEMINI_API" in the logs
3. Verify the health endpoint response
4. Try regenerating the API key

