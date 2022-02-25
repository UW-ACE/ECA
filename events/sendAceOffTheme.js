require("dotenv").config();

const getAceOffs = require("../db/aceOff/getAceOffs");
const updateAceOffs = require("../db/aceOff/updateAceOffs");
const getTrackedMessageId = require("../db/trackedMessages/getTrackedMesssageId");

const { getTime } = require("../helpers/time");
const {
  sendMessageToServer,
  dmUser,
  fetchMessageById,
  editMessageById,
} = require("../helpers/message");

const dayInMs = 86400000;
const weekInMs = 604800000;
const noonInMs = 43200000;
const estOffset = process.env.ENV === "DEV" ? 5 * 60 * 60 * 1000 : 0;

async function sendAceOffTheme(client, channel) {
  let aceOffs = await getAceOffs();

  if (!aceOffs || aceOffs.length <= 1) {
    console.log("ACE off queue is empty!");
    sendMessageToServer(
      client,
      "exec-general",
      "The ace-off theme queue is empty!",
      process.env.PROD_ID
    );
    return;
  }

  const themeList = aceOffs.split("\n");
  const theme = themeList.shift();
  sendMessageToServer(client, "ace-off", theme, process.env.PROD_ID);

  aceOffs = themeList.join("\n");
  updateAceOffs(aceOffs);

  const themeMessageId = await getTrackedMessageId("aceOffThemeList");
  aceOffs =
    aceOffs || "ACE off theme queue is empty! Ask members to suggest more!";
  editMessageById(client, "exec-general", themeMessageId, aceOffs);
}

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    const date = getTime();
    const msPassed = (date.getTime() - estOffset) % dayInMs;
    const msToWait = dayInMs - msPassed + noonInMs;
    console.log(`waiting time in ms: ${msToWait}\n
    waiting time in minutes: ${msToWait / 1000 / 60}`);

    // Wait until noon the next day
    setTimeout(async () => {
      console.log("noon! (set timeout)");
      // send ace off theme
      await sendAceOffTheme(client, "bot-stuffs");
      // wait a week, repeat weekly
      setInterval(async () => {
        console.log("(set interval)");
        await sendAceOffTheme(client, "bot-stuffs");
      }, weekInMs);
    }, msToWait);
  },
};
