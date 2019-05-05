import { botProfileOptions, boolOptions, botProfileModel } from '../other';
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

    Dont forget to add lean document functionality in case the express api thingy gets public

    issue on github: allow getting a profile through botID for eval cases
*/

class BotProfileManagerClass {
    public valueOptions: string[];
    public booleanOptions: string[]; // That sounds so dumb omg
    private cache: Map<string, Document>;

    constructor() {
        this.valueOptions = Object.keys(botProfileOptions);
        this.booleanOptions = Object.keys(boolOptions);
        this.cache = new Map();
    }

    public async createProfile(guildID: string) {
        const botProfile = new botProfileModel({
            guildID,
            botID: '',
            authentication: '',
            roleRewardID: '',
            upvoteMessageChannelID: '',
            pointName: '',
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

        if (this.cache.has(guildID)) {
            botProfile = this.cache.get(guildID);
        } else {
            botProfile = await botProfileModel.findOne({guildID});
        }

        if (!botProfile) {
            throw new Error('No profile found for guildID');
        } else {
            this.cache.set(guildID, botProfile);
        }

        return botProfile;
    }

    public async setValue(value: string, input: string | string[], guildID: string) {
        const botProfile = await this.getProfile(guildID);
        let saved = false;

        botProfile.set(value, input);
        botProfile.save()
            .then(() => {
                this.cache.set(guildID, botProfile);
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
                this.cache.set(guildID, botProfile);
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
