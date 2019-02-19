import { Upvote, Reminder, bot } from '../index';
import { MoustacheCommand } from './index';

const subOptout: MoustacheCommand = {
    execute: async (msg) => {
        const optedOut = await Reminder.optout(msg.author.id);

        if (optedOut) {
            return 'You opted out of moustache reminders, all reminders for you have been deleted. If you want to recieve reminders again, see `m!help`.';
        } else {
            return 'You already opted out of moustache reminders. If you want to recieve reminders again, see `m!help`.';
        }
    },
    label: 'optout',
    options: {
        description: 'Opt out of reminders.',
        fullDescription: 'Opt out of any reminders that moustache will send you. You won\'t recieve any reminders unless you opt back in.',
        usage: ''
    }
};

const subOptin: MoustacheCommand = {
    execute: async (msg) => {
        const optedIn = await Reminder.optin(msg.author.id);

        if (optedIn) {
            return 'You opted back into moustache reminders.';
        } else {
            return 'You aren\'t opted out of moustache reminders. If you don\'t want to recieve reminders, see `m!help`.';
        }
    },
    label: 'optin',
    options: {
        description: 'Opt back into reminders.',
        fullDescription: 'Opt back into moustache reminders after you opted out. You will recieve reminders again after using this command.',
        usage: ''
    }
}

const subUpvote: MoustacheCommand = {
    execute: async (msg, args) => {
        if (!msg.member) {
            return 'This command can only be executed in a server.';
        }

        const set = await Upvote.setReminder(msg.member);

        if (set) {
            return 'I will remind you to upvote in 12 hours.';
        } else {
            return 'You already have an upvote reminder set.';
        }

    },
    label: 'upvote',
    options: {
        description: 'Set an upvote reminder.',
        fullDescription: 'Set a reminder to upvote for yourself (or for a specified user if a Ruler is using the command).',
        usage: '(userID)'
    }
}

const subRemoveAll: MoustacheCommand = {
    execute: async (msg) => {
        await Reminder.removeAll(msg.author.id);

        return 'All for you set reminders have been removed.';
    },
    label: 'removeAll',
    options: {
        description: 'Removes all reminders that are set for you. **This can\'t be undone.**',
        fullDescription: 'Removes all reminders that are set for you. **This cannot be undone.**',
        usage: ''
    }
}

export const reminder: MoustacheCommand = {
    execute: async () => {
        return 'See m!help reminder for all commands.';
    },
    label: 'reminder',
    options: {
        description: 'See m!help reminder.',
        fullDescription:'Everything related to reminders. See m!help reminder.',
        usage: '',
    },
    subcommands: [subOptin, subOptout, subRemoveAll, subUpvote]
};
