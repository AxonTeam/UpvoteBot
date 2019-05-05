import { BotProfileManager } from '..';
import { MoustacheCommand } from '.';
import { TextChannel } from 'eris';

const settingDescription = 'The setting commands are built like a CLI.\\\
\nUsage: e!setting [--change] {--value | --boolean} option [input if --value]\\\
\n-c, -v, and -b are shorthands for --change, --value and --boolean. input is only required when changing a value.\\\
\n\nValue settings require a string as input.\\\
\n`botID` - The ID of the bot whose upvotes should be tracked. (Required)\\\
\n`authorization` - The authorization string that upvotes need. It must be the same in your DBL webhook settings. (Required)\\\
\n`roleRewardID` - The ID of a role that should be given to upvoters.\\\
\n`upvoteMessageChannelID` - The ID of the channel in which upvote messages should be sent.\\\
\n`pointName` - What points in upvote message should be called. "Points" by default.\\\
\n`addAllowedRole` - Add a role that is allowed to change these settings.\\\
\n`removeAllowedRole` - Removes a role from the allowed list again.\\\
\n\nBoolean options can only be either true or false (false by default). They will be changed to the opposite when you use --change.\\\
\n`active` - Whether the bot should track upvotes or not.\\\
\n`roleReward` - If a role should be given to upvoters.\\\
\n`upvoteMessage` - If the bot should send upvote messages.';

const changeSetting: MoustacheCommand = {
    execute: async (msg, args) => {
        // args = -v pointName fucks
        const valueMode = determValueMode(args[0]); // true if "-v" or "--value", false if "-b" or "--boolean"
        const option = args[1]; // pointName
        const text = args[2]; // fucks
        const guildID = (msg.channel as TextChannel).guild.id;

        if (typeof valueMode === null) {
            return 'Invalid usage, use either `--change --value option input` or `--change --boolean option`.';
        }

        if (valueMode) {
            const botProfile = await BotProfileManager.getProfile(guildID);
            const validOption = BotProfileManager.valueOptions.includes(option);

            if (!botProfile) {
                console.log('BotProfile not found? GuildID: ' + guildID);
                return 'BotProfile not found, shouldn\'t this be impossible?';
            }

            if (!validOption) {
                return `Invalid usage, **${option}** is not a valid option.`;
            }

            if (!BotProfileManager.validateRoles(msg, botProfile)) {
                return 'You\'re not allowed to change settings.';
            }

            if (option === 'addAllowedRole') {
                const allowedRoles: string[] = botProfile.get('allowedRoles', Array);

                if (!(msg.channel as TextChannel).guild.roles.has(text)) {
                    return 'That role does not exist.';
                }

                if (allowedRoles.includes(text)) {
                    return 'That role is already allowed to change settings.';
                } else {
                    allowedRoles.push(text);
                }

                const saved = BotProfileManager.setValue(option, allowedRoles, guildID);

                if (saved) {
                    return `**${text}** is now allowed to change settings.`;
                } else {
                    return 'Something went wrong. The setting hasn\'t been changed.';
                }
            } else if (option === 'removeAllowedRole') {
                const allowedRoles: string[] = botProfile.get('allowedRoles', Array);

                if (!allowedRoles.includes(text)) {
                    return 'That role is already not allowed to change settings.';
                } else {
                    const index = allowedRoles.indexOf(text);
                    allowedRoles.slice(index, index + 1);
                }

                const saved = BotProfileManager.setValue(option, allowedRoles, guildID);

                if (saved) {
                    return `**${text}** is not allowed to change settings anymore.`;
                } else {
                    return 'Something went wrong. The setting hasn\'t been changed.';
                }
            } else {
                const saved = BotProfileManager.setValue(option, text, guildID);

                if (saved) {
                    return `**${option}** has been set to **${text}**.`;
                } else {
                    return 'Something went wrong. The setting hasn\'t been changed.';
                }
            }
        } else {
            const botProfile = await BotProfileManager.getProfile(guildID);
            const validOption = BotProfileManager.booleanOptions.includes(option);
            const currentOption: boolean = botProfile.get('boolOptions')[option];

            if (!botProfile) {
                console.log('BotProfile not found? GuildID: ' + guildID);
                return 'BotProfile not found, shouldn\'t this be impossible?';
            }

            if (!validOption) {
                return `Invalid usage, **${option}** is not a valid option.`;
            }

            if (!BotProfileManager.validateRoles(msg, botProfile)) {
                return 'You\'re not allowed to change settings.';
            }

            const saved = BotProfileManager.setSetting(option, !currentOption, guildID);

            if (saved) {
                return `**${option}** has been set to **${!currentOption}**.`;
            } else {
                return 'Something went wrong. The setting hasn\'t been changed.';
            }
        }
    },
    label: '--change',
    options: {
        description: 'Changes settings. (See u!help setting)',
        fullDescription: settingDescription,
        usage: '',
        aliases: ['-c']
    }
};

