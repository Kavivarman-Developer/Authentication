import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/auth/UserMode.js";

export const protect = asyncHandler(async (req, res, next) => {
    try {
        //Check if user is logged in
        const token = req.cookies.token;

        if(!token) {
            res.status(401).json( {message: 'Not authorized, pleade login!'} );
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user details from the token
        const user = await User.findById(decoded.id).select('-password');

        // Check if user exists
        if(!user) {
            res.status(404).json( {message: 'User not found!'} );
        }

        // Set user details in the request object
        req.user = user;
        next();

    } catch(error) {
        res.status(401).json( {message: 'Not authorized, token failed!'} ); 
    }
});

// Update user
export const updateUser = asyncHandler(async (req, res) => {
    // Get user details from the token ----> protect middleware
    const user = await User.findById(req.user._id);
    
    if(user) {
        // user properies to update
        const {name, bio, photo} = req.body;

        // Update user properties
        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.photo = req.body.photo || user.photo;

        const updated = await user.save();

        res.status(200).json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            photo: updated.photo,
            bio: updated.bio,
            isVerified: updated.isVerified,
        });
    }else{
        res.status(404).json( {message: 'User not found!'} );
    }
});

// Admin middleware
export const adminMiddleware = asyncHandler(async (req, res, next) => {
    if(req.user && req.user.role === "admin") {
        // if user is admin, move to the next middleware / controller
        next();
        return;
    }

    // if not admin, send 403 forbidden ----> terminate the request
    res.status(403).json( {message: 'Only admins can do this!'} ); 
})

