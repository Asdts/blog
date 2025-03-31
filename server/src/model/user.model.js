import mongoose from "mongoose";

// Define the user schema id:num , name : String, email: String , dob : Date , password : string
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    // dob: {
    //     type: Date,
    //     required: [true, "Date of Birth is required"],
    // },
    followers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        default: [],
    },
    following: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        default: [],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        default: null,
    },
    verificationTokenExpires: {
        type: Date,
        default: null,
    },},{timestamps: true});

    const User = mongoose.models.User || mongoose.model("User", userSchema);

    export default User;