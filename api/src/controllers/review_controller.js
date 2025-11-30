import * as ReviewModel from "../models/review_model.js"

export async function createReview(req, res, next) {
  try {
    const { mediaId, text, rating } = req.body;
    const review = await ReviewModel.createReview(mediaId, req.user.userId, text, rating);
    if (!review) {
      res.status(500).json({ error: "Failed to create review" });
    }
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}

export async function getReview(req, res, next) {
  try {
    const review = await ReviewModel.getReview(req.params.reviewId);
    if (!review || review.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
}

export async function getReviewByMediaId(req, res, next) {
  try {
    const review = await ReviewModel.getReviewByMediaId(req.params.mediaId);
    if (!review || review.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
}

export async function getReviewsByUserId(req, res, next) {
  try {
    const review = await ReviewModel.getReviewsByUserId(req.user.userId);
    if (!review || review.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
}

export async function getAllReviews(req, res, next) {
  try {
    const review = await ReviewModel.getAllReviews();
    if (!review || review.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
}

export async function editReview(req, res, next) {
  try {
    const { text, rating } = req.body;
    const review = await ReviewModel.editReview(req.params.reviewId, text, rating);
    if (!review) {
      res.status(500).json({ error: "Failed to edit review" });
    }
    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
}

export async function deleteReview(req, res, next) {
  try {
    const review = await ReviewModel.deleteReview(req.params.reviewId);
    if (!review) {
      res.status(500).json({ error: "Failed to delete review" });
    }
    res.status(204).json(review);
  } catch (err) {
    next(err);
  }
}

export async function deleteUserReviews(req, res, next) {
  try {
    const review = await ReviewModel.deleteUserReviews(req.params.userId);
    if (!review) {
      res.status(500).json({ error: "Failed to delete reviews" });
    }
    res.status(204).json(review);
  } catch (err) {
    next(err);
  }
}