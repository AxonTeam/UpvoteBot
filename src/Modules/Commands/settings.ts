import { MoustacheCommand } from './index';

export const settings: MoustacheCommand = {
    execute: async (msg) => {
        return 'hi';
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
        3. Edits
            -> Shows recent edits
            -> Back reaction

    Proposal 2:
    - CLI style quick settings
    - Quicker and easier to develop because all settings dont have spaces,
      so inputs can be easier tracked
    - -v or --value (value e.g. pointName) (text e.g. fucks)
        -> Changes the setting
    - -s or --setting (setting e.g. active)
        -> Enables/Disables specified setting
    - -e or --edits (still sends an embed with recent edits)

    i personally liek 2 more
*/