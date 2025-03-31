import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function generateToken(user) {   
    const payload = {
        userId: user._id,
        email: user.email,
        name: user.name,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export function decodeToken(token) {
    try {
        return jwt.decode(token);
    } catch (error) {
        return null;
    }
}

export function getUserIdFromToken(token){
    const decoded = decodeToken(token);
    return decoded ? decoded.userId : null;
}

export function getUserEmailFromToken(token){
    const decoded = decodeToken(token);
    return decoded ? decoded.email : null;
}

export function getUserNameFromToken(token){
    const decoded = decodeToken(token);
    return decoded ? decoded.name : null;
}