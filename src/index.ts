// ----------------------------------------------------IMPORTS----------------------------------------------------
import fs from "fs";
import { REST } from "@discordjs/rest";
import { PermissionFlagsBits, Routes } from "discord-api-types/v9";
import { Client, Intents, Collection } from "discord.js";
import mongoose from "mongoose";
import "dotenv/config";

import AceOffThemeCommand from "./slash-commands/aceofftheme";
import AppreciateCommand from "./slash-commands/appreciate";
import FeedbackCommand from "./slash-commands/feedback";
import HelpCommand from "./slash-commands/help";
import IntroductionCommand from "./slash-commands/introduction";
import MessageCommand from "./slash-commands/message";
import SetBirthdayCommand from "./slash-commands/setBirthday";
import StatusCommand from "./slash-commands/status";
import StopYellingAtExecCommand from "./slash-commands/stopyellingatexec";
import YellAtExecCommand from "./slash-commands/yellatexec";
import { EcaInteraction, EcaSlashCommand } from "./types";

// -----------------------------------------CLIENT SETUP----------------------------------------------

// Set up Client
const intents = new Intents(32767);
const client = new Client({
  intents: intents,
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

// -----------------------------------------DB SETUP----------------------------------------------

// MongoDB setup
(async () => {
  await mongoose.connect(process.env.MONGO_URI || "", {
    keepAlive: true,
  });
})();

// -----------------------------------------EVENTS SETUP----------------------------------------------

let eventFiles = fs
  .readdirSync("./dist/events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  let event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, event.execute);
  } else {
    client.on(event.name, event.execute);
  }
}

// -----------------------------------------COMMANDS SETUP----------------------------------------------

// Setup commands map
const SLASH_COMMANDS_LIST = [
  AceOffThemeCommand,
  AppreciateCommand,
  FeedbackCommand,
  HelpCommand,
  IntroductionCommand,
  MessageCommand,
  SetBirthdayCommand,
  StatusCommand,
  StopYellingAtExecCommand,
  YellAtExecCommand
];

const slashCommands = new Collection<string, EcaSlashCommand>();
for (const slashCommand of SLASH_COMMANDS_LIST) {
  // TODO: replace this check with something more sane. Honestly just enforcing proper TS types here would fix the issue
  if (process.env.ENV === "DEV" || slashCommand.level === "mod") {
    slashCommand.data = slashCommand.data.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  }

  if (process.env.ENV === "DEV") {
    slashCommand.data = slashCommand.data.setName(`dev_${slashCommand.data.name}`);
  }

  slashCommands.set(slashCommand.data.name, slashCommand);
}

// Register slash commands on ready
client.once("ready", async () => {
  const clientId = client.user.id;
  const guildId = process.env.GUILD_ID;

  // Registering slash commands in the client
  const rest = new REST({
    version: "9",
  }).setToken(process.env.BOT_TOKEN);

  const slashCommandPostData = Array.from(slashCommands.values()).map(command => command.data.toJSON());

  console.log(slashCommandPostData);

  try {
    if (!guildId) {
      await rest.put(Routes.applicationCommands(clientId), {
        body: [],
      });
      await rest.put(Routes.applicationCommands(clientId), {
        body: slashCommandPostData,
      });
      console.log(`Successfully registered ${slashCommands.size} application commands globally`);
    } else {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: [],
      });
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: slashCommandPostData,
      });
      console.log(`Successfully registered ${slashCommands.size} application commands for development guild`);
    }
  } catch (error) {
    if (error) console.error(`[ERROR] Error while registering commands:\n${JSON.stringify(error, null, 2)}`);
  }

  console.log(`To invite this bot to your server, use the link: https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot+applications.commands`);

  if (process.env.ENV === "DEV") {
    console.log("[WARN] DEV Mode is active, commands will be prefixed with '_dev' and will be admin/exec only!");
  }

  console.log(`Bot is online! The start time is: ${new Date().toString()}`);
});

// Handle slash commands
client.on("interactionCreate", async (interaction: EcaInteraction) => {
  if (!interaction.isCommand()) return;
  const command = slashCommands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    if (error) console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// -----------------------------------------INTRODUCTION SETUP----------------------------------------------

// temporary introduction stuff
client.on("guildMemberAdd", async (member) => {
  if (!member.user.bot)
    await member.user.send("Hey, welcome to ACE! To get started, you can type /introduction or check out the channel #🚨｜start-here!")
})

client.on("guildMemberAdd", (member) => {
  // TODO: implement this with correct new member information (e.g. new members guide)
  // perhaps use embeds to make it look nicer
  return;
  member.send(
    `Hello, ${member.user.username}! Welcome to the ECA test server! Find resources here: [] and here: []`
  );
  console.log(`${member.user.username} has joined`);
});

console.log("Bot token is", process.env.BOT_TOKEN);

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);