const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies information on VitalServers aswell as how to add your server.'),
	async execute(interaction) {

		const embed = new EmbedBuilder()
    .setTitle('ServersOfDiscord Info & Setup Tips')
    .setDescription("Heyo! I'm a bot for [ServersOfDiscord](https://servers.ofdiscord.com)\n\n**Here are some of my commands:**\n`ping`: Check if the bot is alive and running.\n`vote`: Vote for this server on ServersOfDiscord.\n`invite`: Creates an invite for this server on ServersOfDiscord.\n`page`: Provides you with a link to this server's page on ServersOfDiscord.\n\n**How do I publish my server to ServersOfDiscord?**\nSince I am already in this server, its already in the ServersOfDiscord database.\nStep #1: Run the /invite command is this server, note that this command can only be used by admins.\nStep #2: Go to the server edit page that is linked in the invite command and edit it. Note that only server owners can edit it.\nOnce you click \"Submit\" your server will be public on ServersOfDiscord!\n\nNeed any further help? Join our support server server by clicking the button below.")
	.setFooter({ text: `ServersOfDiscord - Help Command`, iconURL: `http://assets.landofdiscord.com/branding/v2/LOD-Favicon.png`})

    const row = new ActionRowBuilder()
		.addComponents(
		new ButtonBuilder()
	.setURL(`https://servers.ofdiscord.com/`)
	.setLabel('Visit ServersOfDiscord')
	.setStyle(ButtonStyle.Link),
        new ButtonBuilder()
	.setURL(`https://land.ofdiscord.com/discord`)
	.setLabel('Support Server')
	.setStyle(ButtonStyle.Link)
			);

    interaction.reply({ embeds: [embed], components: [row]})
	},
};