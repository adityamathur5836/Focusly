const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/authRoutes');
const noteRoutes = require('./src/routes/noteRoutes');
const flashcardRoutes = require('./src/routes/flashcardRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const userRoutes = require('./src/routes/userRoutes');
const chatRoutes = require('./src/routes/chatRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://focusly-alia.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // For development, allow any localhost port
      if (origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        // Log the blocked origin for debugging
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('Focusly API is running');
});

app.get('/api/health', async (req, res) => {
  const hasDbUrl = !!process.env.DATABASE_URL;
  const dbUrlSet = hasDbUrl ? 'Set' : 'NOT SET';
  const dbUrlPreview = hasDbUrl 
    ? process.env.DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')
    : 'Missing';
  
  // Test database connection
  let dbConnected = false;
  let dbError = null;
  if (hasDbUrl) {
    try {
      const { PrismaClient } = require('@prisma/client');
      const testPrisma = new PrismaClient();
      await testPrisma.$connect();
      await testPrisma.$disconnect();
      dbConnected = true;
    } catch (err) {
      dbError = err.message;
    }
  }
  
  // Check Gemini API key status
  const geminiApiKey = process.env.GEMINI_API;
  const geminiConfigured = !!geminiApiKey && geminiApiKey.trim() !== '';
  const geminiPreview = geminiConfigured 
    ? `${geminiApiKey.substring(0, 10)}...${geminiApiKey.substring(geminiApiKey.length - 4)}`
    : 'Not Set';
  
  res.json({
    status: 'ok',
    geminiApiKeyConfigured: geminiConfigured,
    geminiApiKeyPreview: geminiPreview,
    databaseUrl: dbUrlPreview,
    databaseUrlStatus: dbUrlSet,
    databaseConnected: dbConnected,
    databaseError: dbError,
    timestamp: new Date().toISOString(),
    instructions: !geminiConfigured ? 'Add GEMINI_API environment variable in Render dashboard' : undefined
  });
});


app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File is too large. Maximum file size is 50MB.',
        error: 'FILE_TOO_LARGE'
      });
    }
    return res.status(400).json({
      message: err.message,
      error: err.code
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
