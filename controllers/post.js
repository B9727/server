import { Post, Comment } from "../models/QuizPost.js";
import User from "../models/Users.js";

// Get all comments
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    if (posts.length === 0) {
      res.status(404).json({ message: "No posts were found" });
    } else {
      const resData = {
        posts,
        message: "Successfully fetched posts",
      };
      res.status(200).json(resData);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add Quiz Post
export const addPost = async (req, res) => {
  try {
    const postAuthor = await User.findById(req.body.userId);
    if (postAuthor) {
      const newPost = new Post({
        content: req.body.content,
        user_id: req.body.userId,
        author: postAuthor.username,
        author_profile_picture: postAuthor.profileUrl, 
      });
      await newPost.save();
      res.status(200).json({ message: "Post successfully added" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add Comment
export const addComment = async (req, res) => {
  try {
    const newComment = new Comment({
      user_id: req.body.userId,
      comment: req.body.comment,
    });
    const post = await Post.findOne({ _id: req.body.post_id });
    post.comments = [...post.comments, newComment];
    // await newComment.save();
    await post.save();
    res.status(200).json({ message: "Comment successfully added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Edit Actions

// Edit Post
export const editPost = async (req, res) => {};

// Edit Comment
export const editComment = async (req, res) => {};

// Delete Actions
// Delete Post
export const deletePost = async (req, res) => {
  try {
    const postToDelete = await Post.findOne({ _id: req.body.post_id });

    if (!postToDelete) {
      return res.status(404).json({ message: "Post not found" });
    }

    await postToDelete.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.body.post_id });
    updatedPostComments = post.comment.filter({ _id: !req.body.comment_id });
    await updatedPostComments.save();
    res.status(200).json({ message: "Comment successfully deleted" });
  } catch (error) {
    console.log(error);
  }
};
