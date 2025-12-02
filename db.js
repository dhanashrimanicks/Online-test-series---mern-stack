const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false); // Optional for Mongoose 7+
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Failed to connect DB", error);
    process.exit(1);
  }
};

module.exports = connectDB;
