import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 150,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 4,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    images: {
      type: Array,
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    profileUrl: {
      type: String,
      default: "",
    },
    favourite: {
      type: Array,
      default: [],
    },
    isCreator: {
      type: Boolean,
      default: false,
    },
    isS_C: {
      type: Boolean,
      default: false,
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);
export default User;
