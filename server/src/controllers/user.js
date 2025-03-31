import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken , verifyToken } from "../utils/jwt.js";
import { userVerify } from "../utils/auth.js";
import { validationResult } from "express-validator";
import { sendMail } from "../utils/mailer.js";
import { sendVerificationMail } from "../utils/mailer.js";
import dotenv from "dotenv";
dotenv.config();

export const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { name, email, password, dob } = req.body;
    // const dobnew = Date.parse(dob);
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            // dobnew,
        });
        await user.save();
        await sendVerificationEmail(email,user);
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

export const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user);
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

export const verifyUser = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await userVerify(token);
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(200).json({ message: "User verified successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

export const sendVerificationEmail = async (email , user) => {

    // const {user , email} = req.body;
    const token = generateToken(user);
    // const email = req.user.email;
    sendVerificationMail(email, token)
        .then(() => {
            console.log("Verification email sent");
            return { message: "Verification email sent" };
        })
        .catch(async (error) => {
            //delete user
            console.log("Error in sending verification email", error);
            await User.findByIdAndDelete(user._id);
            return { message: "Server error at send verification mail", error };
        });
}

export const sendBlogEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const {userId, blogId} = req.body;
    const user = User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const followers = user.followers;
    const blog = Blog.findById(blogId);
    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }
    const subject = `New blog post: ${blog.name}`;
    const text = `Check out the new blog post by ${user.name} : ${process.env.FRONTEND_URL}/blog/${blogId}`;
    for(follower of followers){
        const follower = User.findById(follower);
        if (!follower) {
            return res.status(404).json({ message: "Follower not found" });
        }
        sendMail(follower.email, subject, text)
            .then(() => {
                return res.status(200).json({ message: "Email sent" });
            })
            .catch((error) => {
                return res.status(500).json({ message: "Server error", error });
            });
    }
    return res.status(200).json({ message: "Emails sent" });
}

export const follow = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // const { userId } = req.params;
    const { userId , followerId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const follower = await User.findById(followerId);
        if (!follower) {
            return res.status(404).json({ message: "Follower not found" });
        }
        user.followers.push(follower._id);
        follower.following.push(user._id);
        await user.save();
        await follower.save();
        return res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}
export const unfollow = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { userId } = req.params;
    const { followerId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const follower = await User.findById(followerId);
        if (!follower) {
            return res.status(404).json({ message: "Follower not found" });
        }
        user.followers.pull(follower._id);
        follower.following.pull(user._id);
        await user.save();
        await follower.save();
        return res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}