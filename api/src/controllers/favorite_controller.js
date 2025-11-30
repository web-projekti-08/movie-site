import * as FavoriteModel from "../models/favorite_model.js"

export async function addFavorite(req, res, next) {
  try {
    const favorite = await FavoriteModel.addFavorite(req.user.userId, req.body.mediaId);
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
    const favorite = await FavoriteModel.getUserFavorite(req.user.userId, req.params.favoriteId);
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
    const favorites = await FavoriteModel.getUserFavorites(req.user.userId);
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
    const favorite = await FavoriteModel.removeUserFavorite(req.user.userId, req.params.favoriteId);
    if (!favorite) {
      res.status(404).json({ error: "Favorite not found" });
    }
    res.status(200).json(favorite);
  } catch (err) {
    next(err);
  }
}

// SHARE
export async function createShareId(req, res, next) {
  try {
    const shareId = await FavoriteModel.createShareId(req.user.userId);
    if (!shareId || shareId.length === 0) {
      return res.status(404).json({ error: "Could not create share "});
    }
    res.status(200).json({
      shareId,
      shareUrl: `${process.env.FRONTEND_URL}/favorites/share/${shareId}`
    });
  } catch (err) {
    next(err);
  }
}

export async function getSharedFavorites(req, res, next) {
  try {
    const shared = await FavoriteModel.getSharedFavorites(req.params.shareId);
    res.status(200).json(shared || []);
  } catch (err) {
    next(err);
  }
}