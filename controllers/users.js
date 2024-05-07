import User from "../models/Users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

export const updateUserProfile = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json("Not authorised to update");
    }

    const token = authHeader && authHeader.split(" ")[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json("User not found");
        }

        // console.log(user)
        // console.log(req.body)

        // Update user properties based on form data
        user.username = req.body.username || user.username;
        user.location = req.body.location || user.location;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.hourlyRate = req.body.hourlyRate || user.hourlyRate;
        user.bio = req.body.bio || user.bio;
        user.profileUrl = req.body.profileUrl || user.profileUrl;

        // Save the updated user
        const updatedUser = await user.save();
        // console.log(updatedUser)

        // Return the updated user without sensitive data
        const { password, updatedAt, ...other } = updatedUser._doc;
        res.status(200).json({ other, message: "Update successful" });
    } catch (err) {
        res.status(500).json(err);
    }
}


export const getAllPhotographers = async (req, res) => {
    try {
        const photographers = await User.find({ isCreator: true }).sort({ createdAt: -1 });
        const filteredPhotographers = photographers.map((photographer) => {
            const { password, updatedAt, ...other } = photographer._doc;
            return other;
        });
        res.status(200).json(filteredPhotographers);
    } catch (error) {
        res.status(500).json(error);
    }
}