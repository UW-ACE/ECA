import { EcaInteraction, EcaSlashCommand } from '../types';
import { SlashCommandBuilder } from '@discordjs/builders';
import { editMessageById, sendMessageToServer } from '../helpers/message';
import getAceOffs from '../db/aceOff/getAceOffs';
import updateAceOffs from '../db/aceOff/updateAceOffs';
import getTrackedMessageId from '../db/trackedMessages/getTrackedMesssageId';
import updateTrackedMessage from '../db/trackedMessages/updateTrackedMessage';
import 'dotenv/config';

export default {
  level: 'public',
  data: new SlashCommandBuilder()
    .setName('aceofftheme')
    .setDescription('Suggest a future ace-off theme!')
    .addStringOption((option) =>
      option.setName('theme').setDescription('Enter the theme (e.g. Hype)!').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('emojis')
        .setDescription('Include some emojis in the theme post (e.g. 🔥)!')
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName('credit')
        .setDescription(
          "Do you want to be credited (e.g. This week's theme is Hype suggested by @Lavan)?"
        )
        .setRequired(true)
    ),
  execute: async (interaction: EcaInteraction) => {
    const client = interaction.client;
    const theme = interaction.options.getString('theme');
    const emojis = interaction.options.getString('emojis');
    const wantsCredit = interaction.options.getBoolean('credit');
    console.log(theme, emojis, wantsCredit);
    const intro = 'Got it! Your ace-off theme suggestion will look like this:\n';
    const post = wantsCredit
      ? `This week's theme is **${theme}** ${emojis} suggested by ${interaction.user}!`
      : `This week's theme is **${theme}** ${emojis}!`;

    let aceOffs = await getAceOffs();
    aceOffs = aceOffs + post + '\n';
    updateAceOffs(aceOffs);

    let msgid = await getTrackedMessageId('aceOffThemeList');
    let edited = false;

    if (msgid) {
      try {
        edited = await editMessageById(client, 'exec-general', msgid, aceOffs);
      } catch (e) {
        console.error(e);
      }
    }

    if (!edited) {
      const message = await sendMessageToServer(
        client,
        'exec-general',
        aceOffs,
        process.env.PROD_ID
      );
      // pin may be a method on the message object
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      message.pin();
      updateTrackedMessage('aceOffThemeList', message.id);
    }

    interaction.reply({
      content: intro + post,
      ephemeral: true,
    });
  },
} as EcaSlashCommand;
