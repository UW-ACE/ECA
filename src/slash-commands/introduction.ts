import { EcaInteraction, EcaSlashCommand } from '../types';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ButtonStyle } from 'discord-api-types/v8';
import * as crypto from 'crypto';
import assert from 'assert';
import EventEmitter from 'events';
import { MessageActionRow, MessageButton } from 'discord.js';
import { Base64 } from 'js-base64';

// TODO: move to util file
class Signal extends EventEmitter {
  constructor() {
    super();
  }

  signal() {
    this.emit('signal');
  }

  waitForSignal(timeout = -1) {
    return new Promise((res, rej) => {
      let timeoutTimer = undefined as any;
      if (timeout !== -1) {
        timeoutTimer = setTimeout(() => {
          rej('Timeout!');
        }, timeout);
      }

      this.once('signal', () => {
        if (timeoutTimer !== undefined) clearTimeout(timeoutTimer);
        res(undefined);
      });
    });
  }
}

class StringPacketHandler {
  id: Buffer;
  idB64: string;

  constructor(idSize = 4) {
    this.id = crypto.randomBytes(idSize);
    this.idB64 = Base64.encode(this.id.toString());
  }

  isAssociated(packet: string) {
    return packet.startsWith(this.idB64 + ':');
  }

  serialize(type: string, ...args: any[]) {
    return [this.id, type, ...args].map((x) => Base64.encode(x.toString())).join(':');
  }

  deserialize(packet: string) {
    if (!this.isAssociated(packet)) {
      throw new Error(`Packet ${packet} not associated with StringPacketHandler object`);
    }

    const [_, type, ...args] = packet.split(':').map((x) => Base64.decode(x));
    return { type, args } as { type: string; args: string[] };
  }
}

const MESSAGES: any[] = [
  {
    text:
      "Welcome to ACE! I'm ECA, the resident bot on this server, and I'm here to help you get started!\n" +
      "There are a couple of roles that you will want to get first so that you'll have access to the channels that you want and get notified when you need to be :smiley:\n\n" +
      'Lastly, if at any point you want/need to repeat this role selection process, you just need to type /introduction for this menu again.',
    roles: [],
  },
  {
    text:
      'First, what are your pronouns? (You may pick as many pronouns as you identify with)\n\n' +
      'If a button is:\n' +
      '* Gray: You do not have the role, clicking it will give you the role\n' +
      '* Blue: You have the role, clicking it will remove the role\n' +
      "When you're done, click 'Next' to go to the next page!",
    roles: [
      { label: 'She/Her', name: 'she/her' },
      { label: 'They/Them', name: 'they/them' },
      { label: 'He/Him', name: 'he/him' },
      { label: 'Ask Me First!', name: 'ask about my pronouns' },
    ],
  },
  {
    text: 'Are you planning on attending ACE this term are just joining to check the club out?',
    roles: [
      { label: "I'm participating 😊", name: 'ACE S23' },
      { label: "Just lurkin' 👀", name: 'Lurker' },
    ],
    verify: true,
  },
  {
    text:
      'Will you be attending ACE in-person, online, or both? These roles give access to their respective channels ' +
      'and also make it easier for execs and section leaders to notify you when needed :thumbsup:\n\n' +
      "_You may also skip this question if you aren't attending either._",
    roles: [
      { label: 'In-Person', name: 'In-Person ACE' },
      { label: 'Online', name: 'Online ACE' },
    ],
  },
  {
    text: "Next, what is your section? It's perfectly fine if you fall into multiple sections, or don't know yet!",
    roles: [
      'Soprano',
      'Alto',
      'Tenor',
      'Baritone',
      'Bass',
      { label: 'Beatboxing', name: 'Beatbox Bois' },
      { label: "I don't know my section", name: 'To Be Determined' },
    ],
  },
  {
    text:
      "Are you interested in any of the following creative contributor roles? No worries if you don't have experience " +
      'and are just curious :cat_love:',
    roles: ['Arrangers', 'Editors', 'Mixers', 'Choreo', 'Video Editors'],
  },
  {
    text: 'Are you interested in any of the following social activities?',
    roles: [
      { label: 'Video Games', name: 'PROFESSIONAL GAMER' },
      { label: 'Board Games', name: 'Board Gamer' },
    ],
  },
  {
    text:
      'Finally, if you would like to help with ECA, either as QA or directly contributing to the bot, ' +
      'you may add this role for access to the bot channel :upside_down:',
    roles: [
      {
        label: 'I want to help with the bot!',
        name: 'potentially a robot -- investigate further (bot QA)',
      },
    ],
  },
];

