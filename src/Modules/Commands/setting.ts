import { BotProfileManager } from '..';
import { MoustacheCommand } from '.';
import { TextChannel } from 'eris';

const setting: MoustacheCommand = {
    execute: async (msg, args) => {
        const botProfile = await BotProfileManager.getProfile((msg.channel as TextChannel).guild.id);

        if (!botProfile) {
            console.log('BotProfile not found? GuildID: ' + (msg.channel as TextChannel).guild.id);
            return 'BotProfile not found, shouldn\'t this be impossible?';
        }
    },
    label: 'setting',
    options: {
        description: 'See the current state of an option. (See u!help settings)',
        fullDescription: 'uwu i dwidnt implwemwent this pwath wyet ono',
        usage: '',
        aliases: ['s']
    }
}

export const changeSetting: MoustacheCommand = {
    execute: async (msg, args) => {
        // args = -v pointName fucks
        const valueMode = determValueMode(args[0]); // true if "-v" or "--value", false if "-s" or "--setting"
        const option = args[1]; // pointName
        const text = args[2]; // fucks

        if (typeof valueMode === null) {
            return 'Invalid usage, use either `--value () (value)` or `--setting (setting)`.';
        }

        if (valueMode) {
            const botProfile = await BotProfileManager.getProfile((msg.channel as TextChannel).guild.id);
            const validOption = BotProfileManager.valueOptions.includes(option);

            if (!botProfile) {
                console.log('BotProfile not found? GuildID: ' + (msg.channel as TextChannel).guild.id);
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

                const saved = BotProfileManager.setValue(option, allowedRoles, (msg.channel as TextChannel).guild.id);

                if (saved) {
                    return `**${text}** is now allowed to change options.`;
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

                const saved = BotProfileManager.setValue(option, allowedRoles, (msg.channel as TextChannel).guild.id);

                if (saved) {
                    return `**${text}** is not allowed to change options anymore.`;
                } else {
                    return 'Something went wrong. The setting hasn\'t been changed.';
                }
            } else {
                const saved = BotProfileManager.setValue(option, text, (msg.channel as TextChannel).guild.id);

                if (saved) {
                    return `**${option}** has been set to **${text}**.`;
                } else {
                    return 'Something went wrong. The setting hasn\'t been changed.';
                }
            }
        } else {
            // settingOption bleh
        }
    },
    label: '--change',
    subcommands: [],
    options: {
        description: 'Changes settings. (See u!help settings)',
        fullDescription: 'uwu i dwidnt implwemwent this pwath wyet ono',
        usage: '',
        aliases: ['-c']
    }
};

// Determing wether a value or a setting is getting changed
function determValueMode(arg: string) {
    let valueMode;

    switch (arg) {
        case '-v':
        case '--value':
            valueMode = true;
            break;

        case '-s':
        case '--setting':
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
