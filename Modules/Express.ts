import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Upvote, config } from './';

export const app = express();
app.use(bodyParser.json());

app.post('/upvote/:botID', async (req: Request, res: Response) => {
    // Abort if wrong authorization header
    if (config.authorization.length > 0 && req.headers.authorization !== config.authorization) {
        return console.log('[express] A request to /upvote arrived with the wrong authorization header...\n' + req.headers.authorization);
    }

    await Upvote.handle(req);
});

app.get('/', (req: Request, res: Response) => {
    res.send('TBI');
});
