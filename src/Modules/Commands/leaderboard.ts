import { MoustacheCommand } from './';
import { bot } from '../';
import { PointsModel } from '../../other/';

export const leaderboard: MoustacheCommand = {
    execute: async (msg) => {
        const data = await PointsModel.find({ guildID: (msg as any).channel.guild }).sort('-points').limit(10);
        const fields: object[] = [];
        const guild = bot.guilds.get((msg as any).channel.guild);

        if (!guild) {
            return 'This command needs to be used in a guild.';
        }

        data.forEach((element: any, index) => {
            const member = guild.members.find((u: any) => u.id === element.userID);

            if (!member) {
                fields.push({
                    name: `${index + 1} | ???: ${element.userID}`,
                    value: `Points: ${element.points}`
                });
            } else {
                fields.push({
                    name: `${index + 1} | ${member.user.username}#${member.discriminator}`,
                    value: `Points: ${element.points}`
                });
            }
        });

        const embed = {
            embed: {
                color: 0x7289da,
                fields
            }
        };

        return bot.createMessage(msg.channel.id, embed);
    },
    label: 'leaderboard',
    options: {
        description: 'Shows the point leaderboard.',
        fullDescription: 'Shows the top 10 users in the guild with the most points.',
        usage: ''
    }
};
