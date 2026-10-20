const PocketBase = require('pocketbase/cjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pb = new PocketBase(process.env.EXPO_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

async function setupCollections() {
  try {
    console.log('Authenticating as admin...');
    
    const adminEmail = process.env.PB_ADMIN_EMAIL;
    const adminPassword = process.env.PB_ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      console.error('\n✗ PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set in .env');
      console.log('\nPlease:');
      console.log('1. Start PocketBase: npm run pocketbase:start');
      console.log('2. Open http://127.0.0.1:8090/_/');
      console.log('3. Create an admin account');
      console.log('4. Add credentials to .env file');
      process.exit(1);
    }
    
    await pb.admins.authWithPassword(adminEmail, adminPassword);
    console.log('✓ Authenticated as admin\n');

    const schemaPath = path.join(__dirname, 'schema.json');
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));

    console.log('Creating collections...\n');

    for (const collectionData of schema) {
      try {
        const existing = await pb.collections.getList(1, 1, {
          filter: `name="${collectionData.name}"`,
        });

        if (existing.items.length > 0) {
          console.log(`⊙ Collection "${collectionData.name}" already exists, skipping`);
        } else {
          await pb.collections.create(collectionData);
          console.log(`✓ Created collection: ${collectionData.name}`);
        }
      } catch (error) {
        console.error(`✗ Failed to create collection ${collectionData.name}:`, error.message);
      }
    }

    console.log('\n✓ Collections setup complete!');
    console.log('\nYou can now run: npm run pocketbase:seed');
  } catch (error) {
    console.error('\n✗ Setup failed:', error);
    process.exit(1);
  }
}

setupCollections();
