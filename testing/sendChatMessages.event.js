require("dotenv").config();
const {
  GENERAL,
  EXECGENERAL,
  BOTSTUFFS,
  ACEOFF,
} = require("../helpers/channelConstants");
const {
  sendMessageToServer,
  dmUser,
  editMessageById,
  sendEmbedToServer,
  replyToServerMessage,
} = require("../helpers/message");

const { testEmbed } = require("./testEmbed");
const embed = testEmbed({
  appreciated: "894019356705562674",
  appreciationMessage: "test",
});

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    // -----------------------------------ECA Test Server----------------------------------
    // sendMessageToServer(client, "general", "test", process.env.GUILD_ID);
    // -------------------------------------ACE Server-------------------------------------
    // sendMessageToServer(client, BOTSTUFFS, "", process.env.PROD_ID);
    // replyToServerMessage(client, GENERAL,"961091520784650301","",process.env.PROD_ID);
    // editMessageById(client, "bot-stuffs", "929475949819478118", "", true);
    // sendEmbedToServer(client, BOTSTUFFS, embed, process.env.PROD_ID);
    // ---------------------------------------User DM--------------------------------------
    // dmUser(client, process.env.BOT_OWNER, "test123");
  },
};
