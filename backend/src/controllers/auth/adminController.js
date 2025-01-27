import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserMode.js";

export const deleteUser = asyncHandler(async (req, res) => {
    // res.status(200).json({message: 'User deleted'});

    const {id} = req.params;

    try {
         // Attempt to find and delete the user
    const user = await User.findByIdAndDelete(id);

    // Check if user exists
    if(!user) {
        res.status(404).json( {message: 'User not found!'} );
    }

    // Delete user
    res.status(200).json( {message: 'User deleted successfully!'} );
    } catch(error) {
        res.status(500).json( {message: 'Cannot delete user!'} );
    }
   
});