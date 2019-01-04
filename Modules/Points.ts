import { bot } from './';
import { PointsModel } from '../other/';

class PointsClass {

    /**
     * Simpler way to increment points, basicly just calls all methods for you. Doesn't force change.
     *
     * @param {string} userID
     * @param {number} amount Amount of points to add
     * @returns {number | null} Given user's points if successfull, false if points were not changed, null if something went wrong
     * @memberof Points
     */
    public async handle(userID: string, amount: number): Promise<number | false> {
        const userPoints = await this.find(userID);
        const newUserPoints = await this.change(userPoints, amount, false);
        return newUserPoints.points;
    }

    /**
     * Searches DB for points assigned by the userID
     *
     * @param {string} userID
     * @returns Points Document, or creates a new one
     * @memberof Points
     */
    public async find(userID: string) {
        const userPoints = await PointsModel.findOne({ userID: userID });

        if (userPoints) {
            return userPoints;
        } else {
            return this.create(userID);
        }
    }

    /**
     * Changes the documents points by given amount
     *
     * @param {Document} userPoints
     * @param {number} amount Amount of points to add/remove
     * @param {boolean} force Force Points to change even if they will turn negative, changes to 0 then
     * @returns Saved Points Document if successful/forced, false if change would result in negative points, null if something went wrong
     * @memberof Points
     */
    public async change(userPoints: any, amount: number, force: boolean) {
        let saved;

        if ((userPoints.points + amount) < 0) {
            if (force) {
                userPoints.points += amount;
            } else {
                return false;
            }
        } else {
            userPoints.points += amount;
        }

        try {
            const finish = await Promise.all([
                userPoints.save(),
                this.rankcheck(userPoints)
            ]);

            saved = finish[0]
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
     * @returns {Document} Points Document
     * @memberof Points
     */
    private async create(userID: string) {
        const userPoints = new PointsModel({
            points: 0,
            userID: userID,
        });

        return await userPoints.save();
    }
}

export const Points = new PointsClass();
