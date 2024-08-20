import dotenv from "dotenv"
dotenv.config()

export const Variables = {
    PORT : process.env.PORT || 5010,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    COLOUDINARY_API_KEY: process.env.COLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}