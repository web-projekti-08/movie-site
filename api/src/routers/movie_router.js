import { Router } from "express";
import { getAll, search, searchTMDb, nowPlaying, getReviews } from "../controllers/movie_controller.js";

const router = Router();
router.get("/", getAll);
router.get("/search", search);
router.get("/search-tmdb", searchTMDb);
router.get("/now-playing", nowPlaying);
router.get("/reviews/:id", getReviews);

export default router;