const { getTime } = require("../helpers/time");
const { sendMessageToServer } = require("../helpers/message");
const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  PRIVATEFEEDBACK,
  FEEDBACKBOOGIE,
} = require("../helpers/channelConstants");
require("dotenv").config();

module.exports = {
  level: "public",
  data: new SlashCommandBuilder()
    .setName("feedback")
    .setDescription("Send us anonymous private or public feedback!")
    .addStringOption((option) =>
      option
        .setName("publicity")
        .setDescription("Pick public or private")
        .setRequired(true)
        .addChoices({ name: "private", value: "private" },
            { name: "public", value: "public" })
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Write a feedback message")
        .setRequired(true)
    ),
  async execute(interaction) {
    const client = interaction.client;
    // Get options from interaction
    const options = interaction.options;
    const publicity = options.get("publicity").value;
    const message = options.get("message").value;

    // Get current date and time
    const date = getTime();
    const currDate =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    const currTime =
      date.getHours() + ":" + date.getMinutes().toString().padStart(2, '0') + ":" + date.getSeconds().toString().padStart(2, '0');

    // Send feedback to appropriate channel
    const channelId = publicity === "private" ? PRIVATEFEEDBACK : FEEDBACKBOOGIE;
    sendMessageToServer(
      client,
      channelId,
      `${currDate} @ ${currTime}: ${message}`,
      process.env.GUILD_ID
    );
    interaction.reply({
      content: "Sent! Thanks for the anonymous feedback!",
      ephemeral: true,
    });
  },
};
