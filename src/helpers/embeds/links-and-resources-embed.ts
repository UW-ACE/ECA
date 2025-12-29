import { MessageEmbed } from 'discord.js';
import { EMOJI_ACE } from '../emojiConstants';

export function makeLinksAndResourcesEmbeds() {
  const discordFriendsEmbed = new MessageEmbed();
  discordFriendsEmbed.setColor('#d2d26a');
  discordFriendsEmbed.setTitle('🥳 Discord Friends 🥳');
  discordFriendsEmbed.setDescription('Want more ACA? Join these servers!');
  discordFriendsEmbed.addField(
    '🌈 Waterloo A Cappella Club (UWACC) Discord',
    'https://discord.gg/JAgrDBCW9V'
  );
  discordFriendsEmbed.addField(
    '📜 UWACC Constitution',
    'https://docs.google.com/document/d/13xxjG7ktlbX-VS6ivFUALXCKDAE3xSj8gqP6z3SiI2U/edit'
  );
  discordFriendsEmbed.addField(
    '🇨🇦 Canada-wide A Cappella Discord',
    'https://discord.gg/awhMWhA6E8 (Ping schneids#7022 or DM if link is expired)'
  );
  discordFriendsEmbed.setFooter({
    text: 'Ping or DM an exec if any link is expired!',
  });

  const aceResourcesEmbed = new MessageEmbed();
  aceResourcesEmbed.setColor('#61c9ca');
  aceResourcesEmbed.setTitle('❗ ACE Resources ❗');
  aceResourcesEmbed.setDescription('New to ACE? Check these out!');
  aceResourcesEmbed.addField(
    `${EMOJI_ACE} Winter 2023 New Member Guide`,
    'https://bit.ly/AceW23NewMemberGuide'
  );
  aceResourcesEmbed.addField('⭐ ACE Winter 2023 Drive Folder', 'https://bit.ly/AceW23Music');
  aceResourcesEmbed.addField(
    '📜 ACE Constitution',
    'https://docs.google.com/document/d/1WS-JciXUyZrRT-O-8MMsmFkzFNJg5Jt_zM32QiPrBm0/edit'
  );
  aceResourcesEmbed.addField('🎵 SIB Download', 'https://tinyurl.com/uwaccsibdownload');
  aceResourcesEmbed.addField(
    '🎼 How to use Sib',
    'https://docs.google.com/document/d/1rAklgyv7GRIfIAZR0oSk9fnO6i6_xaGDYaRQs_Vf464/edit'
  );
  aceResourcesEmbed.addField('📆 ACE Calendar', 'http://bit.ly/acecalendar');
  aceResourcesEmbed.addField('📽️ F22 In-Person BOT Slides', 'https://bit.ly/F22ACEInPersonBOT');
  aceResourcesEmbed.addField('📽️ F22 Online BOT Slides', 'https://bit.ly/F22ACEOnlineBOT');
  aceResourcesEmbed.addField(
    '⛑ (Optional) COVID-19 Disclosure Form',
    'https://bit.ly/S22ACECovidDisclosure'
  );
  aceResourcesEmbed.addField(
    '🎼 How to Read Sheet Music Video',
    'https://www.youtube.com/watch?v=MU3bNWWEGgA&ab_channel=ACE'
  );
  aceResourcesEmbed.addField('🎙️ How to Record for Online ACE', 'https://bit.ly/3NTZ8t7');

  let socialEmbed = new MessageEmbed();
  socialEmbed.setColor('#65c063');
  socialEmbed.setTitle('📱 Socials 📱');
  socialEmbed.setDescription('Like social media? Add your social media and then check out ours!');
  // socialEmbed.addField(
  //   "📈 S22 Social Media Spreadsheet",
  //   "https://docs.google.com/spreadsheets/d/1tCDxhO5HMlj0Wd8LvGQUjzWrhs08qDXos_U1naRKJ9E/edit?usp=sharing"
  // );
  socialEmbed.addField('⏯ YouTube', 'https://www.youtube.com/c/UWACE');
  socialEmbed.addField('✨ Instagram', 'https://www.instagram.com/uw_ace');
  socialEmbed.addField('💃 TikTok', 'https://www.tiktok.com/@uw_ace');
  socialEmbed.addField('👤 Facebook', 'https://www.facebook.com/uwaterlooace');
  socialEmbed.addField('🌐 Website', 'http://www.uwacc.com/ace');

  let safetyResourcesEmbed = new MessageEmbed();
  safetyResourcesEmbed.setColor('#f0964d');
  safetyResourcesEmbed.setTitle('🦺 Safety Resources 🦺');
  safetyResourcesEmbed.setDescription('Feel unsafe or have feedback? Check out these resources!');
  safetyResourcesEmbed.addField(
    '🤫 Anonymous feedback',
    'Type /feedback in any channel of the server to give anonymous feedback through our discord bot'
  );
  safetyResourcesEmbed.addField(
    '💞 Ombudspeople',
    "We are looking for ombudspeople this term! If you're interested in being an ombudsperson, let either one of the presidents know! (@schneids#7022 and @Twoolf#3923)"
  );
  safetyResourcesEmbed.addField(
    '🏘️ Waterloo University and Community Resources doc',
    'https://docs.google.com/document/d/1EvJODav9CoHdxpbX-Bwe1Op2o82dKzihgKFWd0Rbc_k/edit?usp=sharing'
  );
  safetyResourcesEmbed.addField(
    '👷 UWACC Safety Team',
    `
  Reach out to them if you feel unsafe in ACE; expected response time is ~5 days
  - Zachary Lyu (Duelex#5844)
  Safety Team Email: uwaccsafety@gmail.com
  `
  );

  let currentLinksEmbed = new MessageEmbed();
  currentLinksEmbed.setColor('#9480e6');
  currentLinksEmbed.setTitle(':bangbang: Current Topics :bangbang:');
  currentLinksEmbed.setDescription("Looking for something? It's probably here!");
  currentLinksEmbed.addField('📆 ACE Calendar', 'http://bit.ly/acecalendar');
  currentLinksEmbed.addField('🎙️ How to Record for Online ACE', 'https://bit.ly/3NTZ8t7');
  currentLinksEmbed.addField('📣 ACE Winter 2023 Call Sheet', 'https://bit.ly/AceW23CallSheet');

  let embeds = [
    discordFriendsEmbed,
    aceResourcesEmbed,
    socialEmbed,
    safetyResourcesEmbed,
    currentLinksEmbed,
  ];

  return embeds;
}
