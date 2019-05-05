import mongoose from 'mongoose';
import { app, bot } from './Modules/';
import { Guild, Role } from 'eris';
const port: number = 3001;

console.log('--------------------\nStarting UpvoteBot\n--------------------');

mongoose.connect('mongodb://localhost:27017/upvoteBotDB', {
    useNewUrlParser: true,
    autoReconnect: true
})
    .then(() => console.log('[master] Connected to MongoDB.'))
    .catch((e) => console.log(e));

app.listen(port, () => {
    console.log(`[express] Listening at port ${port}`);
});

bot.on('guildCreate', (guild: Guild) => {

});

bot.on('guildDelete', (guild: Guild) => {

});

bot.on('guildRoleDelete', (guild: Guild, role: Role) => {

});
