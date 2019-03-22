import { PointsModel } from '../other/';

// Should take a look again
class PointsClass {

    /**
     * Searches DB for points assigned by the userID
     *
     * @param {string} userID
     * @returns Points Document, or null if not found
     * @memberof Points
     */
    public async find(userID: string, guildID: string) {
        const userPoints = await PointsModel.findOne({ userID, guildID });

        if (userPoints) {
            return userPoints;
        } else {
            return this.create(userID, guildID);
        }
    }

    /**
     * Changes the documents points by given amount
     *
     * @param {Document} userPoints
     * @param {string} guildID
     * @param {number} amount Amount of points to add/remove
     * @param {boolean} force Force Points to change even if they will turn negative
     * @returns Saved Points Document if successful/forced, false if change would result in negative points, null if something went wrong
     * @memberof Points
     */
    public async change(userPoints: any, guildID: string, amount: number, force: boolean) {
        const guildPoints = userPoints.guilds.get(guildID);
        let saved;

        if ((guildPoints + amount) < 0) {
            if (force) {
                userPoints.guilds.set(guildPoints + amount);
            } else {
                return false;
            }
        } else {
            userPoints.guilds.set(guildPoints + amount);
        }

        try {
            saved = await userPoints.save();
        } catch (err) {
            console.log(err);
            saved = null;
        }

        return saved;
    }

    /**
     * Creates a new Points Document for given userID
     *
     * @private
     * @param {string} userID
     * @param {string} guildID guildID that should be added
     * @returns {Document} Points Document
     * @memberof Points
     */
    private async create(userID: string, guildID: string) {
        const userPoints = new PointsModel({
            userID,
            guilds: new Map([[guildID, 0]])
        });

        return await userPoints.save();
    }
}

export const Points = new PointsClass();
