import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    content: { type: String, required: true },
    comments: {
      type: Array,
      default: [],
    },
    author: { type: String, required: true },
    author_profile_picture: {
      type: String,
    }
  },
  { timestamps: true }
);

const commentSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    post_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);
const Comment = model("Comment", commentSchema);

export { Post, Comment };


// some changes here