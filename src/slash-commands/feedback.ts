import { EcaInteraction, EcaSlashCommand } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getTime } from "../helpers/time";
import { sendMessageToServer } from "../helpers/message";
import { PRIVATEFEEDBACK, FEEDBACKBOOGIE } from "../helpers/channelConstants";
import "dotenv/config";

export default {
  level: "public",
  data: new SlashCommandBuilder()
    .setName("feedback")
    .setDescription("Send us anonymous private or public feedback!")
    .addStringOption((option) =>
      option
        .setName("publicity")
        .setDescription("Pick public or private")
        .setRequired(true)
        .addChoices({ name: "private", value: "private" }, { name: "public", value: "public" })
    )
    .addStringOption((option) =>
      option.setName("message").setDescription("Write a feedback message").setRequired(true)
    ),
  execute: async (interaction: EcaInteraction) => {
    const client = interaction.client;
    const options = interaction.options;
    const publicity = options.get("publicity").value;
    const message = options.get("message").value;

    const date = getTime();
    const currDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    const currTime = date.getHours() + ":" + date.getMinutes().toString().padStart(2, "0") + ":" + date.getSeconds().toString().padStart(2, "0");

    const channelId = publicity === "private" ? PRIVATEFEEDBACK : FEEDBACKBOOGIE;
    sendMessageToServer(client, channelId, `${currDate} @ ${currTime}: ${message}`, process.env.GUILD_ID);
    interaction.reply({
      content: "Sent! Thanks for the anonymous feedback!",
      ephemeral: true,
    });
  },
} as EcaSlashCommand;
