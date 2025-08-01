import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/brainly";

export const DB = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log(" MongoDB connected successfully");
    } catch (err) {
        console.error(" MongoDB connection failed:", err);
        process.exit(1);
    }
};
