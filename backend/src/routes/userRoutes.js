import express from "express";
import { getUser, loginUser, logoutUser, registerUser, userLoginStatus, verifyEmail } from "../controllers/auth/UserController.js";
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

// Verify user ---> email verification
router.get("/send-email", protect, verifyEmail);

export default router