export const setting: MoustacheCommand = {
    execute: async (msg, args) => {
        const guildID = (msg.channel as TextChannel).guild.id;
        const valueMode = determValueMode(args[0]); // true if "-v" or "--value", false if "-s" or "--boolean"
        const option = args[1];
        const botProfile = await BotProfileManager.getProfile(guildID);

        if (!botProfile) {
            console.log('BotProfile not found? GuildID: ' + guildID);
            return 'BotProfile not found, shouldn\'t this be impossible?';
        }

        if (typeof valueMode === null) {
            return 'Invalid usage, use either `--value option` or `--boolean option`.';
        }

        if (!BotProfileManager.validateRoles(msg, botProfile)) {
            return 'You\'re not allowed to change settings.';
        }

        if (valueMode) {
            const validOption = BotProfileManager.valueOptions.includes(option);

            if (!validOption) {
                return `Invalid usage, **${option}** is not a valid option.`;
            }

            const currentOption = botProfile.get(option);

            return `**${option}** is currently set to **${currentOption}**.`;
        } else {
            const validOption = BotProfileManager.booleanOptions.includes(option);

            if (!validOption) {
                return `Invalid usage, **${option}** is not a valid option.`;
            }

            const currentOption = botProfile.get('boolOptions')[option];

            return `**${option}** is currently set to **${currentOption}**.`;
        }
    },
    label: 'setting',
    subcommands: [changeSetting],
    options: {
        description: 'See the current state of a setting. (See u!help setting)',
        fullDescription: settingDescription,
        usage: '',
        aliases: ['s']
    }
}

// Determing wether a value or a setting is getting changed
function determValueMode(arg: string) {
    let valueMode;

    switch (arg) {
        case '-v':
        case '--value':
            valueMode = true;
            break;

        case '-b':
        case '--boolean':
            valueMode = false;
            break;

        default:
            valueMode = null;
    }

    return valueMode;
}

/*
    Proposal 1:
    - Show if upvotes are enabled/disabled in an embed
    - Can only be used in guilds?
    - Expires after a minute without any input
    - Reaction menu (see bot schema!)
        -> u!settings first embed
        1. Values
            -> Reaction triggers input
            -> Show if already set or not
            -> Back reaction
            1. botID
            2. authentication (should only be used in dms?)
            3. roleRewardID
            4. upvoteMessageChannelID
            5. pointName (reset button!)
        2. Settings
            -> Back reaction
            -> Each has a "Back" and "Disable/Enable" reaction
            1. active
            2. roleReward
            3. upvoteMessage

    Proposal 2:
    - CLI style quick settings
    - Quicker and easier to develop because all settings dont have spaces,
      so inputs can be easier tracked
    - -v or --value (value e.g. pointName) (text e.g. fucks)
        -> Changes the setting
    - -s or --setting (setting e.g. active)
        -> Enables/Disables specified setting

    i personally liek 2 more
*/
