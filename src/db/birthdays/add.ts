import birthdaySchema from '../Schemas/birthday';
import type { Snowflake } from 'discord.js';

/**
 * Add a birthday entry for a user.
 * @param userid Discord user id (Snowflake)
 * @param month month number (1-12)
 * @param day day number
 */
export async function addBirthday(userid: Snowflake, month: number, day: number): Promise<void> {
  try {
    await new birthdaySchema({
      userid,
      month,
      day,
    }).save();
    console.log(`[LOG] Added birthday for user ${userid} on ${month}/${day}`);
  } catch (e) {
    console.error('[ERROR] Failed to add birthday to MongoDB');
    console.error(e);
  }
}
