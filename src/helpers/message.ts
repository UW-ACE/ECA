import {
  Client,
  TextChannel,
  Message,
  Snowflake,
  MessagePayload,
  MessageOptions,
  User,
  Guild,
  Channel,
} from 'discord.js';

function ensureIsTextChannel(ch: Channel | undefined | null): TextChannel {
  if (!ch) throw new Error('Channel not found');
  // Discord channel types in v13 use string literals like 'GUILD_TEXT'
  if ((ch as Channel).type !== 'GUILD_TEXT') {
    throw new Error('Channel is not a text channel');
  }
  return ch as TextChannel;
}

export function sendMessageToServer(
  client: Client<true>,
  inputChannel: string,
  message: string | MessagePayload | MessageOptions,
  guildID?: Snowflake
): Promise<Message> {
  const parseIsId = (s: string) => !isNaN(parseInt(s[0]));

  const findTextChannelInGuild = (
    guild: Guild | undefined,
    name: string
  ): TextChannel | undefined => {
    if (!guild) return undefined;
    const ch = guild.channels.cache.find(
      (c) => (c as Channel).type === 'GUILD_TEXT' && (c as TextChannel).name === name
    ) as Channel | undefined;
    if (!ch) return undefined;
    return ensureIsTextChannel(ch);
  };

  const findTextChannelByName = (name: string): TextChannel | undefined => {
    const ch = client.channels.cache.find(
      (c) => (c as Channel).type === 'GUILD_TEXT' && (c as TextChannel).name === name
    ) as Channel | undefined;
    if (!ch) return undefined;
    return ensureIsTextChannel(ch);
  };

  if (guildID) {
    if (!parseIsId(inputChannel)) {
      const guild = client.guilds.cache.get(guildID);
      const channel = findTextChannelInGuild(guild, inputChannel);
      if (!channel)
        return Promise.reject(new Error(`Channel ${inputChannel} not found in guild ${guildID}`));
      const textChannel = ensureIsTextChannel(channel);
      return textChannel.send(message).catch((e) => {
        console.log('message did not send to server: ', message, e);
        throw e;
      });
    } else {
      const ch = client.channels.cache.get(inputChannel) as Channel | undefined;
      if (!ch) return Promise.reject(new Error(`Channel id ${inputChannel} not found`));
      const textChannel = ensureIsTextChannel(ch);
      return textChannel.send(message).catch((e) => {
        console.log('message did not send to server: ', message, e);
        throw e;
      });
    }
  } else {
    const channel = findTextChannelByName(inputChannel);
    if (!channel) return Promise.reject(new Error(`Channel ${inputChannel} not found`));
    const textChannel = ensureIsTextChannel(channel);
    return textChannel.send(message).catch((e) => {
      console.log('message did not send to server: ', message, e);
      throw e;
    });
  }
}

export function replyToServerMessage(
  client: Client<true>,
  inputChannel: string,
  messageId: Snowflake,
  reply: string | MessagePayload | MessageOptions,
  guildID?: Snowflake
): Promise<Message> {
  const findTextChannelInGuild = (
    guild: Guild | undefined,
    name: string
  ): TextChannel | undefined => {
    if (!guild) return undefined;
    const ch = guild.channels.cache.find(
      (c) => (c as Channel).type === 'GUILD_TEXT' && c.name === name
    );
    return (ch as TextChannel) || undefined;
  };

  const findTextChannelByName = (name: string): TextChannel | undefined => {
    const ch = client.channels.cache.find(
      (c) => (c as Channel).type === 'GUILD_TEXT' && (c as TextChannel).name === name
    );
    return (ch as TextChannel) || undefined;
  };

  if (guildID) {
    const guild = client.guilds.cache.get(guildID);
    const channel = findTextChannelInGuild(guild, inputChannel);
    if (!channel)
      return Promise.reject(new Error(`Channel ${inputChannel} not found in guild ${guildID}`));
    const textChannel = ensureIsTextChannel(channel);
    return textChannel.messages
      .fetch(messageId)
      .then((m) => m.reply(reply))
      .catch((e) => {
        console.log('reply did not send to server: ', reply, e);
        throw e;
      });
  } else {
    const channel = findTextChannelByName(inputChannel);
    if (!channel) return Promise.reject(new Error(`Channel ${inputChannel} not found`));
    const textChannel = ensureIsTextChannel(channel);
    return textChannel.messages
      .fetch(messageId)
      .then((m) => m.reply(reply))
      .catch((e) => {
        console.log('message did not send to server: ', reply, e);
        throw e;
      });
  }
}

