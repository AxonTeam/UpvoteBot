import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface BoolSettings {
    active: boolean;
    roleReward: boolean;
    upvoteMessage: boolean;
}

const botProfileSchema = new Schema({
    guildID: String, // Associated Guild
    botID: String, // ID of the bot that should be tracked
    authentication: String, // Required authentication string that incoming requests must have.
    roleRewardID: String, // ID of the role that is given to upvoters
    upvoteMessageChannelID: String, // ID of the channel where upvote messages should be posted
    pointName: String, // Custom points name
    allowedRoles: Array, // Array of roleIDs that are allowed to do edits
    boolSettings: Object
});

export const botProfileModel = mongoose.model('Bot', botProfileSchema);
