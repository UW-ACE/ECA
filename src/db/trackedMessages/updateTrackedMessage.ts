import trackedmessageSchema from "../../Schemas/trackedmessage";
import type { Snowflake } from "discord.js";

export default async function updateTrackedMessage(name: string, newid: Snowflake): Promise<boolean> {
  let trackedmessageEntry: any;

  try {
    trackedmessageEntry = await trackedmessageSchema.findOne({ name });
  } catch (e) {
    console.error(e);
  }

  if (trackedmessageEntry) {
    try {
      await trackedmessageSchema.updateOne({}, { name, id: newid });
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  try {
    await new trackedmessageSchema({ name, id: newid }).save();
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
}
