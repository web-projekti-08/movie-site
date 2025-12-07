import { Router } from "express";
import * as FavoriteController from "../controllers/favorite_controller.js";
import { authenticateToken } from "../middleware/auth.js";

const favoriteRouter = Router();

// Public share routes (must come before /:favoriteId)
favoriteRouter.get("/share/:shareId", FavoriteController.getSharedFavorites);

// User protected
favoriteRouter.post("/share/create", authenticateToken, FavoriteController.createShareId);
favoriteRouter.post("/", authenticateToken, FavoriteController.addFavorite);
favoriteRouter.get("/", authenticateToken, FavoriteController.getUserFavorites);
favoriteRouter.delete("/:favoriteId", authenticateToken, FavoriteController.removeUserFavorite);

export default favoriteRouter;