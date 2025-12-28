import { Client } from "discord.js";
import { EcaEvent } from "../types";
import "dotenv/config";

export default {
  type: "ready",
  once: true,
  execute: async (client: Client<true>) => {
    // get all commands from this guild
    if (!client.application?.owner) await client.application?.fetch();
    const commands = await client.guilds.cache.get(process.env.PROD_ID)?.commands.fetch();

    const re = /test/;

    if (commands !== undefined) {
      commands.forEach((command) => {
        //   console.log(command.name, " ", command.id);
        if (re.test(command.name))
          try {
            command.delete();
          } catch (e) {
            console.log(e);
          }
      });
    }
  },
} as EcaEvent;
