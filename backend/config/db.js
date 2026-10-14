import mongoose from 'mongoose';

let mongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster_relief';
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  const isAtlas = uri.startsWith('mongodb+srv://');

  try {
    console.log(`[Database] Attempting connection to MongoDB Atlas (${maskedUri})...`);
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000
    });
    
    mongoConnected = true;
    console.log('\x1b[32m%s\x1b[0m', `[Database] MongoDB Atlas connected successfully! Real persistence active on cluster.`);
  } catch (err) {
    mongoConnected = false;
    console.log('\x1b[31m%s\x1b[0m', `--------------------------------------------------------`);
    console.log('\x1b[31m%s\x1b[0m', `[Database] MongoDB Atlas connection FAILED.`);
    console.log('\x1b[31m%s\x1b[0m', `[Database]    Target URI    : ${maskedUri}`);
    console.log('\x1b[31m%s\x1b[0m', `[Database]    Error         : ${err.message}`);
    if (isAtlas) {
      console.log('\x1b[33m%s\x1b[0m', `[Database] DIAGNOSIS:`);
      console.log('\x1b[33m%s\x1b[0m', `   1. Current network/ISP may be blocking outbound TCP port 27017.`);
      console.log('\x1b[33m%s\x1b[0m', `   2. Verify your current IP is whitelisted in MongoDB Atlas -> Network Access.`);
      console.log('\x1b[33m%s\x1b[0m', `   3. Verify database user privileges in Atlas Database Access.`);
    }
    console.log('\x1b[31m%s\x1b[0m', `--------------------------------------------------------`);
  }
};

export const isDbConnected = () => mongoConnected && mongoose.connection.readyState === 1;
