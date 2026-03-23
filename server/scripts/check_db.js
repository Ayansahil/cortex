import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI not found in .env');
  process.exit(1);
}

async function checkDb() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`${col.name}: ${count} documents`);
    }

    // Check one highlight if exists
    const highlights = await db.collection('highlights').find().limit(1).toArray();
    if (highlights.length > 0) {
      console.log('Sample Highlight:', JSON.stringify(highlights[0], null, 2));
    } else {
      console.log('No highlights found');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

checkDb();
