import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"]
    },
    email: {
        type: String,
        required: [true, "Please an email"],
        unique: true,
        trim: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please enter a valid email address"
        ],
    },
    password: {
        type: String,
        required: [true, "Please add password"]
    },
    photo: {
        type: String,
        default: "no-photo.jpg",
    },
    bio: {
        type: String,
        default: "I am a new user"
    },
    role: {
        type: String,
        enum: ["user", "adnim", "creator"],
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {timestamps: true, minimize: true});

const User = mongoose.model("User", UserSchema);
export default User;