import Image from "../models/Image.js";
import cron from "node-cron";

// const viewsBooster = async (threshold, increment) => {
//     try {
//         const imagesToUpdate = await Image.find({ viewCount: { $lt: threshold } });

//         if (imagesToUpdate.length > 0) {
//             const result = await Image.updateMany({ viewCount: { $lt: threshold } }, { $inc: { viewCount: increment, likeCount: 2 } });

//             console.log(`${result.modifiedCount} images updated.`, result);

//             return result;
//         } else {
//             console.log('No images found with viewCount less than the specified threshold.');
//         }
//     } catch (error) {
//         console.error(error);

//     }
// }

const viewsBooster = async (threshold, increment) => {
    try {
        const result = await Image.updateMany(
            { viewCount: { $lt: threshold } },
            { $inc: { viewCount: increment, likeCount: 2 } }
        );

        console.log(`${result.modifiedCount} images updated.`, result);

        return result;
    } catch (error) {
        console.error(error);
    }
};

export const scheduler = () => {
    // Every 10 minutes
    // cron.schedule("*/10 * * * *", async () => {
    //     try {
    //         console.log('Running cron job every 10 minutes...');
    //         await viewsBooster(10000, 11);
    //         console.log('Cron job completed successfully.');
    //     } catch (error) {
    //         console.error('Error in cron job:', error);
    //     }
    // });

    // Every 30 minutes
    // cron.schedule("*/30 * * * *", async () => {
    //     try {
    //         console.log('Running cron job every 30 minutes...');
    //         await viewsBooster(5000, 12);
    //         console.log('Cron job completed successfully.');
    //     } catch (error) {
    //         console.error('Error in cron job:', error);
    //     }
    // });

    // Every 1 hour
    // cron.schedule("0 * * * *", async () => {
    //     try {
    //         console.log('Running cron job every hour...');
    //         await viewsBooster(3000, 31);
    //         console.log('Cron job completed successfully.');
    //     } catch (error) {
    //         console.error('Error in cron job:', error);
    //     }
    // });

    // Every 4 hours
    cron.schedule("0 */4 * * *", async () => {
        try {
            console.log('Running cron job every 4 hours...');
            await viewsBooster(1000, 11);
            console.log('Cron job completed successfully.');
        } catch (error) {
            console.error('Error in cron job:', error);
        }
    });

    // Every 12 hours
    // cron.schedule("0 0,12 * * *", async () => {
    //     try {
    //         console.log('Running cron job...');
    //         await viewsBooster(20000, 111);
    //         console.log('Cron job completed successfully.');
    //     } catch (error) {
    //         console.error('Error in cron job:', error);
    //     }
    // });
};
