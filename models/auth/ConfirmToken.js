import mongoose, { Schema } from "mongoose";

const tokenSchema = new mongoose.Schema({
  userID: {
    type: String,
    require: true,
    ref: "User",
  },
  confirmCode: { type: String, require: true },
});

var confirmToken = mongoose.model("confirmToken", tokenSchema);
export default confirmToken;
