import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Ye process.env.MONGO_URI se aapka connection string uthayega
    const connect = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Agar connection fail ho to application band kar dega
  }
};

export default connectDB;