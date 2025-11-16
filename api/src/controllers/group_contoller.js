import * as GroupModel from "../models/group_model.js";

// GROUP
export async function createGroup(req, res, next) {
  try {
    const { userId, groupName, description } = req.body;
    const group = await GroupModel.createGroup(userId, groupName, description);
    if (!group) {
      res.status(500).json({ error: "Failed to create group" });
    }
    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
}

export async function getGroups(req, res, next) {
  try {
    const groups = await GroupModel.getGroups();
    if (!groups) {
      res.status(500).json({ error: "Failed to get groups" });
    }
    res.status(200).json(groups);
  } catch (err) {
    next(err);
  }
}

export async function getGroup(req, res, next) {
  try {
    const group = await GroupModel.getGroup(req.params.groupId);
    if (!group) {
      res.status(500).json({ error: "Failed to get group" });
    }
    res.status(200).json(group);
  } catch (err) {
    next(err);
  }
}

export async function deleteGroup(req, res, next) {
  try {
    const result = await GroupModel.deleteGroup(req.params.groupId);
    res.status(204).json(result);
  } catch (err) {
    next(err);
  }
}

// GROUP MEMBER
export async function getGroupMembers(req, res, next) {
  try {
    const members = await GroupModel.getGroupMembers(req.params.groupId);
    res.status(200).json(members);
  } catch (err) {
    next(err);
  }
}

export async function isOwner(req, res, next) {
  try {
    const result = await GroupModel.isOwner(req.params.groupId, req.body.userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function isMember(req, res, next) {
  try {
    const result = await GroupModel.isMember(req.params.groupId, req.body.userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function removeMember(req, res, next) {
  try {
    const result = await GroupModel.removeMember(req.params.groupId, req.params.userId);
    if (!result) return res.status(404).json({ error: "Member not found" });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

// REQUESTS
export async function createJoinRequest(req, res, next) {
  try {
    const request = await GroupModel.createJoinRequest(req.params.groupId, req.params.userId);
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
}

export async function getJoinRequests(req, res, next) {
  try {
    const requests = await GroupModel.getJoinRequests(req.params.groupId);
    res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
}

export async function acceptJoinRequest(req, res, next) {
  try {
    const result = await GroupModel.acceptJoinRequest(req.params.groupId, req.params.userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function rejectJoinRequest(req, res, next) {
  try {
    const result = await GroupModel.rejectJoinRequest(req.params.groupId, req.params.userId);
    res.status(204).json(result);
  } catch (err) {
    next(err);
  }
}