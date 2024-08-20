import jwt from "jsonwebtoken"
import { Variables } from "../config/variables.js";

const generateTokenAndSetCookie = (payload, res) =>{
    const token = jwt.sign( {... payload}, Variables.JWT_SECRET_KEY, {
        expiresIn: '15d',
    })

    res.cookie('jwt-threads', token,  {
        httpOnly: true, // more secure
        maxAge: 15*24*60*60* 1000, // 15 days
        sameSite: "strict" // CSRF
    })

    return token;
}

export default generateTokenAndSetCookie;