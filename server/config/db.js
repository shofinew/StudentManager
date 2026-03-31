import mongoose from "mongoose";

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.URI;

    if (!mongoUri) {
        throw new Error(
            "MongoDB connection string is missing. Set MONGO_URI or URI in the root .env file."
        );
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
};

export default connectDB;
