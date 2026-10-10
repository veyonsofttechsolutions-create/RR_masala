import mongoose from "mongoose";

export async function connectDB() {
  const uri = mongodb+srv://harikesavan502_db_user:xIcd3Bc9H8FpdZeh@cluster0.txoztwd.mongodb.net/rr_masala?retryWrites=true&w=majority;

  if (!uri) {
    throw new Error("MONGODB_URI is missing");
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}
