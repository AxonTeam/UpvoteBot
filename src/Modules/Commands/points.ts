import { MoustacheCommand } from './';
import { bot, Points } from '../';
import { PointsModel } from '../../other/';

export const points: MoustacheCommand = {
    execute: async (msg, args) => {
        const guild = bot.guilds.get((msg as any).channel.guild);

        if (!guild) {
            return 'This command needs to be used in a guild.';
        }

        const data = await PointsModel.findOne({ userID: args[0]});
        const member = guild.members.find((u: any) => u.id === args[0]);
        let message;

        if (!data) {
            message = 'That user could not be found.';
        } else if (!member) {
            message = `???: ${args[0]} currently has ${data.get('points')} points.`;
        } else {
            message = `${member.user.username}#${member.discriminator} currently has ${data.get('points')} points.`;
        }

        return message;
    },
    label: 'points',
    options: {
        description: 'Shows how many points a user currently has.',
        fullDescription: 'Shows how many points a user currently has.',
        usage: '`userID`'
    }
};
