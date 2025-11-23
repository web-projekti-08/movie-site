import { Router } from "express";
import * as ReviewController from "../controllers/review_controller.js"

const reviewRouter = Router();

// Create
reviewRouter.post("/", ReviewController.createReview);

// Get
reviewRouter.get("/", ReviewController.getAllReviews);
reviewRouter.get("/:reviewId", ReviewController.getReview);
reviewRouter.get("/media/:mediaId", ReviewController.getReviewByMediaId);
reviewRouter.get("/user/:userId", ReviewController.getReviewsByUserId);

// Edit
reviewRouter.patch("/:reviewId", ReviewController.editReview);

// Delete
reviewRouter.delete("/:reviewId", ReviewController.deleteReview);
reviewRouter.delete("/user/:userId", ReviewController.deleteUserReviews);

export default reviewRouter;