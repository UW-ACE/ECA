import { EcaInteraction, EcaSlashCommand } from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { dmUser, sendMessageToServer } from "../helpers/message";
import yellAtExecSchema from "../db/Schemas/yellatexec";
import "dotenv/config";

export default {
  level: "mod",
  data: new SlashCommandBuilder()
    .setName("stopyellingatexec")
    .setDescription("Stop yelling at an exec!")
    .addStringOption((option) => option.setName("id").setDescription("Insert the id given by ECA (check dms from ECA!)").setRequired(true)),
  execute: async (interaction: EcaInteraction) => {
    const client = interaction.client;
    const id = interaction.options.getString("id");
    console.log("id:\n", id);

    let task;
    try {
      task = await yellAtExecSchema.findOne({ id });
    } catch (e) {
      console.error(e);
    }

    if (!task) {
      interaction.reply({ content: "Sorry, I can't find a task for an exec with that id!", ephemeral: true });
      return;
    }

    const message = task.message;
    const exec = task.exec;
    const channel = task.channel;

    console.log("no longer yelling this at an exec: ", message);

    await yellAtExecSchema.deleteOne({ id: id });

    dmUser(client, exec, `Good job <@${exec}> on finishing ${message}!`);
    sendMessageToServer(client, channel, `Congratulate <@${exec}> on finishing this task: ${message}`, process.env.PROD_ID);

    const post = `Thanks! I'll tell <@${exec}>... good job!`;

    interaction.reply({ content: post, ephemeral: true });
  },
} as EcaSlashCommand;
