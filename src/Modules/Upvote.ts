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

        if (!upvoter) {
            if (upvoteMessageChannelID) {
                bot.createMessage(upvoteMessageChannelID, `Someone upvoted on DBL! But they aren't on the server to recieve their perks...`);
            }
        } else {
            if (roleRewardID) {
                upvoter.addRole(roleRewardID, 'Upvote on DBL');
            }

            const reminder = await this.setReminder(upvoter);

            if (reminder) {
                this.sendUpvoteMessage(upvoter, req.body.isWeekend, botProfile, upvoteMessageChannelID);
            } else {
                console.log('[upvote] Already has a reminder set.');
                return;
            }
        }
    }

    public async setReminder(upvoter: Member, manual: boolean) {
        const upvoteReminder = async () => {
            try {
                const channel = await upvoter.user.getDMChannel();
                const embed = {
                    embed: {
                        author: {
                            name: 'Hello!',
                            icon_url: 'https://i.imgur.com/ta5wKEp.png',
                        },
                        description: '[You can upvote Ease again.](https://discordbots.org/bot/365879035496235008/vote)',
                        color: config.embedColor,
                        footer: {
                            text: 'This reminder was set automatically after you upvoted Ease 12h ago.'
                        }
                    },
                };

                if (manual) {
                    embed.embed.footer.text = 'This reminder was set manually by yourself or a ruler.'
                }
                return channel.createMessage(embed);
            }
            catch (e) {
                console.log(e);
            }
        };

        return await Reminder.add(`upvote:${upvoter.id}`, 43200000, upvoteReminder, upvoter.id);
    }

    private async sendUpvoteMessage(upvoter: Member, botProfile: Document, isWeekend: boolean, upvoteMessageChannelID: string) {
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
