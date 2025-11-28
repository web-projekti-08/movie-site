import { isOwner, isMember } from "../models/group_model.js";

// TESTING BEFORE AUTH REMOVE THIS AND REPLACE
const TEST_USER_ID = 1; // req.user.userId

export async function requireOwner(req, res, next) {
  const groupId = req.params.groupId;
  const userId = TEST_USER_ID;

  try {
    const owner = await isOwner(groupId, userId);
    if (!owner || owner.length === 0) {
      return res.status(403).json({ error: "Insufficient permission: Owner"});
    }

    return next();
  } catch(err) {
    return res.status(500).json({ error: "Middleware error", details: err });
  }
}
  
export async function requireMember(req, res, next) {
  const groupId = req.params.groupId;
  const userId = TEST_USER_ID;

  try {
    // Owner is always a member
    const owner = await isOwner(groupId, userId);
    if (owner && owner.length > 0) return next();

    const member = await isMember(groupId, userId);
    if (!member || member.length === 0) {
      return res.status(403).json({ error: "Insufficient permission: Member"});
    }

    return next();
  } catch(err) {
    return res.status(500).json({ error: "Middleware error", details: err });
  }
}

export async function requireSelfOrOwner(req, res, next) {
  const groupId = req.params.groupId;
  const targetUserId = parseInt(req.params.userId);
  const currentUserId = TEST_USER_ID;

  try {
    if (currentUserId === targetUserId) return next();

    const owner = await isOwner(groupId, currentUserId);
    if (!owner || owner.length === 0) {
      return res.status(403).json({ error: "Insufficient permission: Self, Owner"});
    }

    return next();
  } catch(err) {
    return res.status(500).json({ error: "Middleware error", details: err });
  }
}