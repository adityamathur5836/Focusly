const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Handle Prisma connection errors gracefully
prisma.$connect()
  .then(() => {
    console.log('✓ Prisma connected to MongoDB');
    const dbUrl = process.env.DATABASE_URL || '';
    if (dbUrl) {
      const maskedUrl = dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
      console.log('Database URL:', maskedUrl);
    } else {
      console.error('⚠ DATABASE_URL is not set in environment variables');
    }
  })
  .catch((err) => {
    console.error('✗ Prisma connection error:', err.message);
    if (err.message.includes('authentication failed') || err.message.includes('bad auth')) {
      console.error('⚠ MongoDB authentication failed. Please check:');
      console.error('  1. DATABASE_URL in .env file has correct username and password');
      console.error('  2. Database user has proper permissions');
      console.error('  3. IP address is whitelisted in MongoDB Atlas');
    }
  });

// Handle disconnection on app termination
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
