import User from "../models/Users.js";

export const getAllPhotographers = async (req, res) => {
    try {
        const page = parseInt(req.query.pg) || 1; // Get the page number from the query, default to 1 if not provided
        const pageSize = 10; // Number of photographers per page

        const totalPhotographers = await User.countDocuments({ isCreator: true });
        const totalPages = Math.ceil(totalPhotographers / pageSize);

        const photographers = await User.find({ isCreator: true })
                                        .sort({ createdAt: -1 })
                                        .skip((page - 1) * pageSize) // Skip documents based on the current page
                                        .limit(pageSize); // Limit the number of documents returned per page

        const filteredPhotographers = photographers.map((photographer) => {
            const { password, updatedAt, ...other } = photographer._doc;
            return other;
        });

        res.status(200).json({
            totalPages,
            currentPage: page,
            photographers: filteredPhotographers
        });
    } catch (error) {
        res.status(500).json(error);
    }
}
