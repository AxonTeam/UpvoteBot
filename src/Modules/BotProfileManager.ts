import { botProfileOptions, boolOptions, botProfileModel } from '../other';
import { Document } from 'mongoose';
import { Message } from 'eris';

class BotProfileManagerClass {
    public valueOptions: string[];
    public booleanOptions: string[];
    private profileCache: Map<string, Document>; // Cached profiles for settings
    private botToGuildCache: Map<string, string>; // Cached profiles for upvotes

    /**
     * Creates an instance of BotProfileManagerClass.
     * @memberof BotProfileManagerClass
     * @param {string[]} valueOptions - All possible value options
     * @param {string[]} booleanOptions - All possible boolean options
     * @param {Map<string, Document>} profileCache - Stores recently changed profiles
     * @param {Map<string, string>} botToGuildCache - Maps botIDs to guildIDs
     */
    constructor() {
        this.valueOptions = Object.keys(botProfileOptions);
        this.booleanOptions = Object.keys(boolOptions);
        this.profileCache = new Map();
        this.botToGuildCache = new Map();
    }

    /**
     * Creates a profile and stores it in the profileCache
     *
     * @param {string} guildID
     * @returns {Document} The created profile
     * @memberof BotProfileManagerClass
     */
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

        this.profileCache.set(guildID, botProfile);
        return await botProfile.save();
    }

    /**
     * Gets a profile with the given guildID, stores it in profileCache if it isnt already
     *
     * @param {string} guildID
     * @returns {Document} The profile
     * @memberof BotProfileManagerClass
     */
    public async getProfile(guildID: string) {
        let botProfile;

        if (this.profileCache.has(guildID)) {
            botProfile = this.profileCache.get(guildID);
        } else {
            botProfile = await botProfileModel.findOne({guildID});
        }

        if (!botProfile) {
            botProfile = await this.createProfile(guildID);
        } else {
            this.profileCache.set(guildID, botProfile);
            this.botToGuildCache.set(botProfile.get('botID'), guildID);
        }

        return botProfile;
    }

    /**
     * Gets a profile through a botID if mapped in botToGuildCache, used for upvotes
     *
     * @param {string} botID
     * @returns {Document} The profile
     * @memberof BotProfileManagerClass
     */
    public async getProfileThroughBotID(botID: string) {
        const guildID = this.botToGuildCache.get(botID);

        if (!guildID) {
            throw new Error('No guildID entry for botID ' + botID + 'in botToGuildCache');
        }

        return await this.getProfile(guildID);
    }

    /**
     * Changes a value setting in a profile to the input
     *
     * @param {string} value The option that should be changed
     * @param {(string | string[])} input The string that value should be set to (string array only for allowedRoles, logic inside setting command)
     * @param {string} guildID The guildID of the profile that should be changed
     * @returns {boolean} True if successful, false if not
     * @memberof BotProfileManagerClass
     */
    public async setValue(value: string, input: string | string[], guildID: string) {
        const botProfile = await this.getProfile(guildID);
        let saved = false;

        botProfile.set(value, input);
        botProfile.save()
            .then(() => {
                this.profileCache.set(guildID, botProfile);
                this.botToGuildCache.set(botProfile.get('botID'), guildID);
                saved = true;
            })
            .catch((e: any) => {
                console.log(`Failure saving botProfile:\n### value: ${value}, input: ${input}, guildID: ${guildID}`);
                console.log(e);
                saved = false;
            });
        return saved;
    }

    /**
     * Changes a boolean setting in a profile to the input
     *
     * @param {string} setting The option that should be changed
     * @param {boolean} input The boolean that setting should be set to
     * @param {string} guildID The guildID of the profile that should be changed
     * @returns {boolean} True if successful, false if not
     * @memberof BotProfileManagerClass
     */
    public async setBool(setting: string, input: boolean, guildID: string) {
        const botProfile = await this.getProfile(guildID);
        const bools = botProfile.get('boolOptions', Object);
        let saved = false;

        bools[setting] = input;
        botProfile.set('boolOptions', bools);
        botProfile.save()
            .then(() => {
                this.profileCache.set(guildID, botProfile);
                this.botToGuildCache.set(botProfile.get('botID'), guildID);
                saved = true;
            })
            .catch((e: any) => {
                console.log(`Failure saving botProfile:\n### setting: ${setting}, input: ${input}, guildID: ${guildID}`);
                console.log(e);
                saved = false;
            });
        return saved;
    }

    /**
     * Checks if the roles of a user allows them to change settings
     *
     * @param {Message} msg
     * @param {Document} botProfile
     * @returns {boolean} True if the user has at least one allowed role
     * @memberof BotProfileManagerClass
     */
    public validateRoles(msg: Message, botProfile: Document) {
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
