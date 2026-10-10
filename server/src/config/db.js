import mongoose from "mongoose";

let connectionPromise = null;

export async function connectDB() {
  // Already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Check environment variable
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is missing from the server environment"
    );
  }

  // Reuse an existing connection attempt
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
    })
    .then(() => {
      console.log("MongoDB connected successfully");

      return mongoose.connection;
    })
    .catch((error) => {
      connectionPromise = null;

      console.error("MongoDB connection failed:", {
        name: error.name,
        message: error.message,
        readyState: mongoose.connection.readyState,
      });

      throw error;
    });

  return connectionPromise;
}
