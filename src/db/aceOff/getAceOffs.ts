import aceOffSchema from "../Schemas/ace-offs";

/**
 * Returns the current ace-off message (empty string if not set)
 */
export default async function getAceOffs(): Promise<string> {
  let aceOffEntry: any;
  try {
    aceOffEntry = await aceOffSchema.findOne({});
  } catch (e) {
    console.error(e);
  }

  return aceOffEntry ? aceOffEntry.message : "";
}
