import jwt from "jsonwebtoken"
import { Variables } from "../config/variables.js";

// use Variables.JWT_SECRET_KEY like secret key (symmetric key)
const generateTokenAndSetCookie = (payload, res) =>{
    const token = jwt.sign( {... payload}, Variables.JWT_SECRET_KEY, {
        expiresIn: '15d',
    })

    // send token to client as Cookie 'jwt-threads'
    res.cookie('jwt-threads', token,  {
        httpOnly: true, // more secure => the cookie cannot be accessed by JavaScript on the client side
        maxAge: 15*24*60*60* 1000, // 15 days
        sameSite: "strict" // CSRF
    })

    return token;
}

export default generateTokenAndSetCookie;