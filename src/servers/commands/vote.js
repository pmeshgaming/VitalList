const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Vote for this server on VitalServers."),
  async execute(interaction) {
    await interaction.deferReply().catch(() => null);
    let server = await global.serverModel.findOne({ id: interaction.guild.id });
    if (!server) return interaction.editReply("This server was not found on VitalServers.").catch(() => null);
    if (!server.published) return interaction.editReply("This server is not published on VitalServers yet.\nRun the /help command for more info.").catch(() => null);

    let x = await global.serverVoteModel.findOne({ user: interaction.user.id, server: interaction.guild.id });
    if (x) {
      let timeObj = ms(x.time - (Date.now() - x.date), { long: true });
      return interaction.editReply(`You can only vote once per hour.\nPlease come back in ${timeObj}.`).catch(() => null);
    }

    await global.serverVoteModel.create({ user: interaction.user.id, server: interaction.guild.id, date: Date.now(), time: 3600000 });
    server.votes++;
    await server.save().catch(() => null);
    const logs = global.sclient.channels.resolve(global.config.channels.weblogs);
    const date = new Date();
    const votedEmbed = new EmbedBuilder()
      .setTitle("Server Voted")
      .setDescription(`<:vote:1028862219313762304> ${interaction.guild.name} has been voted on VitalServers.`)
      .setColor("Purple")
      .addFields({
        name: "Server",
        value: `[${interaction.guild.name}](https://vitallist.xyz/servers/${interaction.guild.id})`,
        inline: true,
      })
      .addFields({
        name: "Voter",
        value: `[${interaction.user.tag}](https://vitallist.xyz/users/${interaction.user.id})`,
        inline: true,
      })
      .addFields({
        name: "Date",
        value: `${date.toLocaleString()}`,
        inline: true,
      })
      .setFooter({ text: "Vote Logs - VitalServers", iconURL: global.sclient.user.displayAvatarURL() });
    if (logs) logs.send({ embeds: [votedEmbed] }).catch(() => null);

    const embed = new EmbedBuilder()
      .setTitle("Successful Vote")
      .setDescription("You have successfully voted for this server on [VitalServers](https://vitallist.xyz/servers).")
      .setFooter({ text: `VitalServers - Vote Command`, iconURL: global.sclient.user.displayAvatarURL() });

    const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setURL(`https://vitallist.xyz/servers/${interaction.guild.id}`)
        .setLabel("View Server Page")
        .setStyle(ButtonStyle.Link)
    );

    return interaction.editReply({ embeds: [embed], components: [row] }).catch(() => null);
  },
};
