const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const model = require("../../models/server.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Vote for this server on VitalServers.'),
	async execute(interaction) {
		
      const server = await model.findOne({ id: interaction.guild.id });
      if(!server) return interaction.reply('This server is not on VitalServers.')
       
      server.votes = parseInt(server.votes) + 1;
    await server.save();

    const embed = new EmbedBuilder()
    .setTitle('Successful Vote')
    .setDescription('You have successfully voted for this server on [VitalServers](https://vitallist.xyz/servers).')
	.setFooter({ text: `VitalServers - Vote Command`, iconURL: `${global.sclient.user.displayAvatarURL()}`})

    const row = new ActionRowBuilder()
		.addComponents(
		new ButtonBuilder()
	.setURL(`https://vitallist.xyz/servers/${interaction.guild.id}`)
	.setLabel('View Server Page')
	.setStyle(ButtonStyle.Link)
			);

    interaction.reply({ embeds: [embed], components: [row]})
	},
};