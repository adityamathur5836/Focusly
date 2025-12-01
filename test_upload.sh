#!/bin/bash

# Test File Upload Script for Focusly
# This script helps you test file uploads and text extraction

echo "🧪 Focusly File Upload Test Script"
echo "===================================="
echo ""

# Check if file argument is provided
if [ -z "$1" ]; then
    echo "❌ Error: No file specified"
    echo ""
    echo "Usage: ./test_upload.sh <path-to-file>"
    echo "Example: ./test_upload.sh ~/Documents/test.pdf"
    echo ""
    exit 1
fi

FILE_PATH="$1"

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
    echo "❌ Error: File not found: $FILE_PATH"
    exit 1
fi

echo "📄 Testing file: $FILE_PATH"
echo ""

# Get auth token from browser cookies
# Note: You'll need to be logged in to the app first
echo "⚠️  Make sure you're logged in to Focusly in your browser"
echo "   This test uses your authentication cookie"
echo ""

# Test the file extraction endpoint
echo "🔍 Testing file extraction..."
echo ""

# Using curl to test the endpoint
# Note: This assumes you have a valid session cookie
# You may need to manually add your auth token

RESPONSE=$(curl -s -X POST http://localhost:5001/api/upload/test \
  -H "Content-Type: multipart/form-data" \
  --cookie-jar cookies.txt \
  --cookie cookies.txt \
  -F "file=@$FILE_PATH" \
  2>&1)

echo "Response:"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

# Check if successful
if echo "$RESPONSE" | grep -q '"success": true'; then
    echo "✅ Test passed! File can be processed successfully."
else
    echo "❌ Test failed. See error message above."
fi

echo ""
echo "💡 Tip: Check the backend terminal for detailed logs"
