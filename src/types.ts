import {MessageComponentInteraction, CommandInteractionOptionResolver} from 'discord.js'

export interface EcaInteraction extends MessageComponentInteraction {
    options: CommandInteractionOptionResolver,
}
