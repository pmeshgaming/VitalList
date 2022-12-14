const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  async run(client, member) {
    const id = member.guild.id;
    if (member.user.bot) {
      if (id === global.config.guilds.main) member.roles.add(global.config.roles.bots).catch(() => null);
      else if (id === global.config.guilds.testing) member.roles.add(global.config.roles.botsintesting).catch(() => null);
    } else {
      if (id !== global.config.guilds.main) return;
      client.channels.resolve("1017613906107175002")
        .send(`<:VD_add:1006511788155752558> \`${member.user.username}\` has joined the server.`)
        .catch(() => null);
      member.roles.add("1006067703238369291").catch(() => null);
console.log(member.user)
    const embed = new EmbedBuilder()
    .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dyncamic: true })})
    .setThumbnail(member.user.displayAvatarURL({ dyncamic: true }))
    .setTitle("Member Joined")
    .setDescription(`${member.user} has joined the server.`)
    .addFields({ name: "Joined Discord", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true})
    .addFields({ name: "Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true})
    .addFields({ name: "Bot", value: `${member.user.bot}`, inline: true})
    .setFooter({ text: "VitalList - Member Join Logs", iconURL: client.user.displayAvatarURL() })
    client.channels.resolve("1012569249421729862").send({ embeds: [embed] })
    }
  },
};

