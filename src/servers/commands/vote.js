const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const model = require("../../models/server.js")
const ms = require("ms")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Vote for this server on VitalServers.'),
	async execute(interaction) {
		

		let model = require("../../models/server.js");
		let voteModel = require("../../models/serverVote.js")
		let server = await model.findOne({
			id: interaction.guild.id
		});
		if(!server) return interaction.repl("This server was not found on VitalServers.");
	
		let x = await voteModel.findOne({
			user: interaction.user.id,
			server:  interaction.guild.id
		})
		if(x) {
			let timeObj = ms(x.time - (Date.now() - x.date), { long: true }); 
			 return interaction.reply(`You can only vote once per hour.\nPlease come back in ${timeObj}.`)
		}
	
		await voteModel.create({
			user: interaction.user.id,
			server: interaction.guild.id,
			date: Date.now(),
			time: 3600000  
		})
	
		await model.findOneAndUpdate({
			id: interaction.guild.id
		}, {
			$inc: {
				votes: 1
			}
		})
	
		const ServerRaw = (await global.sclient.guilds.fetch(server.id)) || null;
		server.name = ServerRaw.name;
		server.icon = ServerRaw.iconURL();
	
		const logs = global.sclient.channels.cache.get(global.config.channels.weblogs);
		  const date = new Date();
		  const votedEmbed = new EmbedBuilder()
		  .setTitle("Server Voted")
		  .setDescription("<:vote:1028862219313762304> " + server.name + " has been voted on VitalServers.")
		  .setColor("Purple")
		  .addFields({ name: "Server", value: `[${server.name}](https://vitallist.xyz/servers/${server.id})`, inline: true})
		  .addFields({ name: "Voter", value: `[${interaction.user.username}#${interaction.user.discriminator}](https://vitallist.xyz/users/${interaction.user.id})`, inline: true})
		  .addFields({ name: "Date", value: `${date.toLocaleString()}`, inline: true})
		  .setFooter({ text: "Vote Logs - VitalServers", iconURL: `${global.sclient.user.displayAvatarURL()}`})
		  logs.send({ embeds: [votedEmbed] })

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