const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField  } = require('discord.js');
const model = require("../../models/server.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Creates an invite for this server on VitalServers.')
        .addChannelOption(option => option.setName('channel').setDescription('The channel to whitch the invite will be made.').setRequired(true)),
	async execute(interaction) {

        const errorEmbed = new EmbedBuilder()
        .setTitle('Missing Permissions')
        .setDescription('The command you are trying to run can only be run by administrators.')
        .setFooter({ text: `VitalServers - Invite Command`, iconURL: `${global.client.user.displayAvatarURL()}`})

        const member = interaction.guild.members.cache.get(interaction.user.id);
                  
        if(!member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [errorEmbed], ephemeral: true });     
                 
        const server = await model.findOne({ id: interaction.guild.id });
        if(!server) return interaction.reply('This server is not on VitalServers.')
		
       const guild = interaction.guild;
       const channel = interaction.options.getChannel('channel');

       try {
        const invitecode = await guild.invites.create(channel.id, { maxAge: 0 });
        server.invite = invitecode.url;
        await server.save();
        const embed = new EmbedBuilder()
        .setTitle("Successfully Created Invite")
        .setDescription("The invite link on this server has been made in <#"+channel.id+">.")
        .setFooter({ text: `VitalServers - Invite Command`, iconURL: `${global.sclient.user.displayAvatarURL()}`})
        const row = new ActionRowBuilder()
        .addComponents(
        new ButtonBuilder()
        .setURL(`https://vitallist.xyz/servers/${interaction.guild.id}/edit`)
        .setLabel('Edit Server')
        .setStyle(ButtonStyle.Link));

        interaction.reply({ embeds: [embed], components: [row] })

       } catch(err) {
       interaction.reply({ content: `There was an error while trying to make that invite.\n${err}`})
       }


	},
};