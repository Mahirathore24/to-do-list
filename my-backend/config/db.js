const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // If no MongoDB URI provided, use in-memory storage fallback
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/todolist';
    
    console.log('Connecting to MongoDB...');
    console.log('Using URI:', mongoURI.replace(/\/\/.*@/, '//<credentials>@')); // Hide credentials in logs
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  Backend will run without database. Using localStorage on frontend.');
    // Don't exit - let the app run without DB
  }
};

module.exports = connectDB;
