import * as ContentModel from "../models/group_content_model.js"

export async function addContent(req, res, next) {
  try {
    const content = await ContentModel.addContent(req.params.groupId, req.body.mediaId);
    if (!content) {
      res.status(500).json({ error: "Failed to add content" });
    }
    res.status(201).json(content);
  } catch (err) {
    next(err);
  }
}

export async function getContentById(req, res, next) {
  try {
    const content = await ContentModel.getContentById(req.params.groupId, req.params.contentId);
    if (!content) {
      res.status(500).json({ error: "Failed to get content" });
    }
    res.status(200).json(content);
  } catch (err) {
    next(err);
  }
}

export async function getAllContent(req, res, next) {
  try {
    const content = await ContentModel.getAllContent(req.params.groupId);
    if (!content) {
      res.status(500).json({ error: "Failed to get content" });
    }
    res.status(200).json(content);
  } catch (err) {
    next(err);
  }
}

export async function removeContent(req, res, next) {
  try {
    const content = await ContentModel.removeContent(req.params.groupId, req.params.contentId);
    res.status(204).json(content);
  } catch (err) {
    next(err);
  }
}