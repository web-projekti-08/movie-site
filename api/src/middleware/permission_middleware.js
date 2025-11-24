import { isOwner, isMember } from "../models/group_model.js";

export async function requireOwner(req, res, next) {
  const groupId = req.params.groupId;

 
  const userId = 1;
  console.log("userId: " + userId);
  console.log("groupId: " + groupId);

  try {
    const owner = await isOwner(groupId, userId);
    console.log(owner);
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


  const userId = 3;

  try {
    
    const owner = await isOwner(groupId, userId);
    if (owner && owner.length > 0) return next();
    console.log(owner);

    const member = await isMember(groupId, userId);
    console.log(member);
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


  const currentUserId = 1;

  console.log("userId: " + currentUserId);
  console.log("groupId: " + groupId);

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