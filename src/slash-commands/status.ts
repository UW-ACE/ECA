import { asString, EcaInteraction, EcaSlashCommand } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import statusSchema from "../Schemas/status";

export default {
  level: "mod",
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Set ECA's status!")
    .addStringOption((option) => option.setName("name").setDescription("What do you want ECA to listen to?").setRequired(true))
    .setDefaultPermission(false),
  execute: async (interaction: EcaInteraction) => {
    const client = interaction.client;
    const options = interaction.options;

    // level = mod should take care of this
    // if (!interaction.member.permissions.any("ADMINISTRATOR")) {
    //   interaction.reply({ content: `Sorry! Only executives can run this command!`, ephemeral: true });
    // }

    const name = asString(options.get("name").value);

    await statusSchema.deleteMany({});

    try {
      await new statusSchema({ name: name, type: "LISTENING" }).save();
    } catch (e) {
      console.error(e);
    }

    client.user.setPresence({ activities: [{ name: name, type: "LISTENING" }], status: "online" });

    interaction.reply({ content: `Got it! ECA is now listening to ${name}`, ephemeral: true });

    console.log("status changed by", interaction.member.user.username, "to", name);
  },
} as EcaSlashCommand;
