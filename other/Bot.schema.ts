import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const pointsSchema = new Schema({
    botID: String, // ID of the bot attached to /upvote/:botid
    guildID: String, // Associated Guild
    upvoteMessage: String, // A custom upvote message if any (still needs to be figured out)
    pointName: String // Custom points name
});

export const PointsModel = mongoose.model('Points', pointsSchema);
