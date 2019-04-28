import { botProfileOptions, botProfileModel } from '../other';
import { Document } from 'mongoose';
import { Message } from 'eris';

/*
    Need to collect some thoughts hereeee
    bots are always linked to a specific guild
    the guild owner sets a botID to track with u!settings
    you will never change settings outside of guilds
    maybe later but always with guilds as context
    (you need to be in the same guild as the bot youre tracking)

    maybe this should be named GuildProfileManager instead?

    settings can be easily changed by specifing a setting in a string param
    change(setting: string)
    later: { [setting]: true }
    tho it doesnt allow multiple settings to be changed at once
    (not possible anyway due to u!settings proposal 2)

    Dont forget to add lean document functionality in case the express api thingy gets public
*/

class BotProfileManagerClass {
    public options: string[];

    constructor() {
        this.options = Object.keys(botProfileOptions);
    }

    public async get(guildID: string) {
        const botProfile = await botProfileModel.findOne({guildID});

        return botProfile;
    }

    public async create(guildID: string) {
        const botProfile = new botProfileModel({
            guildID,
            botID: '',
            authentication: '',
            roleRewardID: '',
            upvoteMessageChannelID: '',
            pointName: '',
            allowedRoles: [],
            boolSettings: {
                active: false,
                roleReward: false,
                upvoteMessage: false
            }
        });

        return await botProfile.save();
    }

    public async changeValue(value: string, input: string, guildID: string) {
        const botProfile = await this.profileValidation(guildID);

        botProfile.set(value, input);
        botProfile.save()
            .then(() => true)
            .catch((e) => {
                console.log(`Failure saving botProfile:\n### value: ${value}, input: ${input}, guildID: ${guildID}`);
                console.log(e);
                return false;
            });
    }

    public async changeSetting(setting: string, input: boolean, guildID: string) {
        const botProfile = await this.profileValidation(guildID);
        const settings = botProfile.get('boolSettings', Object);

        settings[setting] = input;
        botProfile.set('boolSettings', settings);
        botProfile.save()
            .then(() => true)
            .catch((e) => {
                console.log(`Failure saving botProfile:\n### setting: ${setting}, input: ${input}, guildID: ${guildID}`);
                console.log(e);
                return false;
            });
    }

    public async roleValidation(msg: Message, botProfile: Document) {
        if (!msg.member) {
            throw new Error('BotProfileManagerClass.roleValidation() used outside a guild');
        }

        const allowedRoles: string[] = botProfile.get('allowedRoles', Array);
        const memberRoles = msg.member.roles;

        return allowedRoles.some((role) => {
            return memberRoles.includes(role);
        });
    }

    private async profileValidation(guildID: string) {
        const botProfile = await this.get(guildID);

        if (!botProfile) {
            throw new Error('No profile found for guildID');
        }

        return botProfile;
    }
}

export const BotProfileManager = new BotProfileManagerClass();
