import bcrypt from "bcryptjs";
import { verifyToken } from "./jwt.js";
import User from "../model/user.model.js";

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

export async function userVerify(token){
    const decoded = verifyToken(token);
    if (!decoded) {
        return null;
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
        return null;
    }
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();
    return user;
}