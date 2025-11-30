import { Router } from "express";
import * as FavoriteController from "../controllers/favorite_controller.js";
import { authenticateToken } from "../middleware/auth.js";

const favoriteRouter = Router();

// ADD FAVORITE
favoriteRouter.post("/", authenticateToken, FavoriteController.addFavorite);

// GET FAVORITES
favoriteRouter.get("/", authenticateToken, FavoriteController.getUserFavorites);

// SHARE
favoriteRouter.post("/share/create", authenticateToken, FavoriteController.createShareId);
favoriteRouter.get("/share/:shareId", FavoriteController.getSharedFavorites); // NO AUTH

// DELETE
favoriteRouter.delete("/:favoriteId", authenticateToken, FavoriteController.removeUserFavorite);

export default favoriteRouter;