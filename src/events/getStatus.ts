import { EcaEvent } from '../types';
import statusSchema from '../db/Schemas/status';
import 'dotenv/config';
import { Client } from 'discord.js';

export default {
  type: 'ready',
  once: true,
  execute: async (client: Client<true>) => {
    if (process.env.ENV === 'DEV') {
      console.log('[EVENT WARNING] getStatus turned off in dev');
      return;
    }

    let status;

    try {
      status = await statusSchema.find({});
      console.log('Status: ', status[0]);
    } catch (e) {
      console.error(e);
    }

    const name = (status[0] && status[0].name) || 'feedback!';
    const type = (status[0] && status[0].type) || 'LISTENING';

    client.user.setPresence({
      activities: [
        {
          name: name,
          type: type,
        },
      ],
      status: 'online',
    });
  },
} as EcaEvent;
