import { Router } from "express";
import * as GroupController from "../controllers/group_contoller.js";
import * as GroupContentController from "../controllers/group_content_controller.js"
import * as GroupChatController from "../controllers/group_chat_controller.js"
import { requireOwner, requireMember, requireSelfOrOwner} from "../middleware/permission_middleware.js"


const groupRouter = Router();
/*
  Add middleware for authentication. Example:

    groupRouter.delete("/:groupId/chat/:postId",
      authMiddleware,
      isOwner,
      GroupChatController.deletePost
    );
*/

/*
  HOW TO USE IN FRONTEND WITH AXIOS.
  GET, DELETE and PATCH functions use only url parameters, e.g. groupId, userId or postId, examples:

  Delete group chat post:
  axios.delete(`url + /groups/${groupId}/chat/${postId}`);

  Get all user posts from chat:
  axios.get(`url + /groups(${groupId}/chat/${userId}`);

  Accept group join request:
  axios.patch(`url + /groups/${groupId}/requests/${userId}/accept`);

  --------------------

  POST functions use url parameters and JSON body, examples

  Create a new group:
  axios.post(`url + /groups`, {
    userId: 1,
    groupName: "Group name",
    description: "Cool group"
  });

  Add content(media) to group:
  axios.post(`url + /groups/${groupId}/content`, {
    mediaId: 1
  });

  Create post in group chat:
  axios.post(`url + /groups/${groupId}/chat`, {
    userId: 1,
    text: "New post something blabla"
  })

*/

// Add auth middleware(getGroups exception since group list needs to be visible to visitors)
// GROUP
groupRouter.post("/", GroupController.createGroup);
groupRouter.get("/", GroupController.getGroups); // no auth
groupRouter.get("/:groupId", GroupController.getGroup);
groupRouter.delete("/:groupId", requireOwner, GroupController.deleteGroup);

// MEMBERS
groupRouter.get("/:groupId/members", requireMember, GroupController.getGroupMembers);
groupRouter.delete("/:groupId/members/:userId", requireSelfOrOwner, GroupController.removeMember);

// REQUESTS
groupRouter.post("/:groupId/requests/:userId", GroupController.createJoinRequest);
groupRouter.get("/:groupId/requests", requireOwner, GroupController.getJoinRequests);
groupRouter.patch("/:groupId/requests/:userId/accept", requireOwner, GroupController.acceptJoinRequest);
groupRouter.delete("/:groupId/requests/:userId/reject", requireOwner, GroupController.rejectJoinRequest);

// CONTENT
groupRouter.post("/:groupId/content", requireMember, GroupContentController.addContent);
groupRouter.get("/:groupId/content/:contentId", requireMember, GroupContentController.getContentById);
groupRouter.get("/:groupId/content", requireMember, GroupContentController.getAllContent);
groupRouter.delete("/:groupId/content/:contentId", requireOwner, GroupContentController.removeContent);

// CHAT
groupRouter.post("/:groupId/chat/", requireMember, GroupChatController.createPost);
groupRouter.get("/:groupId/chat", requireMember, GroupChatController.getPosts);
groupRouter.get("/:groupId/chat/:userId", requireOwner, GroupChatController.getUserPosts);
groupRouter.delete("/:groupId/chat/:postId", requireOwner, GroupChatController.deletePost);
groupRouter.delete("/:groupId/chat/user/:userId", requireOwner, GroupChatController.deleteUserPosts);

export default groupRouter;