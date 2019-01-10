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

app.get('/', (req: Request, res: Response) => {
    // do something else when the url has a code from discord
    if (req.query.code) {
        // dont request new tokens if TokenManager has them already
        request
            .post('https://discordapp.com/api/oauth2/token')
            .send({
                client_id: config.clientID,
                client_secret: config.secret,
                grant_type: 'authorization_code',
                code: req.query.code,
                redirect_uri: 'TBI!!',
                scope: 'identify guilds'
            })
            .type('form')
            .then(
            (tokenres) => {
                request
                    .get('https://discordapp.com/api/users/@me')
                    .set('Authorization', 'Bearer ' + tokenres.body.access_token)
                    .then(
                        (userres) => {
                            TokenManager.add(userres.body.id, tokenres.body.access_token, tokenres.body.expires);

                            res.cookie('loggedin', true, { expires: tokenres.body.expires })
                            res.cookie('userID', userres.body.id, { expires: tokenres.body.expires });
                            res.cookie('username', userres.body.username, { expires: tokenres.body.expires });
                            res.cookie('useravatar', userres.body.avatar, { expires: tokenres.body.expires });
                            res.cookie('signature', config.cookieContent, { signed: true, httpOnly: true, expires: tokenres.body.expires });
                            res.sendStatus(200);
                        },
                        () => {
                            return res.status(400).send('We weren\'t able to get your account information from Discord. ono')
                        });
                
            });
    }

    res.send('TBI');
});

app.get('/settings/:botID', async (req: Request, res: Response) => {
    const authorized = checkSignature(req);
    if (!authorized) {
        return res.sendStatus(401);
    }

    const reqBot = await BotModel.findOne({ botID: req.params.botID });

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
    request
        .get('https://discordapp.com/api/users/@me')
        .then((guildres) => {
            guildres.body.forEach((element: any) => {
                if (bot.guilds.has(element.id)) {
                    if (bot.guilds.get(element.id)!.ownerID === req.params.userID) {
                        guilds.push(element);
                    }
                }
            });
        },
        () => {
            return res.status(400).send('We couldn\'t get your guilds from Discord.')
        });

    
});

app.post('/upvote/:botID', async (req: Request, res: Response) => {
    const reqBot: any = await BotModel.findOne({ botID: req.params.botID });

    if (!reqBot || !reqBot.active || req.body.authentication !== reqBot.authentication) {
        return;
    }

    //await Upvote.handle(req);
});
