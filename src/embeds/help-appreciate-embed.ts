import { MessageEmbed } from "discord.js";
import { CHANNEL_GENERAL } from "../helpers/channelConstants";
import { EMOJI_CAT_LOVE } from "../helpers/emojiConstants";

export function makeHelpAppreciateEmbed() {
  const embed = new MessageEmbed();

  embed.setColor("#42b3f5");
  embed.setTitle(`${EMOJI_CAT_LOVE} Appreciate ${EMOJI_CAT_LOVE} Help`);
  embed.setDescription("Publicly apreciate members of ACE!");
  embed.addField("Command", "`/appreciate`");
  embed.addField("Options", "anonymous, member, message");
  embed.addField(
    "Anonymous",
    "Pick `True` to remain anonymous, or `False` to show your name on the message!"
  );
  embed.addField(
    "Member [Optional]",
    "Provide a specific ACE member to appreciate, or skip this to address your appreciation to all of ACE!"
  );
  embed.addField(
    "Message [Optional]",
    "Provide a specific appreciative message, or skip this and let ECA provid one!"
  );
  embed.addField("Result", `ECA will share your appreciation into <#${CHANNEL_GENERAL}>!`);
  embed.setFooter({
    text: "For help with other commands, type /help or contact Plasmatic#0001",
  });
  return embed;
}
