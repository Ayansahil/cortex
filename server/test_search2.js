import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from './src/core/config/env.config.js';
import User from './src/core/database/models/User.model.js';
import fetch from 'node-fetch'; // native fetch in Node 18+

async function run() {
  try {
    await mongoose.connect(config.database.uri);
    const user = await User.findOne();
    const token = jwt.sign({ userId: user._id }, config.jwt.secret);
    
    // Test the search endpoint directly
    const res = await fetch('http://localhost:5001/v1/search?q=Wikipedia,%20the%20free%20encyclopedia', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const data = await res.json();
    console.log('Status Code:', res.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Fetch error:', err);
  } finally {
    process.exit(0);
  }
}

run();
