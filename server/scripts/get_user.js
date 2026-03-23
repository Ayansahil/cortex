import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;

async function getUser() {
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    const user = await db.collection('users').findOne({});
    console.log('User:', JSON.stringify(user, null, 2));
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

getUser();
