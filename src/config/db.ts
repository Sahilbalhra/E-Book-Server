import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.warn("Connected to database successfully");
        });

        mongoose.connection.on("error", (error) => {
            console.error("Error while connecting to the database.", error);
        });

        await mongoose.connect(config.databaseurl as string);
    } catch (error) {
        console.error("Failed to connect to database.", error);
        process.exit(1);
    }
};

export default connectDB;
