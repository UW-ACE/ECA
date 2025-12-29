import aceOffSchema from "../Schemas/ace-offs";

/**
 * Update or create the ace-off message entry in the DB.
 * @param message message content to save
 * @returns true on success, false on failure
 */
export default async function updateAceOffs(message: string): Promise<boolean> {
  let aceOffEntry: any;

  try {
    aceOffEntry = await aceOffSchema.findOne({});
  } catch (e) {
    console.error(e);
  }

  if (aceOffEntry) {
    try {
      await aceOffSchema.updateOne({}, { message });
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  try {
    await new aceOffSchema({ message }).save();
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
}
