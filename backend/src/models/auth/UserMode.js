import mongoose from "mongoose"
import bcrypt from "bcrypt"

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
        default:"https://i.ibb.co/4pDNDk1/avatar.png",
    },
    bio: {
        type: String,
        default: "I am a new user"
    },
    role: {
        type: String,
        enum: ["user", "admin", "creator"],
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {timestamps: true, minimize: true}

);

UserSchema.pre("save", async function (next) {
    // Check if the password is not modufied
    if(!this.isModified("password")) {
        return next();
    }

    // hash the password ===> becrypt
    // generate salt
    const salt = await bcrypt.genSalt(10);

    // hash the password with the salt
    const hashPassword = await bcrypt.hash(this.password, salt);

    // Set the password to the hashed password
    this.password = hashPassword;

    // Call the next middleWare
    next();

});

const User = mongoose.model("User", UserSchema);
export default User;