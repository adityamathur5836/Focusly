# Setting Up Gemini API Key

## Quick Setup

1. **Get your Gemini API Key:**
   - Go to https://makersuite.google.com/app/apikey
   - Click "Create API Key"
   - Copy the generated key

2. **Add to your `.env` file:**
   - Open `/backend/.env`
   - Add this line:
   ```
   GEMINI_API=your_api_key_here
   ```
   - Replace `your_api_key_here` with your actual API key

3. **Restart the backend server:**
   - Stop the backend (Ctrl+C in the terminal)
   - Run `npm run dev` again

## Example `.env` file:

```env
DATABASE_URL="mysql://root:password@localhost:3306/focusly"
JWT_SECRET="supersecretkey_change_me_in_production"
PORT=5001
GEMINI_API=AIzaSyD...your_key_here
```

## Testing

After adding the API key:
1. Upload a PDF or TXT file in the dashboard
2. Select "Quick Notes" or "Detailed Notes"
3. Click "Generate Notes"
4. The AI should process your file and create notes

## Troubleshooting

**Error: "Gemini API key not configured"**
- Make sure you added `GEMINI_API=...` to your `.env` file
- Restart the backend server after adding the key

**Error: "Failed to generate notes with AI"**
- Check that your API key is valid
- Ensure you have internet connection
- Try with a different file

**Error: "Could not extract sufficient text"**
- Make sure your PDF contains actual text (not just images)
- Try with a TXT file first to test
- File should have at least 50 characters of text
