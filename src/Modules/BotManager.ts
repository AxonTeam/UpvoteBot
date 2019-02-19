import { BotModel } from '../other';

class BotManager {
    get(guildID: string) {
        const bot = BotModel.findOne({guildID});

        if (!bot) {
        }
    }
}