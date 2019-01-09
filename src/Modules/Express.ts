import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
//import { Upvote } from './';
import { BotModel } from '../other'

export const app = express();
app.use(bodyParser.json());

// Oauth url: https://discordapp.com/oauth2/authorize?client_id=532627938122924055&scope=identify%20guilds&response_type=code&redirect_uri=
// Needs state ^

app.post('/upvote/:botID', async (req: Request, res: Response) => {
    const reqBot: any = await BotModel.findOne({ botID: req.params.botID });

    if (!reqBot || !reqBot.active || req.body.authentication !== reqBot.authentication) {
        return;
    }

    //await Upvote.handle(req);
});

app.get('/', (req: Request, res: Response) => {
    // do something else when the url has a code from discord
    if (req.query.code) {
        // oh shit i didnt code this yet
    }
    res.send('TBI');
});

app.get('/settings/:botid', (req: Request, res: Response) => {

});