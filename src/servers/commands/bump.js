const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const ms = require("ms");
const cooldown = 1800000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bump")
    .setDescription("Bumps this server on VitalServers."),
  async execute(interaction) {
    await interaction.deferReply().catch(() => null);
    let server = await global.serverModel.findOne({ id: interaction.guild.id });
    if (!server) return interaction.editReply("This server was not found on VitalServers.").catch(() => null);
    if (!server.published) return interaction.editReply("This server is not published on VitalServers yet.\nRun the /help command for more info.").catch(() => null);
    let lastDaily = server.bump;
    if (cooldown - (Date.now() - lastDaily) > 0) {
      let timeObj = ms(cooldown - (Date.now() - lastDaily), { long: true });
      return interaction.editReply(`This server cannot be bumped just yet.\nCome back in ${timeObj}.`).catch(() => null);
    } else {
      server.bump = new Date().getTime();
      server.bumps++;
      await server.save().catch(() => null);
      const logs = global.sclient.channels.resolve(global.config.channels.weblogs);
      const date = new Date();
      const votedEmbed = new EmbedBuilder()
        .setTitle("Server Bumped")
        .setDescription(`<:vote:1028862219313762304> ${interaction.guild.name} has been bumped on VitalServers.`)
        .setColor("Aqua")
        .addFields(
          {
            name: "Server",
            value: `[${interaction.guild.name}](https://vitallist.xyz/servers/${interaction.guild.id})`,
            inline: true,
          },
          {
            name: "Bumper",
            value: `[${interaction.user.tag}](https://vitallist.xyz/users/${interaction.user.id})`,
            inline: true,
          },
          { name: "Date", value: `${date.toLocaleString()}`, inline: true }
        )
        .setFooter({
          text: "Bump Logs - VitalServers",
          iconURL: `${global.sclient.user.displayAvatarURL()}`,
        });
      if (logs) logs.send({ embeds: [votedEmbed] }).catch(() => null);

      const embed = new EmbedBuilder()
        .setTitle("Successful Bump")
        .setDescription("You have successfully bumped this server to the top of [VitalServers](https://vitallist.xyz/servers).")
        .setFooter({ text: `VitalServers - Bump Command`, iconURL: global.sclient.user.displayAvatarURL() });

      const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setURL(`https://vitallist.xyz/servers/${interaction.guild.id}`)
          .setLabel("View Server Page")
          .setStyle(ButtonStyle.Link)
      );

      return interaction.editReply({ embeds: [embed], components: [row] }).catch(() => null);
    }
  },
};
