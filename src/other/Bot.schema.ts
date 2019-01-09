import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const botSchema = new Schema({
    botID: String, // ID of the bot attached to /upvote/:botid
    guildID: String, // Associated Guild
    authentication: String, // Required authentication string that incoming requests must have.
    roleRewardID: String, // ID of the role that is given to upvoters
    upvoteMessageChannelID: String, // ID of the channel where upvote messages should be posted
    pointName: String, // Custom points name
    active: Boolean // Stop tracking upvotes for a guild under certain conditions
});

export const BotModel = mongoose.model('Bot', botSchema);