import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import request from 'superagent';
import { bot, TokenManager } from './';
import { BotModel } from '../other'
import { config } from '../config';

export const app = express();
app.use(bodyParser.json());
app.use(cookieParser(config.cookieSecret))

// Oauth url: https://discordapp.com/oauth2/authorize?client_id=532627938122924055&scope=identify%20guilds&response_type=code&redirect_uri=
// Needs state & redirect ^

function checkSignature(req: Request) {
    return req.signedCookies.signature === config.cookieContent;
}

app.get('/', async (req: Request, res: Response) => {

    if (req.query.code) {
        try {
            const tokenResponse = await request
                .post('https://discordapp.com/api/oauth2/token')
                .send({
                    client_id: config.clientID,
                    client_secret: config.secret,
                    grant_type: 'authorization_code',
                    code: req.query.code,
                    redirect_uri: 'TBI!!',
                    scope: 'identify guilds'
                })
                .type('form');
            const { access_token, expires } = tokenResponse.body;

            const userResponse = await request
                .get('https://discordapp.com/api/users/@me')
                .set('Authorization', 'Bearer ' + access_token);
            const { id, username, avatar } = userResponse.body;

            TokenManager.add(id, access_token, expires);
            res.cookie('loggedin', true, { expires: expires });
            res.cookie('userID', id, { expires: expires });
            res.cookie('username', username, { expires: expires });
            res.cookie('useravatar', avatar, { expires: expires });
            res.cookie('signature', config.cookieContent, { signed: true, httpOnly: true, expires: expires });
            res.send(200);
            res.send('TBI');
        } catch (error) {
            console.log(error);
            return res.status(400).send('We were not able to get your account information from Discord. ')
        }
    }

    res.send('TBI');
});

app.get('/settings/:guildID', async (req: Request, res: Response) => {
    const authorized = checkSignature(req);
    if (!authorized) {
        return res.sendStatus(401);
    }

    const reqBot = await BotModel.findOne({ guildID: req.params.guildID });

    if (reqBot) {
        return res.status(200).send(reqBot.toObject());
    } else {
        return res.sendStatus(404);
    }
});

app.get('/account/:userID', async (req: Request, res: Response) => {
    const authorized = checkSignature(req);
    if (!authorized) {
        return res.sendStatus(401);
    }

    const bearer = TokenManager.get(req.params.userID);
    if (!bearer) {
        return res.sendStatus(400);
    }

    let guilds = [];
    try {
        const guildrequest = await request
            .get('https://discordapp.com/api/users/@me/guilds')
            .set('Authorization', 'Bearer ' + bearer);
        
        guildrequest.body.forEach((element: any) => {
            const guild = bot.guilds.get(element.id);

            if (guild && element.owner) {
                guilds.push(element);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).send('We could not get your guilds from Discord.');
    }
    
});

app.post('/upvote/:botID', async (req: Request, res: Response) => {
    const reqBot: any = await BotModel.findOne({ botID: req.params.botID });

    if (!reqBot || !reqBot.active || req.body.authentication !== reqBot.authentication) {
        return;
    }

    //await Upvote.handle(req);
});