export function sendEmbedToServer(
  client: Client<true>,
  inputChannel: string,
  embed: unknown,
  guildID?: Snowflake
): Promise<Message> {
  const findTextChannelInGuild = (
    guild: Guild | undefined,
    name: string
  ): TextChannel | undefined => {
    if (!guild) return undefined;
    const ch = guild.channels.cache.find(
      (c) => (c as Channel).type === 'GUILD_TEXT' && c.name === name
    );
    return (ch as TextChannel) || undefined;
  };

  const findTextChannelByName = (name: string): TextChannel | undefined => {
    const ch = client.channels.cache.find(
      (c) => (c as Channel).type === 'GUILD_TEXT' && (c as TextChannel).name === name
    );
    return (ch as TextChannel) || undefined;
  };

  if (!isNaN(parseInt(inputChannel[0]))) {
    const ch = client.channels.cache.get(inputChannel) as Channel | undefined;
    if (!ch) return Promise.reject(new Error(`Channel id ${inputChannel} not found`));
    ensureIsTextChannel(ch);
    return (ch as TextChannel).send({ embeds: [embed as any] }).catch((e) => {
      console.log('embed did not send to server: ', e);
      throw e;
    });
  }

  if (guildID) {
    const guild = client.guilds.cache.get(guildID);
    const channel = findTextChannelInGuild(guild, inputChannel);
    if (!channel)
      return Promise.reject(new Error(`Channel ${inputChannel} not found in guild ${guildID}`));
    const textChannel = ensureIsTextChannel(channel);
    return textChannel.send({ embeds: [embed as any] }).catch((e) => {
      console.log('embed did not send to server: ', e);
      throw e;
    });
  } else {
    const channel = findTextChannelByName(inputChannel);
    if (!channel) return Promise.reject(new Error(`Channel ${inputChannel} not found`));
    const textChannel = ensureIsTextChannel(channel);
    return textChannel.send({ embeds: [embed as any] }).catch((e) => {
      console.log('embed did not send to server: ', e);
      throw e;
    });
  }
}

export function dmUser(
  client: Client<true>,
  inputUser: Snowflake,
  message: string | MessagePayload | MessageOptions
): void {
  const user = client.users.cache.get(inputUser) as User | undefined;
  if (!user) throw new Error(`User ${inputUser} not found`);

  user.send(message).catch((e) => console.log('message did not send to user: ', message, e));
}

export async function editMessageById(
  client: Client<true>,
  inputChannel: string,
  messageId: Snowflake,
  newMessage: string,
  toAppend?: boolean
): Promise<boolean> {
  let message;
  try {
    message = await fetchMessageById(client, inputChannel, messageId);
    if (!message) throw new Error(`Message ${messageId} not found in channel ${inputChannel}`);

    let finalMessage: string;
    if (toAppend) {
      finalMessage = message.content + '\n' + newMessage;
    } else {
      finalMessage = newMessage;
    }

    await message.edit(finalMessage as any);
    return true;
  } catch (e) {
    console.log('message did not get edited: ', e);
    return false;
  }
}

function fetchMessageById(
  client: Client<true>,
  inputChannel: string,
  messageId: Snowflake
): Promise<Message | undefined> {
  const ch = client.channels.cache.find(
    (c) => (c as Channel).type === 'GUILD_TEXT' && (c as TextChannel).name === inputChannel
  ) as Channel | undefined;
  if (!ch) return Promise.resolve(undefined);
  const textChannel = ensureIsTextChannel(ch);
  return textChannel.messages.fetch(messageId).catch((e) => {
    console.error(e);
    return undefined;
  });
}
