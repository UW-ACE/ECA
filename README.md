# ECA

ECA is ACE's very own discord bot! ECA can help you navigate the server, participate in events, give feedback to the club, and have an overall greater ACE experience!

## Developer Notes

To help develop this project on your local machine, please do the following:

1. Clone this repo onto your local machine.
2. Run "npm install" or "yarn install" in the /ECA directory.
3. Create a .env file in the root directory and send a message to Leben#3185 for the secret tokens.
4. Run "yarn dev" or "npm run dev" to turn on the bot and have it automatically restart when you save changes.

## Updating Embeds

Prerequisites (things to install!):
* Git
* Node.JS and NPM

1. Clone this branch! (Run `git clone -b update-embeds https://github.com/UW-ACE/ECA.git`)
2. Ask Moses (Plasmatic#0001) for a `.env` file and place it in the same folder as the newly cloned repository (the folder should be called "ECA" and be in the same folder as the one you ran `git clone ...` in)
3. Edit the content of `embeds/links-and-resources-embeds.js` to update the embeds!
4. To apply the changes, start the bot using `npm run start` and just wait until the links and resources channel has been updated (you can then shutdown the bot with Ctrl+C *actually please do this otherwise bad things will happen*)