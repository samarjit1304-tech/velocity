const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vibestore', {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Failed to connect to local/specified MongoDB (${error.message}). Starting in-memory database...`);
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB In-Memory Connected: ${conn.connection.host} (${mongoUri})`);
      
      // Auto-seed in-memory database
      setTimeout(async () => {
        try {
          const Product = require('../models/Product');
          const count = await Product.countDocuments();
          if (count === 0) {
            console.log('In-memory database detected with 0 products. Auto-seeding sportswear data...');
            const { seedDataInline } = require('../scripts/seedInline');
            await seedDataInline();
          }
        } catch (seedErr) {
          console.error('Auto-seeding error:', seedErr);
        }
      }, 500);
    } catch (memError) {
      console.error(`Failed to start/connect to in-memory database: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
