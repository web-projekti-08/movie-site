import { Router } from "express";
import { getUsers, addUser, login, refreshAccessToken, logout, deleteAccount } from "../controllers/auth_controller.js";
import { authenticateToken } from "../middleware/auth.js";

const userRouter = Router();

userRouter.post("/register", addUser);
userRouter.post("/login", login);
userRouter.post("/refresh", refreshAccessToken);
userRouter.post("/logout", logout);

userRouter.get("/", authenticateToken, getUsers);
userRouter.delete("/delete", authenticateToken, deleteAccount);

export default userRouter;

