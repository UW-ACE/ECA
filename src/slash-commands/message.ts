import {SlashCommandBuilder} from "@discordjs/builders"
import {EcaInteraction, EcaSlashCommand} from "../types";
import {TextChannel} from "discord.js";

export default {
    level: "mod",
    data: new SlashCommandBuilder()
        .setName("message")
        .setDescription("Sends a message as ECA, hiding the identity of the sender")
        .addStringOption(option =>
            option.setName("message")
                .setDescription("Message to send")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("replyto")
                .setDescription("Specify this option to turn the message into a reply, this is the message that ECA should reply to")
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName("replyping")
                .setDescription("If ECA is replying to a message, whether the reply should ping the original author. Defaults to true")
                .setRequired(false)
        ),
    execute: async (interaction: EcaInteraction) => {
        const message = interaction.options.getString("message")
        const replyToMsgId = interaction.options.getString("replyto")
        const replyPing = interaction.options.getBoolean("replyping") ?? true

        if (replyToMsgId === null) {
            const channel = interaction.channel as TextChannel
            await channel.send(message)
        } else {
            let parentMessage
            if (replyToMsgId.includes("-")) {
                const [chSnowflake, msgSnowflake] = replyToMsgId.split("-")
                const channel = await interaction.guild.channels.fetch(chSnowflake) as TextChannel
                parentMessage = await channel.messages.fetch(msgSnowflake)
            }
            else {
                const channel = interaction.channel as TextChannel
                parentMessage = await channel.messages.fetch(replyToMsgId)
            }

            await parentMessage.reply({
                content: message,
                allowedMentions: {
                    repliedUser: replyPing
                }
            })
        }

        await interaction.reply({
            ephemeral: true,
            content: 'Done!'
        })
    },
} as EcaSlashCommand
