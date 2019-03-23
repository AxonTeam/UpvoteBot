import { MoustacheCommand } from './';
import { bot, Points } from '../';
import { PointsModel } from '../../other/';

const subPointsChange: MoustacheCommand = {
    execute: async (msg, args) => {
        const [ userID, guildID, amount ] = args;
        let userPoints;

        if (!userID || !amount) {
            return 'Not enough arguments.';
        } else if (!+amount) {
            return 'Amount is not a number.';
        }

        userPoints = await Points.change(userID, guildID, +amount, false);

        if (userPoints === false) {
            return 'This action would result in negative points and has been aborted.';
        } else if (userPoints === null) {
            return 'Something went wrong. Make sure you used the right userID and guildID.';
        }

        return `<@${userID}>'s points are now at ${userPoints}.`;
    },
    label: 'pointsChange',
    options: {
        description: 'Changes points by given amount.',
        fullDescription: 'Increments or decrements the points of the given user by given amount.',
        usage: '`userID` `amount`',
        requirements: {
            roleIDs: ['378293035852890124'],
        }
    }
};

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
    }// ,
    // subcommands: [subPointsChange] Should not be used since points should not be changed
};
