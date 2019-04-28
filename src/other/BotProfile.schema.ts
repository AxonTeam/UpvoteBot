import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const boolSettings = {
    active: Boolean,
    roleReward: Boolean,
    upvoteMessage: Boolean,
}

export const botProfileOptions = {
    guildID: String, // Associated Guild
    botID: String, // ID of the bot that should be tracked
    authentication: String, // Required authentication string that incoming requests must have.
    roleRewardID: String, // ID of the role that is given to upvoters
    upvoteMessageChannelID: String, // ID of the channel where upvote messages should be posted
    pointName: String, // Custom points name
    allowedRoles: Array, // Array of roleIDs that are allowed to do edits
    boolSettings
};

const botProfileSchema = new Schema(botProfileOptions);

export const botProfileModel = mongoose.model('Bot', botProfileSchema);
