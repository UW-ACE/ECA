import { MessageComponentInteraction, CommandInteractionOptionResolver, Client } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

/**
 * Small wrapper around MessageComponentInteraction that properly exposes the options field for ECA slash commands
 */
export interface EcaInteraction extends MessageComponentInteraction {
    options: CommandInteractionOptionResolver,
}

/**
 * Export struct of each slash command
 * 
 * Every command export under slash-commands should bne of this type
 */
export interface EcaSlashCommand {
    level: 'public' | 'mod', // mod = requires admin permissions
    data: SlashCommandBuilder,
    execute: (interaction: EcaInteraction) => Promise<void>,
}

/**
 * Export struct of each event
 * 
 * Every event export under events should bne of this type
 */
export interface EcaEvent {
    // The type of discord JS event to listen to
    type: string,

    // Whether the event should execute only once, or every time it's emitted
    once: boolean,

    // Event handler
    execute: (client: Client<true>) => Promise<void>,
}

/**
 * Coerces a generic object to a string, used for option value extraction
 * 
 * @param obj Obj to check
 * @returns 
 */
export function asString(obj: any): string {
    if (typeof obj === 'string') {
        return obj
    }
    else {
        throw new Error('Object is not a string');
    }
}

// include comments too

/**
 * Coerces a generic object to a number, used for option value extraction
 *
 * @param obj Obj to check
 * @returns
 */
export function asNumber(obj: any): number {
    if (typeof obj === 'number') {
        return obj
    }
    else {
        throw new Error('Object is not a number');
    }
}

/**
 * Coerces a generic object to a boolean, used for option value extraction
 * 
 * @param obj Obj to check
 * @returns
 */
export function asBoolean(obj: any): boolean {
    if (typeof obj === 'boolean') {
        return obj
    }
    else {
        throw new Error('Object is not a boolean');
    }
}
