import mongoose from "mongoose";

export default async function connectDB() {
    try {
        const mongoUrl = process.env.MONGO_URL;
        const dbName = process.env.DB_NAME || "resume";

        if (!mongoUrl) {
            console.warn("WARNING: MONGO_URL not provided in environment.");
            return;
        }

        // Clean connection string handling
        const connectionString = mongoUrl.includes("?")
            ? mongoUrl.replace("?", `/${dbName}?`)
            : mongoUrl.endsWith("/")
                ? `${mongoUrl}${dbName}`
                : `${mongoUrl}/${dbName}`;

        const instance = await mongoose.connect(connectionString);
        console.log(`MongoDB connected: ${instance.connection.host}`);
    }
    catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
}