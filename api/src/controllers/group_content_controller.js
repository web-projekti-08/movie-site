import * as ContentModel from "../models/group_content_model.js"

export async function addMedia(req, res, next) {
  try {
    const media = await ContentModel.addMedia(req.params.groupId, req.body.mediaId);
    if (!media) {
      res.status(500).json({ error: "Failed to add media" });
    }
    res.status(201).json(media);
  } catch (err) {
    next(err);
  }
}

export async function getMediaById(req, res, next) {
  try {
    const media = await ContentModel.getMediaById(req.params.groupId, req.params.mediaId);
    if (!media) {
      res.status(500).json({ error: "Failed to get media" });
    }
    res.status(200).json(media);
  } catch (err) {
    next(err);
  }
}

export async function getAllMedia(req, res, next) {
  try {
    const media = await ContentModel.getAllMedia(req.params.groupId);
    if (!media) {
      res.status(500).json({ error: "Failed to get media" });
    }
    res.status(200).json(media);
  } catch (err) {
    next(err);
  }
}

export async function removeMedia(req, res, next) {
  try {
    const media = await ContentModel.removeMedia(req.params.groupId, req.params.contentId);
    res.status(204).json(media);
  } catch (err) {
    next(err);
  }
}