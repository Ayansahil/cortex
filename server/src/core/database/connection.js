import mongoose from 'mongoose';
import config from '../config/env.config.js';

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      const uri = config.env === 'test' ? config.database.testUri : config.database.uri;

      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      this.connection = await mongoose.connect(uri, options);

      console.log(`MongoDB Connected: ${this.connection.connection.host}`);

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
      });

      return this.connection;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      console.log('MongoDB Disconnected');
    }
  }

  getConnection() {
    return this.connection;
  }
}

const database = new Database();

export default database;
