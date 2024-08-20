import mongoose from "mongoose";
import { Variables } from "./variables.js";


export const connectDB = async() => {
    try {
        const conn = await mongoose.connect(Variables.MONGO_URL)
        console.log(`Connected to: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error ${error.message}`);
        process.exit(1);
    }
}