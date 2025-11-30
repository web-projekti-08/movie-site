import { Router } from "express";
import * as ReviewController from "../controllers/review_controller.js"
import { authenticateToken } from "../middleware/auth.js"

const reviewRouter = Router();

// CREATE
reviewRouter.post("/", authenticateToken, ReviewController.createReview);

// GET
reviewRouter.get("/media/:mediaId", ReviewController.getReviewByMediaId);
reviewRouter.get("/", authenticateToken, ReviewController.getAllReviews);

// USER REVIEWS
reviewRouter.get("/user", authenticateToken, ReviewController.getReviewsByUserId);

// SINGLE REVIEW
reviewRouter.get("/:reviewId", authenticateToken, ReviewController.getReview);

// EDIT
reviewRouter.patch("/:reviewId", authenticateToken, ReviewController.editReview);

// DELETE
reviewRouter.delete("/:reviewId", authenticateToken, ReviewController.deleteReview);
reviewRouter.delete("/user", authenticateToken, ReviewController.deleteUserReviews);

export default reviewRouter;