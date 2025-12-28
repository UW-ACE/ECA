import { MessageComponentInteraction, CommandInteractionOptionResolver } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

/**
 * Small wrapper around MessageComponentInteraction that properly exposes the options field
 */
export interface EcaInteraction extends MessageComponentInteraction {
    options: CommandInteractionOptionResolver,
}

/**
 * Export struct of each slash command
 */
export interface EcaSlashCommand {
    level: 'public' | 'mod', // mod = requires admin permissions
    data: SlashCommandBuilder,
    execute: (interaction: EcaInteraction) => Promise<void>,
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
