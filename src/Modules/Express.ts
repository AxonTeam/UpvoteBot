import express, { Request, Response } from 'express';
import { Document } from 'mongoose';
import bodyParser from 'body-parser';
import { bot } from './';
import { botProfileModel } from '../other';

export const app = express();
app.use(bodyParser.json());

app.post('/upvote/:botID', async (req: Request, res: Response) => {
    const reqBot = await botProfileModel.findOne({ botID: req.params.botID });

    if (!reqBot) {
        return;
    } else if (!reqBot.get('active') || req.body.authentication !== reqBot.get('authentication')) {
        // await Upvote.handle(req);
    }
});
