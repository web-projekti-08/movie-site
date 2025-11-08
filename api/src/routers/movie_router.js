import { Router } from "express";
import { getAll } from "../controllers/movie_controller.js";

const router = Router();
router.get("/", getAll);

export default router;