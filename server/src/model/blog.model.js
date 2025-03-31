import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
    },
    title : {
        type: [{tag:{
            type: String,
            required: [true, "Tag is required"],
        },title:{
            type: String,
            required: [true, "Title is required"],
        }}],
        required: [true, "Title is required"],
    },
    description:{
        type: String,
        required: [true, "Description is required"],
    },
    imageUrl:{
        type: [{
            type:{
                type: String,
                required: [true, "Type is required"],
            },
            placement:{
                type: String,
                required: [true, "Placement is required"],
            },
            url:{
                type: String,
                required: [true, "URL is required"],
            },
        }],
        required: [true, "Image URL is required"],
    },
    keyPoints:{
        type: [String],
        required: [true, "Key Points are required"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    authorID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Author ID is required"],
    },},{timestamps: true});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;
