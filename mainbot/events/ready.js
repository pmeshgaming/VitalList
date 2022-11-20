module.exports = {
  name: "ready",
  async run(client) {
    global.logger.system(`${client.user.tag} is online and ready.`);
    client.user.setActivity(`vitallist.xyz | ${await global.botModel.count()} bots.`, {
      type: 3,
    });       
    const lb_message = await client.channels.cache.get(global.config.channels.leaderboardC).messages.fetch(global.config.channels.leaderboardM);

    setInterval(async () => {
        const model = require("../../src/models/user.js");
        const users = await model.find({}).sort({ xp: -1}).limit(10)
        const filtered = users.filter(user => user.xp > 0);
        const sorted = filtered.sort((a, b) => b.level - a.level || b.xp - a.xp);
        const list = sorted.map((user, i) => `${i + 1}. **${user.username}** | **Level:** ${user.level} | **XP:** ${user.xp}`).join("\n")

        const embed = new EmbedBuilder()
        .setTitle(`Top 10 Leaderboard`)
        .setDescription(`${list}`)
        .setColor('Random')
        .setThumbnail(lb_message.guild.iconURL())
        .setTimestamp()
        .setFooter({ text: lb_message.guild.name+" - Live Leaderboard | Updated", iconURL: "https://vitallist.xyz/img/icon.webp"})
        await lb_message.edit({embeds: [embed]});
    }, 1200000);

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
