import express from "express";
import {
  addComment,
  addPost,
  deleteComment,
  deletePost,
  editComment,
  editPost,
  getPosts,
} from "../controllers/post.js";

const postRouter = express.Router();

postRouter.get("/", getPosts);
postRouter.post("/post", addPost);
postRouter.post("/comment", addComment);
postRouter.put("/post/:id", editPost);
postRouter.put("/commet/:id", editComment);
postRouter.delete("/post/:id", deletePost);
postRouter.delete("/comment/:id", deleteComment);

export default postRouter;
