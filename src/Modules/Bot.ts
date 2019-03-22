import { CommandClient, Guild } from 'eris';
import { commands } from './Commands';
import { config } from '../config';

const commandOptions = {
    description: '',
    owner: 'Eleos#0010',
    prefix: ['@mention', 'u!'],
};

export const bot = new CommandClient(config.token, {}, commandOptions);

bot.connect();

bot.once('ready', () => {
    console.log('[startup] Bot ready.');
});

bot.on('guildCreate', async (guild: Guild) => {
    const ownerChannel = await guild.members.get(guild.ownerID)!.user.getDMChannel();

    const embed = { embed: {
        title: '*Hey there!*',
        description: 'We\'re glad you\'re interested in UpvoteBot! Before we get started you need to set up some stuff. Visit [UpvoteBot\'s documentation](google.com) for a guide.'
    }};

    if (!ownerChannel) {
        return;
    } else {
        ownerChannel.createMessage(embed);
    }
});

bot.on('error', (e: Error) => {
    console.log(e);
});

commands.forEach((element) => {
    const command = bot.registerCommand(element.label, element.execute, element.options);
    console.log(`[startup] Command registered: ${element.label}`);

    if (element.subcommands) {
        element.subcommands.forEach((subcommand) => {
            command.registerSubcommand(subcommand.label, subcommand.execute, subcommand.options);
            console.log(`[startup] Subcommand registered: ${element.label} ${subcommand.label}`);
        })
    }
});