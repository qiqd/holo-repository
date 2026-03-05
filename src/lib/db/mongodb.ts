import mongoose from "mongoose"

const MONGODB_URI = process.env.HOLO_DATABASE_URL || "mongodb://localhost:27017/holo_db"

let cachedConnection: mongoose.Connection | null = null

export async function connectToMongoDB() {
  if (cachedConnection) {
    return cachedConnection
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI)
    cachedConnection = connection.connection
    console.log("Connected to MongoDB")
    return cachedConnection
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    throw error
  }
}

export function getMongoDBConnection() {
  if (!cachedConnection) {
    throw new Error("MongoDB connection not established")
  }
  return cachedConnection
}
