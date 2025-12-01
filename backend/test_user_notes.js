require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserNotes() {
  try {
    console.log('Checking users and their notes...\n');
    
    // Get all users
    const users = await prisma.user.findMany({
      include: {
        notes: {
          select: {
            id: true,
            title: true,
            createdAt: true
          }
        }
      }
    });

    console.log(`Found ${users.length} user(s):\n`);
    
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Name: ${user.name || 'N/A'}`);
      console.log(`  Notes count: ${user.notes.length}`);
      
      if (user.notes.length > 0) {
        console.log(`  Notes:`);
        user.notes.forEach((note, noteIndex) => {
          console.log(`    ${noteIndex + 1}. ${note.title} (ID: ${note.id}, Created: ${note.createdAt})`);
        });
      }
      console.log('');
    });

    // Get all notes regardless of user
    const allNotes = await prisma.note.findMany({
      select: {
        id: true,
        title: true,
        userId: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    console.log(`\nAll notes in database (last 10): ${allNotes.length}`);
    allNotes.forEach((note, index) => {
      console.log(`  ${index + 1}. ${note.title}`);
      console.log(`     ID: ${note.id}`);
      console.log(`     User ID: ${note.userId}`);
      console.log(`     Created: ${note.createdAt}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserNotes();

