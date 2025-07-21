const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL); 
    console.log(` Connected to database: ${conn.connection.host}`);
  } catch (error) {
    console.log(` Database connection error: ${error.message}`);
    process.exit(1); // Optional: exit on failure
  }
};

module.exports = connectDB;
