import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const pointsSchema = new Schema({
    userID: String,
    guilds: Map
});

export const PointsModel = mongoose.model('Points', pointsSchema);
