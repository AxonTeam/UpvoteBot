import { Message } from "eris";
import { ReminderModel } from "../other";

export interface MoustacheReminder {
    id: string;
    userID?: string;
    triggerTime: number;
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
    private ignoredCache: Map<string, null>

    constructor() {
        this.reminderCache = new Map();
        this.ignoredCache = new Map();

        this.init()
            .catch(e => console.log(e));
    }

    /**
     * Initialises the reminder cache by looking for an already saved cache and setting all stored timeouts again.
     *
     * @private
     * @returns {Promise<void>}
     * @memberof ReminderClass
     */
    private async init(): Promise<void> {
        const savedCache = await ReminderModel.findOne({ version: 1 });
        const currentTime = new Date().getMilliseconds();

        if (!savedCache) {
            return console.log('[reminder] No saved reminder cache found!');
        } else {
            this.reminderCache = (savedCache as any).cache;
            this.ignoredCache = (savedCache as any).ignored;
        }

        this.reminderCache.forEach((value) => {
            const delay = value.triggerTime - currentTime;
            const timeout = setTimeout(async () => {
                value.execute();

                await this.removeAfterTimeout(value.id);
            }, delay);

            value.timeout = timeout;

            console.log(`[reminder] Set cached reminder ${value.id}`);
        });

        return console.log('[reminder] All cached reminders are set again.');
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

        if (userID && this.ignored(userID)) {
            return false;
        }

        const currentTime: number = new Date().getMilliseconds();

        // setTimeout using execute and delay
        const timeout = setTimeout(async () => {
            execute();

            await this.removeAfterTimeout(id);
        }, delay);

        // construct the reminder object
        const reminder: MoustacheReminder = {
            id: id,
            userID: userID,
            triggerTime: currentTime + delay,
            timeout: timeout,
            execute: execute
        };

        // add reminder to this.reminderCache
        this.reminderCache.set(id, reminder);

        // update DB
        await this.save();

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

        await this.save();
        
        return true;
    }

    /**
     * Called by a reminder to remove itself from the cache.
     *
     * @private
     * @param {string} id ID of the reminder
     * @memberof ReminderClass
     */
    private async removeAfterTimeout(id: string) {
        // Interval was already cleared at this point
        // delete from cache
        this.reminderCache.delete(id);

        // update DB
        await this.save();
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

    /**
     * Save the cache to the DB.
     *
     * @private
     * @memberof ReminderClass
     */
    private async save() {
        const cache = await ReminderModel.findOne({ version: 1 });

        if (!cache) {
            return new Error('Couldn\'t save cache to DB!');
        }

        (cache as any).cache = this.reminderCache;
        (cache as any).ignored = this.ignoredCache;

        cache.markModified('cache');
        cache.markModified('ignored');

        try {
            await cache.save();
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Check if the given userID opted out of reminders.
     *
     * @param {string} userID
     * @returns {boolean} True if they did, false if not
     * @memberof ReminderClass
     */
    public ignored(userID: string): boolean {
        return this.ignoredCache.has(userID);
    }

    /**
     * Add the given userID to the opted out list.
     *
     * @param {string} userID
     * @returns {Promise<boolean>} True if successful, false if already opted out
     * @memberof ReminderClass
     */
    public async optout(userID: string): Promise<boolean> {
        if (this.ignored(userID)) {
            return false;
        }

        this.ignoredCache.set(userID, null);
        await this.removeAll(userID);

        return true;
    }

    /**
     * Remove the given userID from the opted out list.
     *
     * @param {string} userID
     * @returns {Promise<boolean>} True if successfull, false if not opted out
     * @memberof ReminderClass
     */
    public async optin(userID: string): Promise<boolean> {
        if (!this.ignored(userID)) {
            return false;
        }

        this.ignoredCache.delete(userID);
        await this.save();

        return true;
    }
}

export const Reminder = new ReminderClass();

/* Commands TBA:
    - reminder optout (also deletes all set reminders)
    - reminder optin
    - Updated reminder add
    - Updated reminder upvote
    - reminder remove
*/