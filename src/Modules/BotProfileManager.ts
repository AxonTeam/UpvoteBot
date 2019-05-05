import { botProfileOptions, boolOptions, botProfileModel } from '../other';
import { Document } from 'mongoose';
import { Message } from 'eris';

/*
    Need to collect some thoughts hereeee

    maybe this should be named GuildProfileManager instead?

    Dont forget to add lean document functionality in case the express api thingy gets public
*/

class BotProfileManagerClass {
    public valueOptions: string[];
    public booleanOptions: string[];
    private optionCache: Map<string, Document>; // Cached profiles for settings
    private botToGuildCache: Map<string, string>; // Cached profiles for upvotes

    constructor() {
        this.valueOptions = Object.keys(botProfileOptions);
        this.booleanOptions = Object.keys(boolOptions);
        this.optionCache = new Map();
        this.botToGuildCache = new Map();
    }

    public async createProfile(guildID: string) {
        const botProfile = new botProfileModel({
            guildID,
            botID: '',
            authorization: '',
            roleRewardID: '',
            upvoteMessageChannelID: '',
            pointName: 'Points',
            allowedRoles: [],
            boolOptions: {
                active: false,
                roleReward: false,
                upvoteMessage: false
            }
        });

        return await botProfile.save();
    }

    public async getProfile(guildID: string) {
        let botProfile: Document | undefined | null;

        if (this.optionCache.has(guildID)) {
            botProfile = this.optionCache.get(guildID);
        } else {
            botProfile = await botProfileModel.findOne({guildID});
        }

        if (!botProfile) {
            throw new Error('No profile found for guildID');
        } else {
            this.optionCache.set(guildID, botProfile);
            this.botToGuildCache.set(botProfile.get('botID'), guildID);
        }

        return botProfile;
    }

    public async getProfileThroughBotID(botID: string) {
        const guildID = this.botToGuildCache.get(botID);

        if (!guildID) {
            throw new Error('No guildID entry for botID ' + botID + 'in botToGuildCache');
        }

        return await this.getProfile(guildID);
    }

    public async setValue(value: string, input: string | string[], guildID: string) {
        const botProfile = await this.getProfile(guildID);
        let saved = false;

        botProfile.set(value, input);
        botProfile.save()
            .then(() => {
                this.optionCache.set(guildID, botProfile);
                this.botToGuildCache.set(botProfile.get('botID'), guildID);
                saved = true;
            })
            .catch((e) => {
                console.log(`Failure saving botProfile:\n### value: ${value}, input: ${input}, guildID: ${guildID}`);
                console.log(e);
                saved = false;
            });
        return saved;
    }

    public async setSetting(setting: string, input: boolean, guildID: string) {
        const botProfile = await this.getProfile(guildID);
        const settings = botProfile.get('boolOptions', Object);
        let saved = false;

        settings[setting] = input;
        botProfile.set('boolOptions', settings);
        botProfile.save()
            .then(() => {
                this.optionCache.set(guildID, botProfile);
                this.botToGuildCache.set(botProfile.get('botID'), guildID);
                saved = true;
            })
            .catch((e) => {
                console.log(`Failure saving botProfile:\n### setting: ${setting}, input: ${input}, guildID: ${guildID}`);
                console.log(e);
                saved = false;
            });
        return saved;
    }

    public async validateRoles(msg: Message, botProfile: Document) {
        if (!msg.member) {
            throw new Error('BotProfileManagerClass.validateRoles() used outside a guild');
        }

        const allowedRoles: string[] = botProfile.get('allowedRoles', Array);
        const memberRoles = msg.member.roles;

        return allowedRoles.some((role) => {
            return memberRoles.includes(role);
        });
    }
}

export const BotProfileManager = new BotProfileManagerClass();
