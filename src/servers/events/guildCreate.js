const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildCreate",
  async run(sclient, guild) {
    if (!guild.available) return;
    const find = await global.serverModel.findOne({ id: guild.id });
    if (find) return;
    const owner = sclient.users.resolve(guild.ownerId) || await sclient.users.fetch(guild.ownerId).catch(() => ({ tag: `Unknown User#0000`, id: guild.ownerId }))
    await global.serverModel.create({
      id: guild.id,
      date: new Date().toLocaleDateString(),
      owner: guild.ownerId,
    });
    const logs = sclient.channels.resolve(global.config.channels.modlogs);
    if (!logs) return;
    const embed = new EmbedBuilder()
      .setTitle("New Guild")
      .setDescription(`**${guild.name}** has added me, lets see if they publish their server!`)
      .addFields(
        { name: "Guild Owner:", value: `${owner.tag} | \`${guild.ownerId}\`` },
        { name: "Member Count:", value: `${guild.memberCount} members` },
        {
          name: "Date:",
          value: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        }
      )
      .setFooter({
        text: `VitalServers - Guild Logs`,
        iconURL: global.sclient.user.displayAvatarURL(),
      });
    if (guild.icon) embed.setThumbnail(guild.iconURL());
    return logs.send({ embeds: [embed] }).catch(e => e);
  },
};
