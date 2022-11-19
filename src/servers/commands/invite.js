const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Creates an invite for this server on VitalServers.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to whitch the invite will be made.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const footer = { text: `VitalServers - Invite Command`, iconURL: global.client.user.displayAvatarURL() };
    await interaction.deferReply({ ephemeral: true }).catch(() => null);
    const errorEmbed = new EmbedBuilder()
      .setTitle("Missing Permissions")
      .setDescription("The command you are trying to run can only be run by administrators.")
      .setFooter(footer);
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.editReply({ embeds: [errorEmbed] }).catch(() => null);

    const server = await global.serverModel.findOne({ id: interaction.guild.id });
    if (!server) return interaction.editReply("This server is not on VitalServers.").catch(() => null);
    const channel = interaction.options.getChannel("channel");
    const invitecode = await interaction.guild.invites.create(channel.id, { maxAge: 0 }).catch(e => e);
    if (invitecode instanceof Error) return interaction.reply(`There was an error while trying to make that invite.\n\`\`\`js\n${invitecode}\`\`\``);
    server.invite = invitecode.url;
    await server.save().catch(() => null);
    const embed = new EmbedBuilder()
      .setTitle("Successfully Created Invite")
      .setDescription(`The invite link on this server has been made in ${channel.toString()}.`)
      .setFooter(footer);

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setURL(`https://vitallist.xyz/servers/${interaction.guild.id}/edit`)
          .setLabel("Edit Server")
          .setStyle(ButtonStyle.Link)
      );

    return interaction.editReply({ embeds: [embed], components: [row] }).catch(() => null);
  },
};
