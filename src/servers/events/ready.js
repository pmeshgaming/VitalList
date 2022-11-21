const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  async run() {
    const sclient = global.sclient;
    global.logger.system(`${sclient.user.tag} is online and ready.`);
    sclient.user.setActivity("vitallist.xyz/servers", { type: ActivityType.Watching });

//     setInterval(async () => { // This shouldn't be needed anymore, since the check is in the POST: /xxx/vote endpoint
//       let voteModels = await global.serverVoteModel.find();
//       if (!voteModels.length) return;
//       for (const vote of voteModels) {
//         let time = vote.time - (Date.now() - vote.date);
//         if (time > 0) continue;
//         global.serverVoteModel.findOneAndDelete({ server: vote.server, user: vote.user });
//       };
//     }, 300000);

    const find = await global.botModel.findOne({ id: "1004264023111507979" });
    if (find) {
      find.servers = `${sclient.guilds.cache.size}`,
      find.shards = `1`;
      await find.save().catch(() => null);
    }
  },
};
 
