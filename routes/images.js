import express from "express";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Image from "../models/Image.js";
import User from "../models/Users.js";

const ITEMS_PER_PAGE = 3;

const router = express.Router();
dotenv.config();

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDINARYSECRET,
  secure: true,
});

router.get("/get-signature", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    cloudinaryConfig.api_secret
  );
  res.json({ timestamp, signature });
});

router.post("/upload", async (req, res) => {
  try {
    const newImage = new Image({
      imageUrl: req.body.public_id,
      photographer: req.body.username,
      userId: req.body.userId,
      viewCount: 0,
      likeCount: 0,
      imageName: req.body.imageName,
      dateUploaded: new Date(),
      version: req.body.version,
    });

    const user = await User.findOne({ _id: req.body.userId });
    user.images = [...user.images, newImage];

    const image = await newImage.save();
    await user.save();
    // console.log("image saved");
    res.status(200).json(image);
  } catch (error) {
    // console.error("Error uploading image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get all images
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

router.get("/featured",)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.pg) || 1;

    const skipCount = (page - 1) * ITEMS_PER_PAGE;

    // Define the range of random image sizes (2, 3, or 4)
    const randomSize = Math.floor(Math.random() * 2) + 2; // Randomly selects 2, 3, or 4

    // Retrieve a larger pool of random images
    const randomImagesPool = await Image.aggregate([
      { $sample: { size: 10 } } // Adjust the size as needed to ensure enough random images
    ]);

    // Select a random subset of unique images from the pool
    const uniqueRandomImages = getRandomUniqueImages(randomImagesPool, randomSize);

    // Shuffle the array of unique random images
    const shuffledImages = uniqueRandomImages.sort(() => Math.random() - 0.5);

    const imageResponse = shuffledImages.length > 0 ? shuffledImages : "No Images";
    res.status(200).json(imageResponse);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Function to select a random subset of unique images
function getRandomUniqueImages(images, size) {
  const uniqueImages = [];
  const shuffledImages = images.sort(() => Math.random() - 0.5);

  for (let i = 0; i < shuffledImages.length && uniqueImages.length < size; i++) {
    if (!uniqueImages.some(image => image._id === shuffledImages[i]._id)) {
      uniqueImages.push(shuffledImages[i]);
    }
  }

  return uniqueImages;
}



// personal images
router.get("/profile", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Set the user ID in the request object for future use

      const allImages = await Image.find({ userId: decoded.id }).sort({
        createdAt: -1,
      });
      const imageResponse = allImages ? allImages : "No Images";
      res.json(imageResponse);
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// PUT /api/images/:id/like
router.put("/:id/like", async (req, res) => {
  const imageId = req.params.id;
  // console.log(imageId)

  try {
    // Find the image by its ID
    const image = await Image.findOne({ _id: imageId });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Increase the likeCount by 1
    image.likeCount += 1;

    // Save the updated image
    await image.save();

    // console.log(image.likeCount)

    res.status(200).json({ likeCount: image.likeCount });
  } catch (error) {
    console.error("Error updating image like count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get a single image
router.get("/:id", async (req, res) => {
  // console.log("get single image endpoint hit");
  const imageId = req.params.id;

  try {
    // Find the image by its ID
    const image = await Image.findOne({ imageUrl: imageId });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Increment the view count
    if (image.viewCount) {
      image.viewCount++;
    } else {
      image.viewCount = 1;
    }

    await image.save();

    res.status(200).json(image);
    // console.log(image);
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete an image
router.delete("/:id", async (req, res) => {
  const imageId = req.params.id;

  try {
    // Find the image by its ID
    const image = await Image.findOne({ _id: imageId });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete the image from Cloudinary
    // await cloudinary.uploader.destroy(image.imageUrl, cloudinaryConfig);

    // Remove the image from the User's images array
    const user = await User.findOne({ _id: image.userId });
    user.images = user.images.filter((img) => img._id.toString() !== imageId);
    await user.save();

    // Delete the image from the database
    await image.deleteOne();

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// end of cloadinary logic

export default router;
