import * as ChatModel from "../models/group_chat_model.js";

export async function createPost(req, res, next) {
  try {
    const { text } = req.body;
    // fix to req.user.userId after auth
    const post = await ChatModel.createPost(req.params.groupId, 1, text);
    if (!post) {
      res.status(500).json({ error: "Failed to create post" });
    }
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

export async function getPosts(req, res, next) {
  try {
    const post = await ChatModel.getPosts(req.params.groupId);
    if (!post) {
      res.status(500).json({ error: "Failed to get posts" });
    }
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
}

export async function getUserPosts(req, res, next) {
  try {
    const post = await ChatModel.getUserPosts(req.params.groupId, req.params.userId);
    if (!post) {
      res.status(500).json({ error: "Failed to get user posts" });
    }
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req, res, next) {
  try {
    const post = await ChatModel.deletePost(req.params.groupId, req.params.postId);
    res.status(204).json(post);
  } catch (err) {
    next(err);
  }
}

export async function deleteUserPosts(req, res, next) {
  try {
    const post = await ChatModel.deleteUserPosts(req.params.groupId, req.params.userId);
    res.status(204).json(post);
  } catch (err) {
    next(err);
  }
}