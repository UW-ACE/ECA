const fs = require("fs");
const fileName = "./Data/birthdays.json";

function sendMessageToServer(client, inputChannel, message) {
  client.channels.cache
    .find((channel) => channel.name === inputChannel)
    .send(message);
}

function dmUser(client, inputUser, message) {
  client.users.cache.get(inputUser).send(message);
}

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    setInterval(() => {
      const date = new Date();
      const currMonth = date.getMonth() + 1;
      const currDay = date.getDate();

      // Get all birthdays
      const rawdata = fs.readFileSync(fileName);
      const birthdays = JSON.parse(rawdata);

      // Loop through birthdays and see if it's anyone's birthday
      for (const key in birthdays) {
        const user = client.users.cache.get(key);
        const birthday = birthdays[key].split(" ");
        const month = birthday[0];
        const day = birthday[1];
        if (month == currMonth && day == currDay) {
          console.log(
            `Happy birthday to ${key} on month: ${month}, day: ${day}`
          );
          sendMessageToServer(client, "calendar", `Happy birthday ${user}!`);
        }
      }
    }, 5000);
  },
};