import { Router } from "express";
import {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    getBlogsByAuthor,
    getBlogsByTitle
} from "../controllers/blog.js";

const router = Router();

router.post("/create", createBlog);
router.get("/", getBlogs);
router.get("/author/:authorId", getBlogsByAuthor);
router.get("/title/:title", getBlogsByTitle);
router.get("/:blogId", getBlogById);
router.put("/:blogId", updateBlog);
router.delete("/:blogId", deleteBlog);
router.get("/author/:authorId", getBlogsByAuthor);
router.get("/title/:title", getBlogsByTitle);

export default router;