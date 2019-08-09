import { PointsModel } from '../other/';
import { Document } from 'mongoose';

// Should take a look again
class PointsClass {

    public async find(userID: string, guildID: string) {
        const userPoints = await PointsModel.findOne({ userID, guildID });

        if (userPoints) {
            return userPoints;
        } else {
            return await this.create(userID, guildID);
        }
    }

    public async change(userPoints: Document, amount: number) {
        const guildPoints = userPoints.get('points', Number);

        userPoints.set('points', guildPoints + amount);

        return await userPoints.save()
            .catch((e) => console.log(e));
    }

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
