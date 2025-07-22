import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';

const connectToDatabase = async () => {
  if (!DB_URI) throw new Error('Missing DB_URI in env');

  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });

    const { host, port, name } = mongoose.connection;
    console.log(`✅ Connected to MongoDB at ${host}:${port}/${name} [${NODE_ENV}]`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); 
  }
};

export default connectToDatabase;
