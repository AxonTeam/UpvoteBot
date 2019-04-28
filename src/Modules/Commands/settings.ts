import { BotProfileManager } from '../';
import { MoustacheCommand } from './';
import { TextChannel } from 'eris';

export const settings: MoustacheCommand = {
    execute: async (msg, args) => {
        // args = -v pointName fucks
        let valueMode: boolean; // true if "-v" or "--value", false if "-s" or "--setting"
        let botProfile;
        const option = args[1]; // pointName
        const text = args[2]; // fucks
        const validOption = BotProfileManager.options.includes(option);

        if (!validOption) {
            return `Invalid usage, **${option}** is not a valid option.`;
        } else {
            botProfile = await BotProfileManager.get((msg.channel as TextChannel).guild.id);

            if (botProfile) {
                console.log('BotProfile not found? GuildID: ' + (msg.channel as TextChannel).guild.id);
                return 'BotProfile not found, shouldn\'t this be impossible?';
            }
        }

        // Determing wether a value or a setting is getting changed
        switch (args[0]) {
            case '-v':
            case '--value':
                valueMode = true;
                break;

            case '-s':
            case '--setting':
                valueMode = false;
                break;

            default:
                return 'Invalid usage, use either `--value () (value)` or `--setting (setting)`.';
        }

        if (valueMode) {
            if (option === 'addAllowedRole') {
                
            } 
        }

        // Remove allowed role
    },
    label: 'settings',
    options: {
        description: 'Changes settings. (See u!help settings)',
        fullDescription: 'uwu i dwidnt implwemwent this pwath wyet ono',
        usage: ''
    }
};

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
