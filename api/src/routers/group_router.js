import { Router } from "express";
import * as GroupController from "../controllers/group_contoller.js";
import * as GroupContentController from "../controllers/group_content_controller.js"
import * as GroupChatController from "../controllers/group_chat_controller.js"

const groupRouter = Router();
/*
  Maybe add middleware for authentication and privilege check. Example:

    groupRouter.delete("/:groupId/chat/:postId",
      authMiddleware,
      isOwner,
      GroupChatController.deletePost
    );

  Also figure out URL schema, when to use url parameters vs body best practises turd.
  Eli nämä saattaa muuttua.
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

  Add media to group:
  axios.post(`url + /groups/${groupId}/media`, {
    mediaId: 1
  });

  Create post in group chat:
  axios.post(`url + /groups/${groupId}/chat`, {
    userId: 1,
    text: "New post something blabla"
  })

*/
/*
  Every route except getGroups needs authentication check.
  Groups need to be visible for visitor, but accessed only by logged in user.
  Privilege permissions next to route.
*/
// /groups
groupRouter.post("/", GroupController.createGroup);
groupRouter.get("/", GroupController.getGroups);
groupRouter.get("/:groupId", GroupController.getGroup);
groupRouter.delete("/:groupId", GroupController.deleteGroup); //owner

// /groups/:groupId/members
groupRouter.get("/:groupId/members", GroupController.getGroupMembers); //owner, member
groupRouter.delete("/:groupId/members/:userId", GroupController.removeMember); //owner, self

// /groups/:groupId/requests
groupRouter.post("/:groupId/requests/:userId", GroupController.createJoinRequest);
groupRouter.get("/:groupId/requests", GroupController.getJoinRequests); //owner
groupRouter.patch("/:groupId/requests/:userId/accept", GroupController.acceptJoinRequest); //owner
groupRouter.delete("/:groupId/requests/:userId/reject", GroupController.rejectJoinRequest); //owner

// /groups/:groupId/media
groupRouter.post("/:groupId/media", GroupContentController.addMedia); //owner, member
groupRouter.get("/:groupId/media/:mediaId", GroupContentController.getMediaById); //owner, member
groupRouter.get("/:groupId/media", GroupContentController.getAllMedia); //owner, member
groupRouter.delete("/:groupId/media/:contentId", GroupContentController.removeMedia); //owner, self

// /groups/:groupId/chat
groupRouter.post("/:groupId/chat", GroupChatController.createPost); //owner, member
groupRouter.get("/:groupId/chat", GroupChatController.getPosts); //owner, member
groupRouter.get("/:groupId/chat/:userId", GroupChatController.getUserPosts); //owner
groupRouter.delete("/:groupId/chat/:postId", GroupChatController.deletePost); //owner
groupRouter.delete("/:groupId/chat/user/:userId", GroupChatController.deleteUserPosts); //owner

export default groupRouter;