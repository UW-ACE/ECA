const {
  sendMessageToServer,
  sendEmbedToServer,
} = require("../helpers/message");
const { embedHandler } = require("../embeds/handler");
const { testEmbed } = require("./testEmbed");
const { SlashCommandBuilder } = require("@discordjs/builders");
require("dotenv").config();

module.exports = {
  level: "public",
  data: new SlashCommandBuilder()
    .setName("appreciatetest")
    .setDescription("Appreciate someone in ACE for being awesome!")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("Pick an ACE member to appreciate!")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("anonymous")
        .setDescription("Do you want to remain anonymous?")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Write a message to show appreciation to this member!")
    ),
  async execute(interaction) {
    const client = interaction.client;
    // Get options from interaction
    const options = interaction.options;
    const anonymous = options.get("anonymous").value;
    const appreciator = anonymous ? null : interaction.user;
    const appreciated = options.get("member").value;
    const appreciationMessage = options.get("message")
      ? options.get("message").value
      : "";

    const embedOptions = { appreciator, appreciated, appreciationMessage };

    // Send appreciation message to appropriate channel

    const post = `**${appreciator} wanted to thank <@${appreciated}> for the following**:
  > ${appreciationMessage}
  **Thanks for making *ACE* a better pl*ACE!*** <:cat_love:799494817250803762>`;

    // sendMessageToServer(client, "general", post, process.env.GUILD_ID); // remove this after fixing embeds

    // const embed = testEmbed(embedOptions);
    const embed = embedHandler("appreciate", embedOptions);

    sendEmbedToServer(client, "bot-stuffs", embed, process.env.PROD_ID);

    interaction.reply({
      content:
        "Sent! And thank *you* for appreciating other ACE members. I appreciate you for that! <:cat_love:799494817250803762>",
      ephemeral: true,
    });
  },
};