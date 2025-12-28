import "dotenv/config";
import getAceOffs from "../db/aceOff/getAceOffs";
import updateAceOffs from "../db/aceOff/updateAceOffs";
import getTrackedMessageId from "../db/trackedMessages/getTrackedMesssageId";
import { getTime } from "../helpers/time";
import { sendMessageToServer, editMessageById } from "../helpers/message";
import { CHANNEL_EXECGENERAL, CHANNEL_ACEOFF } from "../helpers/channelConstants";
import { EcaEvent } from "../types";
import { Client } from "discord.js";

const dayInMs = 86400000;
const weekInMs = 604800000;
const noonInMs = 43200000;
const estOffset = process.env.ENV === "DEV" ? 5 * 60 * 60 * 1000 : 0;

async function sendAceOffTheme(client: any, channel: string) {
  let aceOffs = await getAceOffs();

  if (!aceOffs || aceOffs.length <= 1) {
    console.log("ACE off queue is empty!");
    sendMessageToServer(client, CHANNEL_EXECGENERAL, "The ace-off theme queue is empty!", process.env.PROD_ID);
    return;
  }

  const themeList = aceOffs.split("\n");
  const theme = themeList.shift();
  sendMessageToServer(client, CHANNEL_ACEOFF, theme, process.env.PROD_ID);

  aceOffs = themeList.join("\n");
  updateAceOffs(aceOffs);

  const themeMessageId = await getTrackedMessageId("aceOffThemeList");
  aceOffs = aceOffs || "ACE off theme queue is empty! Ask members to suggest more!";
  editMessageById(client, CHANNEL_EXECGENERAL, themeMessageId, aceOffs);
}

export default {
  type: "ready",
  once: true,
  async execute(client: Client<true>) {
    if (process.env.ENV === "DEV") {
      console.log("[EVENT WARNING] sendAceOffTheme turned off in dev");
      return;
    }

    const date = getTime();
    const msPassed = (date.getTime() - estOffset) % dayInMs;
    let msToWait = msPassed > noonInMs ? dayInMs - msPassed + noonInMs : noonInMs - msPassed;
    const beforeNoon = date.getHours() < 12;
    const currDay = date.getDay();

    if (beforeNoon) {
      msToWait += ((6 - (currDay - 1)) % 7) * dayInMs;
    } else {
      msToWait += (6 - currDay) * dayInMs;
    }

    console.log(`[ACE OFF] waiting time in ms: ${msToWait}`, `[ACE OFF] waiting time in minutes: ${msToWait / 1000 / 60}`);

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
} as EcaEvent;
