import User from "../models/Users.js";
import express from "express";
import dotenv from "dotenv";
import { getAllPhotographers, updateUserProfile } from "../controllers/users.js";

const router = express.Router();

dotenv.config();

// Update user
router.put("/put", updateUserProfile);

router.get("/all", getAllPhotographers);
router.get("/", async (req, res) => {
  try {
    const users__ = await User.find().sort({ createdAt: -1 });
    const users = users__.map((photographer) => {
      const { password, updatedAt, ...other } = photographer._doc;
      return other;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get a user
router.get("/:id", async (req, res) => {
  // console.log("single user hit")
  try {
    const user = await User.findOne({ _id: req.params.id });
    const { password, updatedAt, ...other } = user._doc;
    // console.log(other)
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
