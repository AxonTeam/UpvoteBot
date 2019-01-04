import { CommandClient } from 'eris';
import { commands } from './Commands';
import { config } from './';

const commandOptions = {
    description: 'Community Bot for the Ease server',
    owner: 'Eleos#0010',
    prefix: ['@mention', 'm!'],
};

export const bot = new CommandClient(config.token, {}, commandOptions);

bot.connect();

bot.once('ready', () => {
    console.log('[startup] Bot ready.');
});

bot.on('error', (e: Error) => {
    console.log(e);
});

commands.forEach((element) => {
    const command = bot.registerCommand(element.label, element.execute, element.options);

    if (element.subcommands) {
        element.subcommands.forEach((subcommand) => {
            command.registerSubcommand(subcommand.label, subcommand.execute, subcommand.options);
        })
    }
});