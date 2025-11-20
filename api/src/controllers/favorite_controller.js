import * as FavoriteModel from "../models/favorite_model.js"

export async function addFavorite(req, res, next) {
  try {
    const favorite = await FavoriteModel.addFavorite(req.params.userId, req.body.mediaId);
    if (!favorite) {
      res.status(500).json({ error: "Failed to add favorite" });
    }
    res.status(201).json(favorite);
  } catch (err) {
    next(err);
  }
}

export async function getUserFavorite(req, res, next) {
  try {
    const favorite = await FavoriteModel.getUserFavorite(req.params.userId, req.params.favoriteId);
    if (!favorite) {
      res.status(500).json({ error: "Failed to get favorite" });
    }
    res.status(200).json(favorite);
  } catch (err) {
    next(err);
  }
}

export async function getUserFavorites(req, res, next) {
  try {
    const favorites = await FavoriteModel.getUserFavorites(req.params.userId);
    if (!favorites) {
      res.status(500).json({ error: "Failed to get favorites" });
    }
    res.status(200).json(favorites);
  } catch (err) {
    next(err);
  }
}

export async function removeUserFavorite(req, res, next) {
  try {
    console.log("favoriteID: " + req.params.favoriteId);
    console.log("userID: " + req.params.userId);
    const favorite = await FavoriteModel.removeUserFavorite(req.params.userId, req.params.favoriteId);
    if (!favorite) {
      res.status(404).json({ error: "Favorite not found" });
    }
    res.status(200).json(favorite);
  } catch (err) {
    next(err);
  }
}