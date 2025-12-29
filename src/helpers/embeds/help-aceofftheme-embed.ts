import { MessageEmbed } from "discord.js";
import { CHANNEL_ACEOFF } from "../channelConstants";

export function makeHelpAceOffThemeEmbed() {
  const embed = new MessageEmbed();

  embed.setColor("#42b3f5");
  embed.setTitle("🎤 ACE Off Theme 🎤 Help");
  embed.setDescription("Suggest future ACE Off themes!");
  embed.addField("Command", "`/aceofftheme`");
  embed.addField("Options", "theme, emojis, credit");
  embed.addField("Theme", "Suggest a theme");
  embed.addField(
    "Emojis",
    "Suggest fun emojis for ECA to include when posting"
  );
  embed.addField(
    "Credit",
    "If you'd like, ECA can credit you for the suggestion"
  );
  embed.addField(
    "Result",
    `ECA will pull from a pool of suggested ace off themes and will (eventually) post your theme into the <#${CHANNEL_ACEOFF}> chat!`
  );
  embed.setFooter(
    "For help with other commands, type /help or contact Plasmatic#0001"
  );
  return embed;
}
