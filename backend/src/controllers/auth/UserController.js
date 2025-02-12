import asyncHandler from "express-async-handler"
import User from "../../models/auth/UserMode.js"
import generateToken from "../../helpers/generateToken.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Token from "../../models/auth/Token.js";
import crypto from "node:crypto";
import hashToken from "../../helpers/hashToken.js";
import sendEmail from "../../helpers/sendEmail.js";

export const registerUser = asyncHandler(async (req, res) => {
    //res.send("Register User");
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        res.status(400).json({ message: "All feilds are required" });
    }

    // Password length
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at 6 characters" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email })
    //console.log(userExists)

    if (userExists) {
        return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    const user = await User.create({
        name,
        email,
        password,
    });

    // Generate token with user id 
    const token = generateToken(user._id);

    // send back the user and token to the response to the user
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days 
        sameSite: true,
        secure: true,
    });

    if (user) {

        const { _id, name, email, role, photo, bio, isVerified } = user;

        res.status(201).json({
            _id,
            name,
            email,
            role,
            photo,
            bio,
            isVerified,
            token,
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }

});

// User login
export const loginUser = asyncHandler(async (req, res) => {
    //res.send("Login route")

    // User login
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ message: "All feilds are required!" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (!userExists) {
        return res.status(400).json({ message: "User not found, sign up!" });
    }

    //console.log(userExists.password === password);

    // Check id the password match the hashed password in the database
    const isMatch = await bcrypt.compare(password, userExists.password);
    //console.log(isMatch)

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentails!" });
    }

    if (userExists && isMatch) {
        const { _id, name, email, role, photo, bio, isVerified } = userExists;

           // Generate token with user id 
           const token = generateToken(userExists._id);

        // Set the tokrn in the cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: true,
            secure: true,
        });

        // send back the user and token to the response to the user
        res.status(201).json({
            _id,
            name,
            email,
            role,
            photo,
            bio,
            isVerified,
            token,
        });
    }else{
        res.status(400).json({message: "Invalid email or password"});
    }

});


// Logout user
export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('token');
    res.status(200).json( { message: 'User logged out' } );
});

// Get user profile
export const getUser = asyncHandler(async (req, res) => {
    //Get user details from the token ----> excude password
    const user = await User.findById(req.user._id).select('-password');

    if(user) {
        res.status(200).json(user);
    }else{
        res.status(404).json( {message: 'User not found!'} );
    }
});


// Login Status
export const userLoginStatus = asyncHandler(async (req, res) => {
    const token = req.cookies.token;

    if(!token) {
        res.status(401).json({message: "Not authorized, please login!"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(decoded) {
        res.status(200).json(true);
    }else{
        res.status(401).json(false);
    }
});


// Email verification 
export const verifyEmail = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    // If user does not exist
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already verified
    if (user.isVerified) {
        return res.status(400).json({ message: "User is already verified" });
    }

    // Check if a verification token already exists
    const existingToken = await Token.findOne({ userId: user._id });

    // Delete previous token if exists
    if (existingToken) {
        await existingToken.deleteOne();
    }

    // Create a new verification token
    const verificationToken = crypto.randomBytes(64).toString("hex") + user._id;

    // Hash the verification token before storing
    const hashedToken = await hashToken(verificationToken);

    // Save new token in DB
    await new Token({
        userId: user._id,
        verificationToken: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,  // Token expires in 24 hours
    }).save();

    // Generate verification link
    const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Email details
    const subject = "Email Verification - Auth Kit";
    const send_to = user.email;
    const reply_to = "noreply@gmail.com";
    const template = "emailVerification"; // Template must exist in /views
    const send_from = process.env.USER_EMAIL;
    const name = user.name;
    const link = verificationLink;

    try {
        // Ensure correct argument order
        await sendEmail(send_to, send_from, name, subject, template, reply_to, link);
        return res.status(200).json({ message: "Verification email sent successfully!" });
    } catch (err) {
        console.error("❌ Error sending email:", err);
        return res.status(500).json({ message: "Email could not be sent!" });
    }
});


// verify user
export const verifyUser = asyncHandler(async (req, res) => {
    const { verificationToken } = req.params;

    if(!verificationToken){
        return res.status(400).json({message: "Invalid verification token!"});
    }

    // hash the verification token ---> because it was hashed before saving
    const hashedToken = hashToken(verificationToken);

    // find user with the verification token
    const userToken = await Token.findOne({ 
        verificationToken: hashedToken,
        expiresAt: { $gt: Date.now() },
     });

    //  console.log(userToken);

    if(!userToken){
        return res.status(400).json({message: "invalid or expired verification token"});
    }

    // find user with the user id in the token
    const user = await User.findById(userToken.userId);

    if(user.isVerified){
        return res.status(400).json({message: "User is already verified!"});
    }

    // update user to verified
    user.isVerified = true;
    await user.save();
    res.status(200).json({message: "User verified"});
});


// forgot password
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required!" });
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Check if reset token exists
    let token = await Token.findOne({ userId: user._id });

    // If token exists, delete the old one
    if (token) {
        await token.deleteOne();
    }

    // Create a reset token using the user ID
    const passwordResetToken = crypto.randomBytes(64).toString("hex") + user._id;

    // Hash the reset token before saving
    const hashedToken = await hashToken(passwordResetToken);

    // Save the token with an expiry time of 1 hour
    await new Token({
        userId: user._id,
        passwordResetToken: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    }).save();

    // Create the password reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${passwordResetToken}`;

    // Email details
    const subject = "Password Reset - Authkit";
    const send_to = user.email;
    const reply_to = "noreplyreply@gmail.com";
    const template = "forgotPassword";
    const send_from = process.env.USER_EMAIL;
    const name = user.name;
    const link = resetLink;

    try {
        await sendEmail(send_to, send_from, name, subject, template, reply_to, link );
        res.status(200).json({ message: "Reset email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Email could not be sent" });
    }
});


// reset password
export const resetPassword = asyncHandler(async (req, res) => {
    //res.send('Reset Password');
    const {resetPasswordToken} = req.params;
    const {password} = req.body;

    if(!password) {
        return res.status(400).json({message: "Password is required!"});
    }
    
    // hash the reset token
    const hashedToken = hashToken(resetPasswordToken);

    // check if token exists and has not expired
    const userToken = await Token.findOne({
        passwordResetToken: hashedToken,
        expiresAt: { $gt: Date.now() },
    });
    //console.log(userToken);

    if(!userToken){
        return res.status(400).json({message: "Invalid or expired reset token"});
    }

    // find user with the id in the token
    const user = await User.findById(userToken.userId);

    // update user password
    user.password = password;
    await user.save();
    
    res.status(200).json({message: "Password reset successfully"});

});


// Chang Passsword
export const changePassword = asyncHandler(async (req, res) => {
   const {currentPassword, newPassword} = req.body;
   //console.log(currentPassword, newPassword);

   //console.log(req.user);

   if(!currentPassword || !newPassword){
    return res.status(400).json({message: "All feilds are required"});
   }
    
//    find user by id
const user = await User.findById(req.user._id);

// compare current password with the hashed password in the database
const isMatch = await bcrypt.compare(currentPassword, user.password);

if(!isMatch){
    return res.status(400).json({message: "Invalid password!"});
}

// reset password
if(isMatch){
    user.password = newPassword;
    await user.save();
    return res.status(200).json({message: "Password changed successfully"})
}else{
    return res.status(400).json({message: "Password could not be change!"});
}

});