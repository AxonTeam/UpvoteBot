import { Upvote, Reminder, bot } from '../';
import { MoustacheCommand } from './';

const subUpvote: MoustacheCommand = {
    execute: async (msg) => {
        if (!msg.member) {
            return 'This command can only be executed in a guild.';
        }

        const set = await Upvote.setReminder(msg.member, true);

        if (set) {
                return 'I will remind you to upvote in 12 hours.';
        } else {
            return 'You already have an upvote reminder set.';
        }
    },
    label: 'upvote',
    options: {
        description: 'Set an upvote reminder.',
        fullDescription: 'Set a reminder to upvote a bot. Which bot depends on the guild you use the command in. You can\'t set multiple reminders for the same bot.',
        usage: ''
    }
};

const subRemoveAll: MoustacheCommand = {
    execute: async (msg) => {
        await Reminder.removeAll(msg.author.id);

        return 'All for you set reminders have been removed.';
    },
    label: 'removeAll',
    options: {
        description: 'Removes all for you set reminders. **This can\'t be undone.**',
        fullDescription: 'Removes all for you set reminders. **This cannot be undone.**',
        usage: ''
    }
};

export const reminder: MoustacheCommand = {
    execute: async () => {
        return 'See m!help reminder for all commands.';
    },
    label: 'reminder',
    options: {
        description: 'Everything related to reminders.',
        fullDescription: '',
        usage: '',
    },
    subcommands: [subRemoveAll, subUpvote]
};
