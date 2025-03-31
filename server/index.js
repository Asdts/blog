import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/user.js";
import blogRoutes from "./src/routes/blog.js";
// import authMiddleware from "./middleware/auth.js";
import { errorHandler } from "./src/middleware/error.js";
import { notFound } from "./src/middleware/notFound.js";
import rateLimiter from "./src/middleware/rateLimit.js";
import { dbConnect } from "./src/db/mongoosedb.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.DATABASE_URL;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

app.get("/", (req, res) => {
    res.send("Welcome to the Blog API");
});

// routes

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

// middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
    try{
        await dbConnect(MONGO_URI,PORT);
        console.log(`Server is running on port ${PORT}`);
    }catch(error){
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
);

