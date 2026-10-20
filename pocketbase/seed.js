const PocketBase = require('pocketbase/cjs');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const pb = new PocketBase(process.env.EXPO_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

const seedData = {
  users: [
    {
      username: 'beatmaker_x',
      email: 'beatmaker@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
      feedbackCredits: 5,
      bio: 'Late night producer from Brooklyn',
    },
    {
      username: 'producer_jay',
      email: 'jay@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
      feedbackCredits: 3,
      bio: 'Trap and drill beats',
    },
  ],
  beats: [
    {
      title: 'Midnight Drive',
      audioUrl: 'https://example.com/audio/beat1.mp3',
      bpm: 140,
      key: 'Am',
      tags: ['trap', 'dark', 'moody'],
      plays: 45,
      likes: 12,
      comments: 3,
    },
    {
      title: 'Late Night Thoughts',
      audioUrl: 'https://example.com/audio/beat2.mp3',
      bpm: 85,
      key: 'Gm',
      tags: ['lofi', 'chill', 'study'],
      plays: 89,
      likes: 23,
      comments: 7,
    },
  ],
  comments: [
    {
      content: 'Fire beat bro, that 808 hits different',
    },
    {
      content: 'Love the atmosphere on this one. The hi-hats could be a bit louder though',
    },
    {
      content: 'This goes hard! What VST did you use for that lead?',
    },
  ],
};

async function seed() {
  try {
    console.log('Authenticating as admin...');
    
    const adminEmail = process.env.PB_ADMIN_EMAIL;
    const adminPassword = process.env.PB_ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      throw new Error('PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set in .env');
    }
    
    await pb.admins.authWithPassword(adminEmail, adminPassword);
    console.log('✓ Authenticated as admin');

    console.log('\nSeeding database...');

    const users = [];
    for (const userData of seedData.users) {
      try {
        const existingUsers = await pb.collection('users').getFullList({
          filter: `username = "${userData.username}"`,
        });
        
        if (existingUsers.length > 0) {
          console.log(`⊙ User ${userData.username} already exists, skipping`);
          users.push(existingUsers[0]);
        } else {
          const user = await pb.collection('users').create(userData);
          users.push(user);
          console.log(`✓ Created user: ${user.username}`);
        }
      } catch (error) {
        console.error(`✗ Failed to create user ${userData.username}:`, error.message);
      }
    }

    if (users.length === 0) {
      console.error('No users available. Skipping beats and comments.');
      return;
    }

    const beats = [];
    for (const [index, beatData] of seedData.beats.entries()) {
      try {
        const existingBeats = await pb.collection('beats').getFullList({
          filter: `title = "${beatData.title}"`,
        });
        
        if (existingBeats.length > 0) {
          console.log(`⊙ Beat "${beatData.title}" already exists, skipping`);
          beats.push(existingBeats[0]);
        } else {
          const beat = await pb.collection('beats').create({
            ...beatData,
            userId: users[index % users.length].id,
          });
          beats.push(beat);
          console.log(`✓ Created beat: ${beat.title}`);
        }
      } catch (error) {
        console.error(`✗ Failed to create beat ${beatData.title}:`, error.message);
      }
    }

    if (beats.length === 0) {
      console.error('No beats available. Skipping comments.');
      return;
    }

    for (const [index, commentData] of seedData.comments.entries()) {
      try {
        const existingComments = await pb.collection('comments').getFullList({
          filter: `content = "${commentData.content.replace(/"/g, '\\"')}"`,
        });
        
        if (existingComments.length > 0) {
          console.log(`⊙ Comment already exists, skipping`);
        } else {
          await pb.collection('comments').create({
            ...commentData,
            beatId: beats[0].id,
            userId: users[index % users.length].id,
          });
          console.log(`✓ Created comment on beat: ${beats[0].title}`);
        }
      } catch (error) {
        console.error(`✗ Failed to create comment:`, error.message);
      }
    }

    console.log('\n✓ Database seeded successfully!');
  } catch (error) {
    console.error('✗ Seed failed:', error);
    process.exit(1);
  }
}

seed();
