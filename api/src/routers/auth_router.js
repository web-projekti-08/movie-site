import { Router } from "express";
import { signup, login, deleteAccount } from "../controllers/auth_controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.delete("/delete", deleteAccount);

export default router;
