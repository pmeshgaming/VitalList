const { EmbedBuilder } = require("discord.js");
const { model } = require("mongoose");
const model1 = require("../../src/models/bot.js");
const votes = require("../../src/models/vote.js");
module.exports = {
  name: "ready",
  async run(client, message, args) {
    const bots = await model1.find();
    global.logger.system(`${client.user.tag} is online and ready.`);
    client.user.setActivity(`vitallist.xyz | ${bots.length} bots.`, {
      type: 3,
    });

    setInterval(async () => {
      let voteModels = await votes.find();
      if (voteModels.length > 0) {
        voteModels.forEach(async (a) => {
          let time = a.time - (Date.now() - a.date);
          if (time > 0) return;
          await votes.findOneAndDelete({ bot: a.bot, user: a.user });
        });
      }
    }, 300000);
  },
};
