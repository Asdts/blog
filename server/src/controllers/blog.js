import Blog from "../model/blog.model.js";
// import User from "../model/user.model";
import { validationResult } from "express-validator";
import { sendBlogEmail } from "./user.js";

export const createBlog = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { name, title, description, imageUrl, keyPoints } = req.body;
    try {
        const blog = new Blog({
            name,
            title,
            description,
            imageUrl,
            keyPoints,
            authorID: req.user._id,
        });
        await blog.save();
        const mailreq = {
            userId: req.user._id,
            blogId: blog._id,
        }
        try {
            await sendBlogEmail(mailreq);
            return res.status(200).json({ message: "Blog Created and mail sent" });
        }
        catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

export const getBlogs = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const blogs = await Blog.find().populate("authorID", "name");
        return res.status(200).json({ blogs });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}
export const getBlogById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { blogId } = req.params;
    try {
        const blog = await Blog.findById(blogId).populate("authorID", "name");
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        return res.status(200).json({ blog });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}
export const updateBlog = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { blogId } = req.params;
    const { name, title, description, imageUrl, keyPoints } = req.body;
    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        blog.name = name || blog.name;
        blog.title = title || blog.title;
        blog.description = description || blog.description;
        blog.imageUrl = imageUrl || blog.imageUrl;
        blog.keyPoints = keyPoints || blog.keyPoints;
        await blog.save();
        return res.status(200).json({ message: "Blog updated" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}
export const deleteBlog = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { blogId } = req.params;
    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        await blog.remove();
        return res.status(200).json({ message: "Blog deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}
export const getBlogsByAuthor = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { authorId } = req.params;
    try {
        const blogs = await Blog.find({ authorID: authorId }).populate("authorID", "name");
        if (!blogs) {
            return res.status(404).json({ message: "Blogs not found" });
        }
        return res.status(200).json({ blogs });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}
export const getBlogsByTitle = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { title } = req.params;
    try {
        const blogs = await Blog.find({ "title.title": title }).populate("authorID", "name");
        if (!blogs) {
            return res.status(404).json({ message: "Blogs not found" });
        }
        return res.status(200).json({ blogs });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}
