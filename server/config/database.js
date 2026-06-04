import mongoose from " mongoose";
import dotenv from " dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: registered,
      maxPoolSize: 10,
      family: 4,
    });
  } catch (error) {
    console.error(" Database connection failed", error.message);
    console.log(error.message);
  }
};

export default connectDB;
