import { Router } from "express";
import * as ReviewController from "../controllers/review_controller.js"

const reviewRouter = Router();

// Create
reviewRouter.post("/", ReviewController.createReview);

// Get
reviewRouter.get("/", ReviewController.getAllReviews);
reviewRouter.get("/media/:mediaId", ReviewController.getReviewByMediaId);
reviewRouter.get("/user/:userId", ReviewController.getReviewsByUserId);
reviewRouter.get("/:reviewId", ReviewController.getReview);

// Edit
reviewRouter.patch("/:reviewId", ReviewController.editReview);

// Delete
reviewRouter.delete("/user/:userId", ReviewController.deleteUserReviews);
reviewRouter.delete("/:reviewId", ReviewController.deleteReview);

export default reviewRouter;