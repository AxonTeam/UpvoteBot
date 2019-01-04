import { MoustacheCommand } from './';
import { bot, Transactions } from '../';
import { PointsModel } from '../../other/';

const subPointsChange: MoustacheCommand = {
    execute: async (msg, args) => {
        const [ userID, amount ] = args;
        let userPoints;

        if (!userID || !amount) {
            return 'Not enough arguments.';
        } else if (!+amount) {
            return 'Amount is not a number.';
        }

        if (+amount < 0) {
            userPoints = await Transactions.substract(userID, +amount, 'Changed by a ruler');
        } else {
            userPoints = await Transactions.add(userID, +amount, 'Changed by a ruler');
        }

        if (!userPoints) {
            return 'This action would result in negative points and has been aborted.'
        }

        return `<@${userID}>'s points are now at ${userPoints}.`;
    },
    label: 'pointsChange',
    options: {
        description: '*Ruler only* Changes points by given amount.',
        fullDescription: '*Ruler only*\nIncrements or decrements the points of the given user by given amount.',
        usage: '`userID` `amount`',
        requirements: {
            roleIDs: ['378293035852890124'],
        }
    }
}

export const points: MoustacheCommand = {
    execute: async (msg, args) => {
        const data = await PointsModel.find({ userID: args[0]});
        const ease = bot.guilds.get('365236789855649814');
        const member = ease!.members.find((u: any) => u.id === args[0]);
        let string = `${member.user.username}#${member.discriminator} currently has ${(data as any).points} points.`
        
        if (!data) {
            return 'That user could not be found.';
        } else if (!member) {
            string = `???: ${args[0]} currently has ${(data as any).points} points.`
        }

        return bot.createMessage(msg.channel.id, string);
    },
    label: 'points',
    options: {
        description: 'Shows how many points a user currently has.',
        fullDescription: 'Shows how many points a user currently has.',
        usage: '`userID`'
    },
    subcommands: [subPointsChange]
}
