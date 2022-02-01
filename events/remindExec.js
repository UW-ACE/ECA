const { sendMessageToServer, dmUser } = require("../helpers/message");
const yellAtExecSchema = require("../Schemas/yellatexec-schema");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    let tasks;

    try {
      tasks = await yellAtExecSchema.find({});
    } catch (e) {
      console.error(e);
    }

    setInterval(async () => {
      if (tasks)
        for (let task of tasks) {
          const exec = task.exec || process.env.HAODA;
          const message = task.message;
          const channel = task.channel || "general";
          const post = `Hey <@${exec}>, ${message}`;
          dmUser(client, exec, post);
          sendMessageToServer(client, channel, post, process.env.PROD_ID);

          try {
            tasks = await yellAtExecSchema.find({});
          } catch (e) {
            console.error(e);
          }
        }
    }, 86400000);
  },
};