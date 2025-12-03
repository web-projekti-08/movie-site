import { Router } from "express";
import * as ReviewController from "../controllers/review_controller.js"
import { authenticateToken } from "../middleware/auth.js"

const reviewRouter = Router();

// Public
reviewRouter.get("/", ReviewController.getAllReviews);

// User protected (must come after /user route)
reviewRouter.post("/:mediaId", authenticateToken, ReviewController.createReview);
reviewRouter.get("/user", authenticateToken, ReviewController.getReviewsByUserId);
reviewRouter.get("/:reviewId/detail", authenticateToken, ReviewController.getReview);
reviewRouter.patch("/:reviewId", authenticateToken, ReviewController.editReview);
reviewRouter.delete("/:reviewId", authenticateToken, ReviewController.deleteReview);
reviewRouter.delete("/user", authenticateToken, ReviewController.deleteUserReviews);

// Get by media ID (must come last to avoid conflicts)
reviewRouter.get("/:mediaId", ReviewController.getReviewByMediaId);

export default reviewRouter;