import birthdaySchema from '../Schemas/birthday';
import type { Snowflake } from 'discord.js';
import type { Document } from 'mongoose';

/**
 * Type hint for ECA DB Birthday schema objects
 */
export interface EcaUserBirthday extends Document {
  userid: Snowflake;
  month: number;
  day: number;
}

export async function getAllBirthdays(): Promise<EcaUserBirthday[]> {
  let birthdays: EcaUserBirthday[] = [] as EcaUserBirthday[];
  try {
    birthdays = await birthdaySchema.find({});
    console.log('[LOG] Birthdays (all):', birthdays);
  } catch (e) {
    console.error('[ERROR] Failed to grab all birthdays from MongoDB');
    console.error(e);
  }
  return birthdays;
}

export async function getBirthdaysByMonth(month: number): Promise<EcaUserBirthday[]> {
  let birthdays: EcaUserBirthday[] = [] as EcaUserBirthday[];
  try {
    birthdays = await birthdaySchema.find({
      month,
    });
    console.log(`[LOG] Birthdays in month ${month}:`, birthdays);
  } catch (e) {
    console.error(`[ERROR] Failed to grab birthdays in month ${month} from MongoDB`);
    console.error(e);
  }
  return birthdays;
}

export async function getBirthdaysByMonthDay(
  month: number,
  day: number
): Promise<EcaUserBirthday[]> {
  let birthdays: EcaUserBirthday[] = [] as EcaUserBirthday[];
  try {
    birthdays = await birthdaySchema.find({
      month,
      day,
    });
    console.log(`[LOG] Birthdays on date ${month}/${day}:`, birthdays);
  } catch (e) {
    console.error(`[ERROR] Failed to grab birthdays on date ${month}/${day} from MongoDB`);
    console.error(e);
  }
  return birthdays;
}

export async function getBirthdayByID(userid: Snowflake): Promise<EcaUserBirthday | null> {
  let birthday: EcaUserBirthday | null = null;
  try {
    birthday = await birthdaySchema.findOne({
      userid,
    });
    console.log(`[LOG] Birthday for user ${userid}:`, birthday);
  } catch (e) {
    console.error(`[ERROR] Failed to grab birthday for user ${userid} from MongoDB`);
    console.error(e);
  }
  return birthday;
}
