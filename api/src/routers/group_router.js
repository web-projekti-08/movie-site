import { Router } from "express";
import * as GroupController from "../controllers/group_controller.js";
import * as GroupContentController from "../controllers/group_content_controller.js"
import * as GroupChatController from "../controllers/group_chat_controller.js"
import { requireOwner, requireMember, requireSelfOrOwner} from "../middleware/permission_middleware.js"
import { authenticateToken } from "../middleware/auth.js"


const groupRouter = Router();

// GROUP
groupRouter.post("/", authenticateToken, GroupController.createGroup);
groupRouter.get("/", GroupController.getGroups);
// USER GROUPS
groupRouter.get("/user", authenticateToken, GroupController.getUserGroups);

groupRouter.get("/:groupId", authenticateToken, GroupController.getGroup);
groupRouter.delete("/:groupId", authenticateToken, requireOwner, GroupController.deleteGroup);

// MEMBERS
groupRouter.get("/:groupId/members", authenticateToken, requireMember, GroupController.getGroupMembers);
groupRouter.delete("/:groupId/members/:userId", authenticateToken, requireSelfOrOwner, GroupController.removeMember);

// REQUESTS
groupRouter.post("/:groupId/requests", authenticateToken, GroupController.createJoinRequest);
groupRouter.get("/:groupId/requests", authenticateToken, requireOwner, GroupController.getJoinRequests);
groupRouter.patch("/:groupId/requests/:userId/accept", authenticateToken, requireOwner, GroupController.acceptJoinRequest);
groupRouter.delete("/:groupId/requests/:userId/reject", authenticateToken, requireOwner, GroupController.rejectJoinRequest);

// CONTENT
groupRouter.post("/:groupId/content", authenticateToken, requireMember, GroupContentController.addContent);
groupRouter.get("/:groupId/content/:contentId", authenticateToken, requireMember, GroupContentController.getContentById);
groupRouter.get("/:groupId/content", authenticateToken, requireMember, GroupContentController.getAllContent);
groupRouter.delete("/:groupId/content/:contentId", authenticateToken, requireOwner, GroupContentController.removeContent);

// CHAT
groupRouter.post("/:groupId/chat", authenticateToken, requireMember, GroupChatController.createPost);
groupRouter.get("/:groupId/chat", authenticateToken, requireMember, GroupChatController.getPosts);
groupRouter.get("/:groupId/chat/:userId", authenticateToken, requireOwner, GroupChatController.getUserPosts);
groupRouter.delete("/:groupId/chat/:postId", authenticateToken, requireOwner, GroupChatController.deletePost);
groupRouter.delete("/:groupId/chat/user/:userId", authenticateToken, requireOwner, GroupChatController.deleteUserPosts);

export default groupRouter;