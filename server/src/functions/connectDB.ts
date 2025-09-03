import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
        dbName: "coverly",
    });
    console.log(`db connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("err connecting to db:", err);
    process.exit(1);
  }
}
