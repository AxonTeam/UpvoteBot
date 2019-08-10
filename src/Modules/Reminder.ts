import { Message } from 'eris';

export interface MoustacheReminder {
    id: string;
    userID?: string;
    timeout: any; // Actually Timeout, but that type doesn't seem to exist...
    execute: (msg?: Message, args?: string[]) => void;
}

/**
 * Handles reminders.
 *
 * @class ReminderClass
 */
class ReminderClass {
    private reminderCache: Map<string, MoustacheReminder>;

    constructor() {
        this.reminderCache = new Map();
    }

    /**
     * Adds a reminder. Doesn't work if there is already a reminder with the given ID.
     *
     * @param {string} id ID of the reminder
     * @param {number} delay The amount of time to wait until execute gets triggered (in ms)
     * @param {() => void} execute Function to execute after the delay
     * @param {string} [userID] Associate a userID to the reminder (Optional)
     * @returns {Promise<boolean>} True if successfully added, false if there already is a reminder with the same ID or associated userID is opted out.
     * @memberof ReminderClass
     */
    public async add(id: string, delay: number, execute: () => void, userID?: string): Promise<boolean> {
        // Don't set multiple reminders with the same ID
        if (this.reminderCache.has(id)) {
            return false;
        }

        // setTimeout using execute and delay
        const timeout = setTimeout(async () => {
            console.log('[reminder] Executing reminder ' + id);
            execute();

            this.reminderCache.delete(id);
        }, delay);

        // construct the reminder object
        const reminder: MoustacheReminder = {
            id,
            userID,
            timeout,
            execute
        };

        // add reminder to this.reminderCache
        this.reminderCache.set(id, reminder);

        console.log(`[reminder] Set reminder ${id}`);
        return true;
    }

    /**
     * Manually remove a reminder.
     *
     * @param {string} id ID of the reminder
     * @returns {Promise<boolean | null>} True if successfully removed, null if the reminder wasn't found
     * @memberof ReminderClass
     */
    public async remove(id: string): Promise<boolean | null> {
        const reminder = this.reminderCache.get(id);

        if (!reminder) {
            return null;
        }

        clearTimeout(reminder.timeout);

        this.reminderCache.delete(id);

        return true;
    }

    /**
     * Remove all reminders that are associated with the given userID.
     *
     * @param {string} userID
     * @memberof ReminderClass
     */
    public async removeAll(userID: string) {
        this.reminderCache.forEach(async (value) => {
            if (value.userID === userID) {
                await this.remove(value.id);
            }
        });
    }
}

export const Reminder = new ReminderClass();
