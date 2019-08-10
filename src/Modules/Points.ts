import { PointsModel } from '../other/';
import { Document } from 'mongoose';

// Should take a look again
class PointsClass {

    /**
     * Gets the points of a user in a guild, creates a new point document if none exists
     *
     * @param {string} userID
     * @param {string} guildID
     * @returns {Document} Points Document
     * @memberof PointsClass
     */
    public async find(userID: string, guildID: string) {
        const userPoints = await PointsModel.findOne({ userID, guildID });

        if (userPoints) {
            return userPoints;
        } else {
            return await this.create(userID, guildID);
        }
    }

    /**
     * Changes the points in userPoints by amount
     *
     * @param {Document} userPoints
     * @param {number} amount
     * @returns {Document} Updated document
     * @memberof PointsClass
     */
    public async change(userPoints: Document, amount: number) {
        const guildPoints = userPoints.get('points', Number);

        userPoints.set('points', guildPoints + amount);

        return await userPoints.save()
            .catch((e) => console.log(e));
    }

    /**
     * Creates a new document for points
     *
     * @private
     * @param {string} userID
     * @param {string} guildID
     * @returns New document
     * @memberof PointsClass
     */
    private async create(userID: string, guildID: string) {
        const userPoints = new PointsModel({
            userID,
            guildID,
            points: 0
        });

        return await userPoints.save();
    }
}

export const Points = new PointsClass();
