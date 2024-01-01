import Image from "../models/Image.js";
import cron from "node-cron";

const viewsBooster = async (threshold, increment) => {
    try {
        const imagesToUpdate = await Image.find({ viewCount: { $lt: threshold } });

        if (imagesToUpdate.length > 0) {
            const result = await Image.updateMany({ viewCount: { $lt: threshold } }, { $inc: { viewCount: increment, likeCount: 2 } });

            console.log(`${result.modifiedCount} images updated.`, result);

            return result;
        } else {
            console.log('No images found with viewCount less than the specified threshold.');
        }
    } catch (error) {
        console.error(error);

    }
}


export const scheduler = () => {
    cron.schedule("0 0,12 * * *", async () => {
        console.log('Running cron job...');

        await viewsBooster(1000, 11);
    });
};
