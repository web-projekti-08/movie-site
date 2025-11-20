import { Router } from "express";
import * as FavoriteController from "../controllers/favorite_controller.js"

const favoriteRouter = Router();

// Create
favoriteRouter.post("/:userId", FavoriteController.addFavorite);

// Get
favoriteRouter.get("/:userId/:favoriteId", FavoriteController.getUserFavorite);
favoriteRouter.get("/:userId", FavoriteController.getUserFavorites);

// Delete
favoriteRouter.delete("/:userId/:favoriteId", FavoriteController.removeUserFavorite);

export default favoriteRouter;