const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const model = require("../../models/server.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('page')
		.setDescription('Provides you with a link to this server\'s page on VitalServers.'),
	async execute(interaction) {
		
      const server = await model.findOne({ id: interaction.guild.id });
      if(!server) return interaction.reply('This server is not on ServersOfDiscord.')
       
      server.votes = parseInt(server.votes) + 1;
    await server.save();

    const embed = new EmbedBuilder()
    .setTitle(`${interaction.guild.name}'s Page`)
    .setDescription('Click on the button below to go to this server\'s page on ServersOfDiscord.')
	.setFooter({ text: `ServersOfDiscord - Page Command`, iconURL: `http://assets.landofdiscord.com/branding/v2/LOD-Favicon.png`})

    const row = new ActionRowBuilder()
		.addComponents(
		new ButtonBuilder()
	.setURL(`https://servers.ofdiscord.com/server/${interaction.guild.id}`)
	.setLabel('View Server Page')
	.setStyle(ButtonStyle.Link)
			);

    interaction.reply({ embeds: [embed], components: [row]})
	},
};