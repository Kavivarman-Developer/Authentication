import express from "express";
import { getUser, loginUser, logoutUser, registerUser } from "../controllers/auth/UserController.js";
import { adminMiddleware, protect, updateUser } from "../middleWare/authMiddleware.js";
import { deleteUser } from "../controllers/auth/adminController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);

// Admin route
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

export default router