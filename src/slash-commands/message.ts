import {SlashCommandBuilder} from "@discordjs/builders"
import {EcaInteraction} from "../types";
import {Base, BaseGuildTextChannel} from "discord.js";

// TODO: change to default exporting an object
module.exports = {
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
                .setDescription("ID of the message that ECA should reply to, if the message is meant to be sent as a reply.  Optional")
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
            const channel = interaction.channel as BaseGuildTextChannel
            await channel.send(message)
        } else {
            const [chSnowflake, msgSnowflake] = replyToMsgId.split("-")
            const channel = await interaction.guild.channels.fetch(chSnowflake) as BaseGuildTextChannel
            const parentMessage = await channel.messages.fetch(msgSnowflake)
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
}