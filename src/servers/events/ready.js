const { ActivityType } = require("discord.js");
const vitallist = require("vitallist.js")
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const votes = require("../../models/serverVote");

module.exports = {
  name: "ready",
  async run(message, args) {
    const sclient = global.sclient;

    global.logger.system(sclient.user.tag + ` is online and ready.`);
    sclient.user.setActivity("vitallist.xyz/servers", {
      type: ActivityType.Watching,
    });
    
    setInterval(async () => {
      vitallist.postStats(sclient, global.config.servers.apikey)
    }, 500000)

    setInterval(async () => {
      let voteModels = await votes.find();
      if (voteModels.length > 0) {
        voteModels.forEach(async (a) => {
          let time = a.time - (Date.now() - a.date);
          if (time > 0) return;
          await votes.findOneAndDelete({ server: a.server, user: a.user });
        });
      }
    }, 300000);
  },
};
 