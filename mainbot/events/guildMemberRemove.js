const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  async run(client, member) {

    const id = member.guild.id;
      if (id !== global.config.guilds.main) return;

    const embed = new EmbedBuilder()
    .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dyncamic: true })})
    .setThumbnail(member.user.displayAvatarURL({ dyncamic: true }))
    .setTitle("Member Left")
    .setDescription(`${member.user} has left the server.`)
    .addFields({ name: "Joined Discord", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true})
    .addFields({ name: "Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true})
    .addFields({ name: "Bot", value: `${member.user.bot}`, inline: true})
    .setFooter({ text: "VitalList - Member Leave Logs", iconURL: client.user.displayAvatarURL() })
    client.channels.resolve("1012569249421729862").send({ embeds: [embed] })

  },
};

