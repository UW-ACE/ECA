import trackedmessageSchema from "../../Schemas/trackedmessage";
import type { Snowflake } from "discord.js";

export default async function getTrackedMessageId(name: string): Promise<Snowflake | ""> {
  let trackedMessage: any;
  try {
    trackedMessage = await trackedmessageSchema.findOne({ name });
  } catch (e) {
    console.error(e);
  }

  return trackedMessage ? (trackedMessage.id as Snowflake) : "";
}
