# Render Deployment Setup Guide

## Environment Variables Required in Render

Your backend on Render needs the following environment variables set:

### 1. DATABASE_URL (Required)
```
mongodb+srv://aditya2024_db_user:vHXStPSLt7xv4hwS@focusly.uu4djg3.mongodb.net/focusly?appName=Focusly
```

### 2. JWT_SECRET (Required)
```
@ditya_5934
```

### 3. GEMINI_API (Required)
```
AIzaSyA_Pb0eUmiTqg75cGqgYWnmr1Ti__5cZI4
```

### 4. FRONTEND_URL (Optional but Recommended)
```
https://focusly-alia.vercel.app
```

### 5. NODE_ENV (Optional)
```
production
```

## How to Set Environment Variables in Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Select your backend service
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add each variable above with its value
6. Click **Save Changes**
7. Render will automatically redeploy your service

## Important Notes

- Make sure there are **NO spaces** around the `=` sign
- The DATABASE_URL must include the database name: `/focusly` (not just `/`)
- After adding environment variables, wait for the service to redeploy
- Check the logs to verify the connection is successful

## Verify Connection

After deployment, check the logs. You should see:
```
✓ Prisma connected to MongoDB
Database URL: mongodb+srv://***:***@focusly.uu4djg3.mongodb.net/focusly?appName=Focusly
```

If you see authentication errors, double-check:
1. The password in DATABASE_URL is correct
2. The database user has proper permissions in MongoDB Atlas
3. Your IP address is whitelisted in MongoDB Atlas (or allow all IPs: 0.0.0.0/0)

