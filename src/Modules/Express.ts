import express, { Request, Response } from 'express';
import { Document } from 'mongoose';
import bodyParser from 'body-parser';
import { BotProfileManager } from './';

export const app = express();
app.use(bodyParser.json());

app.post('/upvote/:botID', async (req: Request, res: Response) => {
    const botProfile = await BotProfileManager.getProfileThroughBotID(req.body.botID);

    if (!botProfile) {
        return;
    } else if (!botProfile.get('active') || req.body.authentication !== botProfile.get('authentication')) {
        // await Upvote.handle(req, botProfile);
    }
});
