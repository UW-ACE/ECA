import { MessageEmbed, Snowflake } from "discord.js";
import { EMOJI_CAT_LOVE } from "../helpers/emojiConstants";

export interface AppreciateEmbedOptions {
  appreciator?: Snowflake,
  appreciated?: Snowflake,
  appreciationMessage?: string,
}

export function makeAppreciateEmbed(options: AppreciateEmbedOptions) {
  let embed = new MessageEmbed();

  embed.setColor("#00db80");
  embed.setTitle("AppreciACEtion!!");
  embed.setDescription("Giving shout outs to the amazing people of ACE!");
  if (options.appreciator)
    embed.addField("Appreciator", `<@${options.appreciator}>`, true);
  if (options.appreciated)
    embed.addField("Appreciated", `<@${options.appreciated}>`, true);
  else embed.addField("Appreciated", "ACE", true);
  if (options.appreciationMessage) {
    embed.addField("Message", options.appreciationMessage);
  } else {
    embed.addField(
      "Message",
      `Thanks for being amazing and brightening someone's day!`
    );
  }
  embed.addField("We appreciate you!", EMOJI_CAT_LOVE);
  embed.setFooter({
    text: "For help using ECA, type /help or contact Plasmatic#0001",
  });
  return embed;
}
