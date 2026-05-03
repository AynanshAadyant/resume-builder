import mongoose from "mongoose";

export default async function connectDB() {
    try {
        const instance = await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`)
        console.log(`Connected to ${instance.connection.host}`)
    }
    catch (error) {
        console.log("DB connection error: ", error);
    }
}