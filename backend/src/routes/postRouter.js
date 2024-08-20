import express from 'express';
import { createPost, getPost, DeletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts } from '../controllers/postController.js';
import { protectRoutes } from '../middlewares/protectRoutes.js';

const postRouter = express.Router()

postRouter.get("/:id", getPost)
postRouter.get("/user/:username", getUserPosts)

postRouter.post("/create", protectRoutes, createPost)
postRouter.delete("/delete/:postId", protectRoutes, DeletePost)

postRouter.put("/like/:id", protectRoutes, likeUnlikePost);
postRouter.put("/reply/:id", protectRoutes, replyToPost);

postRouter.get("/feed/post", protectRoutes, getFeedPosts)
export default postRouter