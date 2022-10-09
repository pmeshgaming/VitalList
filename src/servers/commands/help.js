const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies information on VitalServers aswell as how to add your server.'),
	async execute(interaction) {

		const embed = new EmbedBuilder()
    .setTitle('VitalServers Info & Setup Tips')
    .setDescription("Heyo! I'm a bot for [VitalServers](https://vitallist.xyz/servers).\n\n**Here are some of my commands:**\n`ping`: Check if the bot is alive and running.\n`vote`: Vote for this server on VitalServers.\n`invite`: Creates an invite for this server on VitalServers.\n`page`: Provides you with a link to this server's page on VitalServers.\n\n**How do I publish my server to VitalServers?**\nSince I am already in this server, its already in the VitalServers database.\nStep #1: Run the /invite command is this server, note that this command can only be used by admins.\nStep #2: Go to the server edit page that is linked in the invite command and edit it. Note that only server owners can edit it.\nOnce you click \"Submit\" your server will be public on VitalServers!\n\nNeed any further help? Join our support server server by clicking the button below.")
	.setFooter({ text: `VitalList - Help Command`, iconURL: `${global.sclient.user.displayAvatarURL()}`})

    const row = new ActionRowBuilder()
		.addComponents(
		new ButtonBuilder()
	.setURL(`https://vitallist.xyz/servers`)
	.setLabel('Visit VitalServers')
	.setStyle(ButtonStyle.Link),
        new ButtonBuilder()
	.setURL(`https://discord.gg/HrWe2BwVbd`)
	.setLabel('Support Server')
	.setStyle(ButtonStyle.Link)
			);

    interaction.reply({ embeds: [embed], components: [row]})
	},
};