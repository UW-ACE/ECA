import birthdaySchema from "../../Schemas/birthday";
import type { Snowflake } from "discord.js";

export async function updateBirthdayByID(userid: Snowflake, month: number, day: number): Promise<void> {
  try {
    await birthdaySchema.updateOne(
      { userid },
      {
        month,
        day,
      }
    );
    console.log(`[LOG] Updated birthday for user ${userid} to ${month}/${day}`);
  } catch (e) {
    console.log(`[ERROR] Updating birthday for user ${userid} to ${month}/${day} failed`);
    console.error(e);
  }
}
