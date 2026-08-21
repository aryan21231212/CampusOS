import { config } from 'dotenv';
import mongoose from 'mongoose';
config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://aryanpratapsingh862:83oSj0psXp1taAF7@cluster1.8ynb5tf.mongodb.net/campusos?appName=Cluster1");
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('[Database Error] Connection failed:', error);
    process.exit(1);
  }
};