const FINISH_MESSAGE =
  "You're done!\n\n" +
  '**P.S.:** If you also want a more comprehensive guide to ACE, click this link: ' +
  'https://docs.google.com/document/d/1v7NUd1QDrWDGLXOU0k4eDKnZiCNv5ZQEOKMVBp86Ipw/edit#heading=h.9nufb2prdd34';

function createComponentArray(components: any[]) {
  assert(components.length <= 25, 'Discord supports at most 25 components');

  const chunks: any[] = [];
  for (let i = 0; i < components.length; i += 5) {
    chunks.push(components.slice(i, i + 5));
  }

  return chunks.map((row) => {
    return new MessageActionRow().addComponents(...row);
  });
}

function renderMessage(
  handler: StringPacketHandler,
  interaction: any,
  messageIndex: number,
  initial: boolean
) {
  const { text, roles: roleNames } = MESSAGES[messageIndex];
  const roleObjects = roleNames.map((obj: any) => {
    const name = obj.name || obj;
    const label = obj.label || name;
    const roleObject = interaction.guild.roles.cache.find((role: any) => role.name === name);

    if (roleObject === undefined) {
      console.log(`could not find role ${name}`);
    }

    return { name, label, id: roleObject.id };
  });
  const memberRoles = interaction.member.roles.cache;
  const verify = MESSAGES[messageIndex].verify || false;

  let buttons = roleObjects.map((role: any) => {
    let btn = new MessageButton()
      .setCustomId(handler.serialize('add', role.id))
      .setLabel(role.label)
      .setStyle(ButtonStyle.Secondary as any);

    if (!verify && memberRoles.find((r: any) => r.id === role.id)) {
      btn = btn
        .setStyle(ButtonStyle.Primary as any)
        .setCustomId(handler.serialize('clear', role.id));
    } else if (verify) {
      btn = btn
        .setStyle(ButtonStyle.Success as any)
        .setCustomId(handler.serialize('verify', role.id));
    }

    return btn;
  });
  if (!verify) {
    buttons.push(
      new MessageButton()
        .setCustomId(handler.serialize('next'))
        .setLabel(messageIndex < MESSAGES.length - 1 ? 'Next' : 'Finish')
        .setStyle(ButtonStyle.Success as any)
    );
  }

  const components = createComponentArray(buttons);

  const ret: any = {
    content: text,
    components,
  };
  if (initial) ret.ephemeral = true;
  return ret;
}

export default {
  level: 'public',
  data: new SlashCommandBuilder()
    .setName('introduction')
    .setDescription('Introduce users to ACE! (And force them to get all the roles ofc ;) )'),
  execute: async (interaction: any) => {
    let messageIndex = 0;
    let handler = new StringPacketHandler();

    const collector = interaction.channel.createMessageComponentCollector({
      filter: (i: any) => handler.isAssociated(i.customId),
      time: 5 * 60 * 1000,
    });

    collector.on('collect', async (i: any) => {
      const { type, args } = handler.deserialize(i.customId);

      if (type === 'add' || type === 'verify') {
        await i.member.roles.add(args);
      }
      if (type === 'next' || type === 'verify') {
        messageIndex++;
      }
      if (type === 'clear') {
        await i.member.roles.remove(args);
      }

      if (messageIndex < MESSAGES.length) {
        await i.update(renderMessage(handler, i, messageIndex, false));
      } else {
        collector.stop('finish');
      }
    });

    collector.on('end', async (_: any, reason: string) => {
      if (reason === 'finish') {
        await interaction.editReply({ content: FINISH_MESSAGE, components: [] });
      } else {
        await interaction.editReply({
          content: 'An error occurred with the introduction.  Maybe it timed out?',
          components: [],
        });
      }
    });

    await interaction.reply(renderMessage(handler, interaction, messageIndex, true));
  },
} as EcaSlashCommand;
