import { asNumber, asString, EcaInteraction, EcaSlashCommand } from "../types";
import { MONTHS } from "../helpers/monthConstants";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getBirthdayByID } from "../db/birthdays/get";
import { addBirthday } from "../db/birthdays/add";
import { updateBirthdayByID } from "../db/birthdays/update";

export default {
  level: "public",
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("Enter your birthday and we'll wish you!")
    .addStringOption((option) =>
      option
        .setName("month")
        .setDescription("Plese pick the month!")
        .addChoices(
          { name: MONTHS[1][0], value: "1" },
          { name: MONTHS[2][0], value: "2" },
          { name: MONTHS[3][0], value: "3" },
          { name: MONTHS[4][0], value: "4" },
          { name: MONTHS[5][0], value: "5" },
          { name: MONTHS[6][0], value: "6" },
          { name: MONTHS[7][0], value: "7" },
          { name: MONTHS[8][0], value: "8" },
          { name: MONTHS[9][0], value: "9" },
          { name: MONTHS[10][0], value: "10" },
          { name: MONTHS[11][0], value: "11" },
          { name: MONTHS[12][0], value: "12" }
        )
        .setRequired(true)
    )
    .addIntegerOption((option) => option.setName("day").setDescription("Plese pick the day!").setRequired(true)),
  execute: async (interaction: EcaInteraction) => {
    const options = interaction.options;
    const month = parseInt(asString(options.get("month").value));
    const day = asNumber(options.get("day").value);
    const userid = interaction.member.user.id;

    console.log(`Set birthday for ${userid} to ${MONTHS[month][0]} ${day}`);

    if (day <= parseInt(MONTHS[month][1]) && day > 0) {
      const userBirthday = await getBirthdayByID(userid);
      if (!userBirthday) {
        await addBirthday(userid, month, day);
      } else {
        await updateBirthdayByID(userid, month, day);
      }

      interaction.reply({ content: `Got it! Your birthday is ${MONTHS[month][0]} ${day}!`, ephemeral: true });
    } else {
      interaction.reply({ content: `Sorry! The day ${MONTHS[month][0]} ${day} does not exist! Please try again!`, ephemeral: true });
    }
  },
} as EcaSlashCommand;
