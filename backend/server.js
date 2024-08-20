import express from "express";
import { connectDB } from "./src/config/database.js";
import { Variables } from "./src/config/variables.js";
import cookieParser from  "cookie-parser"
import { router } from "./src/routes/index.js";
import {v2 as cloudinary} from "cloudinary"
import {app, server} from "./src/socket/socket.js"
import path from "path"
import dotenv from "dotenv"

dotenv.config();

cloudinary.config({
    cloud_name: Variables.CLOUDINARY_CLOUD_NAME,
    api_key: Variables.COLOUDINARY_API_KEY,
    api_secret: Variables.CLOUDINARY_API_SECRET
})

const __dirname = path.resolve();


//middlewares 
// to parse JSON data in the req.body, exceed the limit of json data to upload large file
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

// Routes 
router(app);

const PORT = Variables.PORT;

// http://localhost:5010 => backend server, frontend server


// server static assets if in production
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    // react app
    app.get("*", (req, res) =>{
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

//socket server handle
server.listen(PORT, () =>{
    connectDB()
    console.log("listening on port", PORT)
});
