import { EcaInteraction, EcaSlashCommand } from '../types';
import { SlashCommandBuilder } from '@discordjs/builders';
import { dmUser, sendMessageToServer } from '../helpers/message';
import { getTime } from '../helpers/time';
import yellAtExecSchema from '../db/Schemas/yellatexec';
import 'dotenv/config';

export default {
  level: 'mod',
  data: new SlashCommandBuilder()
    .setName('yellatexec')
    .setDescription('Yell at an exec to do work!')
    .addUserOption((option) =>
      option
        .setName('exec')
        .setDescription("Enter an exec to be yelled at (if they're ok with this!)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('message').setDescription('Enter message to yell at an exec').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('channel')
        .setDescription('Enter a channel to yell at an exec in')
        .setRequired(true)
    ),
  execute: async (interaction: EcaInteraction) => {
    const client = interaction.client;
    const exec = interaction.options.getUser('exec').id;
    const message = interaction.options.getString('message');
    const channel = interaction.options.getString('channel');
    console.log(`yelling this at ${exec}: `, message);
    const id = getTime().getTime();

    try {
      await new yellAtExecSchema({ exec, message, channel, id }).save();
    } catch (e) {
      console.error(e);
    }

    const yell = `Hey <@${exec}>, ${message}!`;
    dmUser(client, exec, yell);
    sendMessageToServer(client, channel, yell, process.env.PROD_ID);

    const post = `Thanks! I'll tell that exec... ${yell}`;
    interaction.user.send(
      `I'm now yelling the following at <@${exec}> *every day*:\n    \n${yell}\n    \nHere's your **task id**: ${id}\n    \nUse this id to stop yelling at <@${exec}> about this task once they're done!`
    );

    interaction.reply({ content: post, ephemeral: true });
  },
} as EcaSlashCommand;
