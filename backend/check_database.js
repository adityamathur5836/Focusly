require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('=== Database Diagnostic ===\n');
    
    // Check connection
    console.log('1. Testing connection...');
    await prisma.$connect();
    console.log('   ✓ Connected to MongoDB\n');

    // Check database name from URL
    const dbUrl = process.env.DATABASE_URL;
    const dbMatch = dbUrl.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/);
    const dbName = dbMatch ? dbMatch[1] : 'unknown';
    console.log('2. Database name from URL:', dbName);
    console.log('   Full URL (hidden):', dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'), '\n');

    // Count collections
    console.log('3. Counting documents...');
    const userCount = await prisma.user.count();
    const noteCount = await prisma.note.count();
    const setCount = await prisma.flashcardSet.count();
    const cardCount = await prisma.flashcard.count();
    const convCount = await prisma.conversation.count();
    const msgCount = await prisma.message.count();

    console.log(`   Users: ${userCount}`);
    console.log(`   Notes: ${noteCount}`);
    console.log(`   Flashcard Sets: ${setCount}`);
    console.log(`   Flashcards: ${cardCount}`);
    console.log(`   Conversations: ${convCount}`);
    console.log(`   Messages: ${msgCount}\n`);

    // Show recent notes
    if (noteCount > 0) {
      console.log('4. Recent notes (last 5):');
      const recentNotes = await prisma.note.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          userId: true,
          createdAt: true
        }
      });
      recentNotes.forEach((note, i) => {
        console.log(`   ${i + 1}. ${note.title}`);
        console.log(`      ID: ${note.id}`);
        console.log(`      User ID: ${note.userId}`);
        console.log(`      Created: ${note.createdAt}`);
      });
      console.log('');
    }

    // Show users
    if (userCount > 0) {
      console.log('5. Users:');
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true
        }
      });
      users.forEach((user, i) => {
        console.log(`   ${i + 1}. ${user.email} (${user.name || 'No name'})`);
        console.log(`      ID: ${user.id}`);
        console.log(`      Created: ${user.createdAt}`);
      });
    }

    console.log('\n=== End Diagnostic ===');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

