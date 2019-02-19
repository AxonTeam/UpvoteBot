import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface boolSettings {
    active: boolean;
    roleReward: boolean;
    upvoteMessage: boolean;
    pointName: boolean;
}

const botSchema = new Schema({
    guildID: String, // Associated Guild
    botID: String, // ID of the bot that should be tracked
    authentication: String, // Required authentication string that incoming requests must have.
    roleRewardID: String, // ID of the role that is given to upvoters
    upvoteMessageChannelID: String, // ID of the channel where upvote messages should be posted
    pointName: String, // Custom points name
    boolSettings: Object,
    edits: Map // Map of edits made by users, <userID, Date>
});

export const BotModel = mongoose.model('Bot', botSchema);
