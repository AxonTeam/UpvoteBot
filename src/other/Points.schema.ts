import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const pointsSchema = new Schema({
    userID: String,
    guildID: String,
    points: Number
});

export const PointsModel = mongoose.model('Points', pointsSchema);
