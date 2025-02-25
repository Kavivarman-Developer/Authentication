import express from "express";
import { changePassword, forgotPassword, getUser, loginUser, logoutUser, registerUser, resetPassword, userLoginStatus, verifyEmail, verifyUser } from "../controllers/auth/UserController.js";
import { adminMiddleware, creatorMiddleware, protect, updateUser } from "../middleWare/authMiddleware.js";
import { deleteUser, getAllUsers } from "../controllers/auth/adminController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);

// Admin route
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

// Get all users
router.get("/admin/users", protect, creatorMiddleware, getAllUsers);

// Login Status
router.get("/login-status", userLoginStatus);

// email verification
router.post("/verify-email", protect, verifyEmail);

// verify user --> email verificaation
router.post("/verify-user/:verificationToken", verifyUser);

// forgot password
router.post("/forgot-password", forgotPassword);

// reset password
router.post("/reset-password/:resetPasswordToken", resetPassword);

// change password --->> user must be logged in
router.patch("/change-password", protect, changePassword); 

export default router;