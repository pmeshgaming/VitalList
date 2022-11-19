module.exports = {
  name: "ready",
  async run(client) {
    global.logger.system(`${client.user.tag} is online and ready.`);
    client.user.setActivity(`vitallist.xyz | ${await global.botModel.count()} bots.`, {
      type: 3,
    });

    setInterval(async () => {
      let voteModels = await global.voteModel.find();
      if (!voteModels.length) return;
      for (const vote of voteModels) {
        let time = vote.time - (Date.now() - vote.date);
        if (time > 0) continue;
        global.voteModel.findOneAndDelete({ bot: vote.bot, user: vote.user });
      }
    }, 300000);
  },
};
