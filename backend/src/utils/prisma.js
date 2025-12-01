const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Handle Prisma connection errors gracefully
const connectPrisma = async () => {
  const dbUrl = process.env.DATABASE_URL || '';
  
  if (!dbUrl) {
    console.error('⚠⚠⚠ CRITICAL: DATABASE_URL is not set in environment variables!');
    console.error('   Please set DATABASE_URL in your Render environment variables.');
    console.error('   Expected format: mongodb+srv://username:password@cluster.mongodb.net/database');
    return;
  }
  
  // Check for common issues in connection string
  if (dbUrl.includes('<db_password>') || dbUrl.includes('password')) {
    console.error('⚠⚠⚠ WARNING: DATABASE_URL appears to have a placeholder password!');
    console.error('   Please replace <db_password> with your actual MongoDB password.');
  }
  
  if (!dbUrl.includes('/focusly')) {
    console.warn('⚠ WARNING: DATABASE_URL might be missing database name (/focusly)');
  }
  
  try {
    await prisma.$connect();
    console.log('✓ Prisma connected to MongoDB');
    const maskedUrl = dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log('Database URL:', maskedUrl);
  } catch (err) {
    console.error('✗ Prisma connection error:', err.message);
    if (err.message.includes('authentication failed') || err.message.includes('bad auth')) {
      console.error('⚠ MongoDB authentication failed. Please check:');
      console.error('  1. DATABASE_URL has correct username and password (no placeholders)');
      console.error('  2. Password is URL-encoded if it contains special characters');
      console.error('  3. Database user exists and has proper permissions in MongoDB Atlas');
      console.error('  4. Network Access in MongoDB Atlas allows connections (0.0.0.0/0 for all)');
      console.error('  5. Connection string includes database name: /focusly');
      
      // Show what we're trying to connect to
      const urlParts = dbUrl.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
      if (urlParts) {
        console.error('\nConnection details:');
        console.error('  Username:', urlParts[1]);
        console.error('  Password:', urlParts[2] ? '***' : 'MISSING');
        console.error('  Cluster:', urlParts[3]);
        console.error('  Database:', urlParts[4] || 'MISSING');
      }
    }
  }
};

// Connect on startup
connectPrisma();

// Handle disconnection on app termination
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
