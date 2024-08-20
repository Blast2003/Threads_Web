import jwt from "jsonwebtoken"
import { Variables } from "../config/variables.js";
import User from "../models/userModel.js";

export const protectRoutes = async (req, res, next) =>{
    try {
        const token = req.cookies["jwt-threads"];
        if(!token){
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decode = jwt.verify(token, Variables.JWT_SECRET_KEY); // true or false or object

        if(!decode){
            return res.status(401).json({
                success: false,
                msg: "Unauthorized - No Token Provided"
            })
        }

        const user = await User.findById(decode._id).select("-password") // skip show the password

        req.user = user;

        next();

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in Protect Routes MiddleWare",error.message);
    }
}