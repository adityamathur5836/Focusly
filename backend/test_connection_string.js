require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const dbUrl = process.env.DATABASE_URL;
  console.log('Testing connection with URL:', dbUrl ? dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 'NOT SET');
  
  // Check if password needs encoding
  const passwordMatch = dbUrl?.match(/\/\/[^:]+:([^@]+)@/);
  if (passwordMatch) {
    const password = passwordMatch[1];
    const encoded = encodeURIComponent(password);
    if (password !== encoded) {
      console.log('\n⚠ Password contains special characters that may need encoding:');
      console.log('Original:', password);
      console.log('Encoded:', encoded);
      console.log('\nTry using the encoded version in your connection string.');
    }
  }
  
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('\n✓ Connection successful!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('\n✗ Connection failed:', error.message);
    if (error.message.includes('authentication failed')) {
      console.log('\nTroubleshooting steps:');
      console.log('1. Verify the password is correct in MongoDB Atlas');
      console.log('2. Check if password needs URL encoding (special characters)');
      console.log('3. Verify database user has read/write permissions');
      console.log('4. Check Network Access in MongoDB Atlas allows your IP');
      console.log('5. Try resetting the database user password in MongoDB Atlas');
    }
  }
}

testConnection();

