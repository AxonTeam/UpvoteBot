import { daily } from './daily';
import { evalCmd } from './eval';
import { leaderboard } from './leaderboard';
import { points } from './points';
import { reminder } from './reminder';
import { ping } from './ping';

import { Message, CommandOptions } from 'eris';

export const commands: MoustacheCommand[] = [
    daily,
    evalCmd,
    reminder,
    leaderboard,
    points,
    ping
];

export interface MoustacheCommand {
    execute: (msg: Message, args: string[]) => Promise<string | Message>;
    label: string;
    options: MoustacheCommandOptions;
    subcommands?: MoustacheCommand[];
}

interface MoustacheCommandOptions extends CommandOptions {
    description: string,
    fullDescription: string,
    usage: string,
}