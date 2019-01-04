import { MoustacheCommand } from './';
import { bot, config } from '../';
import { PointsModel } from '../../other/';

export const leaderboard: MoustacheCommand = {
    execute: async (msg) => {
        const data = await PointsModel.find({}).sort('-points').limit(10);
        const fields: Object[] = [];
        const ease = bot.guilds.get('365236789855649814');
        

        data.forEach((element: any, index) => {
            const member = ease!.members.find((u: any) => u.id === element.userID);

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
        })

        const embed = {
            embed: {
                color: config.embedColor,
                fields: fields
            }
        }

        return bot.createMessage(msg.channel.id, embed);
    },
    label: 'leaderboard',
    options: {
        description: 'Shows the point leaderboard.',
        fullDescription: 'Shows the top 10 users with the most points.',
        usage: ''
    }
}