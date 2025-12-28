import { asString, EcaInteraction, EcaSlashCommand } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { sendMessageToServer, sendEmbedToServer } from "../helpers/message";
import { CHANNEL_GENERAL } from "../helpers/channelConstants";
import { EMOJI_CAT_LOVE } from "../helpers/emojiConstants";
import "dotenv/config";
import { makeAppreciateEmbed } from "../embeds/appreciate-embed";

export default {
  level: "public",
  data: new SlashCommandBuilder()
    .setName("appreciate")
    .setDescription("Appreciate someone in ACE for being awesome!")
    .addBooleanOption((option) =>
      option
        .setName("anonymous")
        .setDescription("Do you want to remain anonymous?")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option.setName("member").setDescription("Pick an ACE member to appreciate!")
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Write a message to show appreciation to this member!")
    ),
  execute: async (interaction: EcaInteraction) => {
    const client = interaction.client;
    // Get options from interaction
    const options = interaction.options;
    const anonymous = options.get("anonymous").value;
    const appreciator = anonymous ? null : interaction.user;
    const appreciated = options.get("member") ? asString(options.get("member").value) : "";
    const appreciationMessage = options.get("message") ? asString(options.get("message").value) : "";

    const embedOptions = { appreciator: appreciator?.id, appreciated, appreciationMessage };

    const embed = makeAppreciateEmbed(embedOptions);

    if (appreciated) {
      try {
        sendMessageToServer(client, CHANNEL_GENERAL, `<@${appreciated}>`, process.env.PROD_ID);
      } catch (e) {
        console.error(e);
      }
    }
    sendEmbedToServer(client, CHANNEL_GENERAL, embed, process.env.PROD_ID);

    interaction.reply({
      content: `Sent! And thank *you* for appreciating other ACE members. I appreciate you for that! ${EMOJI_CAT_LOVE}`,
      ephemeral: true,
    });
  },
} as EcaSlashCommand;
