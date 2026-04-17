import express from "express";
import { getcurrentUser, registerUser, loginUser, updateProfile, changePassword } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Protected route 
userRouter.get("/me", authMiddleware , getcurrentUser);
userRouter.put("/profile", authMiddleware, updateProfile);
userRouter.put("/password", authMiddleware, changePassword);

export default userRouter;
