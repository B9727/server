import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
    },
    photographer: {
      type: String,
    },
    userId: {
      type: String,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Array,
      default: [],
    },
    dateUploaded: {
      type: Date,
      default: Date.now,
    },
    version: {
      type: String,
    },
    imageName: {
      type: String,
      default: "imageName",
    },
  },
  { timestamps: true }
);
var Image = mongoose.model("Image", ImageSchema);
export default Image;
