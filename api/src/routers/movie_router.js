import { Router } from "express";
import { searchMovies, nowPlaying, getReviews, getMovie } from "../controllers/movie_controller.js";

const router = Router();
router.get("/search", searchMovies);
router.get("/now-playing", nowPlaying);
router.get("/reviews/:id", getReviews);
router.get("/:movieId", getMovie);

export default router;