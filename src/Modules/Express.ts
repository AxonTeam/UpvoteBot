import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { bot, TokenManager } from './';
import { BotModel } from '../other'

export const app = express();
app.use(bodyParser.json());

app.post('/upvote/:botID', async (req: Request, res: Response) => {
    const reqBot: any = await BotModel.findOne({ botID: req.params.botID });

    if (!reqBot || !reqBot.active || req.body.authentication !== reqBot.authentication) {
        return;
    }

    //await Upvote.handle(req);
});
