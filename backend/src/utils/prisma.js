const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Log connection on startup
prisma.$connect()
  .then(() => {
    console.log('✓ Prisma connected to MongoDB');
    console.log('Database URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 'NOT SET');
  })
  .catch((err) => {
    console.error('✗ Prisma connection error:', err);
  });

module.exports = prisma;
