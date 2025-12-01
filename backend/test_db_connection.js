require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set (hidden)' : 'NOT SET');
    
    // Test connection
    await prisma.$connect();
    console.log('✓ Connected to MongoDB successfully');

    // Try to create a test note
    console.log('\nCreating test note...');
    const testNote = await prisma.note.create({
      data: {
        title: 'Test Note - ' + new Date().toISOString(),
        content: 'This is a test note to verify database connection',
        tags: 'test',
        userId: '000000000000000000000000', // Dummy ObjectId for testing
      },
    });
    console.log('✓ Test note created:', {
      id: testNote.id,
      title: testNote.title,
      createdAt: testNote.createdAt
    });

    // Try to read it back
    console.log('\nReading test note back...');
    const foundNote = await prisma.note.findUnique({
      where: { id: testNote.id }
    });
    
    if (foundNote) {
      console.log('✓ Test note found in database:', {
        id: foundNote.id,
        title: foundNote.title
      });
    } else {
      console.log('✗ Test note NOT found in database!');
    }

    // Count all notes
    const noteCount = await prisma.note.count();
    console.log(`\nTotal notes in database: ${noteCount}`);

    // List all collections
    console.log('\nChecking collections...');
    const collections = await prisma.$runCommandRaw({ listCollections: 1 });
    console.log('Collections:', collections);

    // Clean up test note
    console.log('\nCleaning up test note...');
    await prisma.note.delete({
      where: { id: testNote.id }
    });
    console.log('✓ Test note deleted');

  } catch (error) {
    console.error('✗ Error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
  } finally {
    await prisma.$disconnect();
    console.log('\nDisconnected from database');
  }
}

testConnection();

