
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const ms = require("ms")
const model = require("../../models/server.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bump')
		.setDescription('Bumps this server on VitalServers.'),
	async execute(interaction) {
	
                let server = await model.findOne({
                    id: interaction.guild.id
                });
                if(!server) return interaction.repy("This server was not found on VitalServers.");
            
                let cooldown = 1800000;
                let lastDaily = server.bump;
                if (cooldown - (Date.now() - lastDaily) > 0) {
                    let timeObj = ms(cooldown - (Date.now() - lastDaily), { long: true }); 
                  return await interaction.reply(`This server cannot be bumped just yet.\nCome back in ${timeObj}.`);
                } else {

                await model.updateOne({ 
			    	id: interaction.guild.id 
			      }, { 
			    	$set: { 
			    		bump: new Date().getTime()
			    	}
			   	  })
		          await model.updateOne({ 
			    	id: interaction.guild.id 
			      }, { 
			    	$inc: { 
			    		bumps: 1
			    	}
			   	  })

                const ServerRaw = (await global.sclient.guilds.fetch(interaction.guild.id)) || null;
                server.name = ServerRaw.name;
                server.icon = ServerRaw.iconURL();
            
                const logs = global.sclient.channels.cache.get(global.config.channels.weblogs);
                  const date = new Date();
                  const votedEmbed = new EmbedBuilder()
                  .setTitle("Server Bumped")
                  .setDescription("<:vote:1028862219313762304> " + server.name + " has been bumped on VitalServers.")
                  .setColor("Aqua")
                  .addFields({ name: "Server", value: `[${server.name}](https://vitallist.xyz/servers/${server.id})`, inline: true})
                  .addFields({ name: "Bumper", value: `[${interaction.user.username}#${interaction.user.discriminator}](https://vitallist.xyz/users/${interaction.user.id})`, inline: true})
                  .addFields({ name: "Date", value: `${date.toLocaleString()}`, inline: true})
                  .setFooter({ text: "Bump Logs - VitalServers", iconURL: `${global.sclient.user.displayAvatarURL()}`})
                  logs.send({ embeds: [votedEmbed] })
        
                   const embed = new EmbedBuilder()
                   .setTitle('Successful Bump')
                   .setDescription('You have successfully bumped this server to the top of [VitalServers](https://vitallist.xyz/servers).')
                   .setFooter({ text: `VitalServers - Bump Command`, iconURL: `${global.sclient.user.displayAvatarURL()}`})
        
                   const row = new ActionRowBuilder()
                    .addComponents(
                     new ButtonBuilder()
                    .setURL(`https://vitallist.xyz/servers/${interaction.guild.id}`)
                     .setLabel('View Server Page')
                    .setStyle(ButtonStyle.Link)
                        );
        
            interaction.reply({ embeds: [embed], components: [row]})

        };
	},
};