import { Member } from 'eris';
import { Request } from 'express';
import { bot, Reminder, getSuperb } from './';

/**
 * Handles everything related to upvotes.
 *
 * @class UpvoteClass
 */
/*
class UpvoteClass {

    public async handle(req: Request) {
        console.log(`[upvote] Upvote recieved! Searching for ${req.body.user}...`);

        const ease = bot.guilds.get('365236789855649814');
        const upvoter: Member | undefined = ease!.members.find((u: any) => u.id === req.body.user);

        if (!upvoter) {
            // The upvoter is not on the server
            console.log(`[upvote] ${req.body.user} not found.`);
            bot.createMessage(config.upvoterChannel, `Someone upvoted on DBL! But they aren't on the server to recieve their perks...`);
        } else {
            // The upvoter is on the server
            upvoter.addRole(config.upvoterRole, 'Upvote on DBL');

            const reminder = await this.setReminder(upvoter, false);

            if (reminder) {
                this.sendUpvoteMessage(upvoter, req.body.isWeekend);
            } else {
                console.log('[upvote] Already has a reminder set.')
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

    private async sendUpvoteMessage(upvoter: Member, isWeekend: boolean) {
        let msg: string = '';

        if (isWeekend) {
               const points = await Transactions.add(upvoter.id, 2, 'Upvote on DBL (Voting Multiplier).');
                msg = `${getSuperb()}, <@${upvoter.id}> has upvoted on DBL during an active voting multiplier! Points: ${points}`;
            } else {
                const points = await Transactions.add(upvoter.id, 1, 'Upvote on DBL.');
                msg = `${getSuperb()}, <@${upvoter.id}> has upvoted on DBL! Points: ${points}`;
            }

        console.log('[upvote] Sending message to #upvote-army.');
        bot.createMessage(config.upvoterChannel, msg);
    }
}

export const Upvote = new UpvoteClass();
*/
