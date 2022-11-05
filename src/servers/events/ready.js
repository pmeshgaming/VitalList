const { ActivityType } = require("discord.js");
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
      let voteModels = await votes.find();
      if (voteModels.length > 0) {
        voteModels.forEach(async (a) => {
          let time = a.time - (Date.now() - a.date);
          if (time > 0) return;
          await votes.findOneAndDelete({ server: a.server, user: a.user });
        });
      }
    }, 300000);

    //await fetch("https://vitallist.xyz/api/bots/1004264023111507979", {
     // method: "POST",
    //  headers: {
    //    server_count: sclient.guilds.cache.size,
 //       shard_count: "1",
//        "Content-Type": "application/json",
//      },
 //   }).then((response) => {
   //   console.log(response.json());
  //  });
 },
};
 