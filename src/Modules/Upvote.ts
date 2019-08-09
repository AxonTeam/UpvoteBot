import { Member } from 'eris';
import { Request } from 'express';
import { bot, Reminder, getSuperb, Points } from './';
import { Document } from 'mongoose';

/**
 * Handles everything related to upvotes.
 *
 * @class UpvoteClass
 */

class UpvoteClass {
    public async handle(req: Request, botProfile: Document) {
        const guild = bot.guilds.get(botProfile.get('guildID'));
        const upvoteMessageChannelID = botProfile.get('upvoteMessageChannelID');
        const roleRewardID = botProfile.get('roleRewardID');

        if (!guild) {
            return;
        }

        const upvoter: Member | undefined = guild!.members.find((u: any) => u.id === req.body.user);

        if (upvoteMessageChannelID) {
            if (req.body.type === 'test') {
                return bot.createMessage(upvoteMessageChannelID, `This is a test!${roleRewardID ? ' The upvoter should have gotten a role reward.' : ''}`);
            }

            if (!upvoter) {
                bot.createMessage(upvoteMessageChannelID, `Someone upvoted on DBL! But they aren't on the server to recieve their perks...`);
            } else {
                if (roleRewardID) {
                    upvoter.addRole(roleRewardID, 'Upvote on DBL');
                }

                const reminder = await this.setReminder(upvoter, botProfile);

                if (reminder) {
                    this.sendUpvoteMessage(upvoter, req.body.isWeekend, botProfile, upvoteMessageChannelID);
                } else {
                    console.log('[upvote] Already has a reminder set.');
                    return;
                }
            }
        }

    }

    public async setReminder(upvoter: Member, botProfile: Document) {
        const botID = botProfile.get('botID');
        const upvoteReminder = async () => {
            try {
                const channel = await upvoter.user.getDMChannel();
                const embed = {
                    embed: {
                        author: {
                            name: 'Hello!',
                            icon_url: 'https://i.imgur.com/ta5wKEp.png',
                        },
                        description: `You can upvote <@}${botID}> again.\n\n[Vote](https://discordbots.org/bot/${botID}/vote)`,
                        footer: {
                            text: 'This reminder was set automatically after you upvoted that bot 12 hours ago.'
                        }
                    },
                };

                return channel.createMessage(embed);
            } catch (e) {
                console.log(e);
            }
        };

        return await Reminder.add(`upvote:${upvoter.id}:${botID}`, 43200000, upvoteReminder, upvoter.id);
    }

    private async sendUpvoteMessage(upvoter: Member, isWeekend: boolean, botProfile: Document, upvoteMessageChannelID: string) {
        const pointProfile = await Points.find(upvoter.id, botProfile.get('guildID'));
        let msg: string;

        if (isWeekend) {
            const points = await Points.change(pointProfile, 2);
            msg = `${getSuperb()}, <@${upvoter.id}> upvoted <@${botProfile.get('botID')}> on DBL during an active voting multiplier! ${botProfile.get('pointName')} ${points}`;
        } else {
            const points = await Points.change(pointProfile, 1);
            msg = `${getSuperb()}, <@${upvoter.id}> upvoted <@${botProfile.get('botID')}> on DBL! ${botProfile.get('pointName')}: ${points}`;
        }

        bot.createMessage(upvoteMessageChannelID, msg);
    }
}

export const Upvote = new UpvoteClass();
