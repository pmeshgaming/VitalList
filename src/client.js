const client = global.client;
const config = global.config;
const logger = global.logger;
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { inspect } = require('util');

client.on('ready', () => {
    logger.system(`${client.user.tag} is online and ready.`);
    client.user.setActivity("Stalking")
})

client.on('guildMemberAdd', async (member) => {
  if (member.guild.id === config.guilds.main) {
    member.roles.add(config.roles.members)
    client.channels.cache.get("1006065497562943610").send(`<:add:1006511788155752558> \`${member.user.tag}\` has just joined the server!`)
  }
})

client.on('guildMemberRemove', async (member) => {
  if (member.guild.id === config.guilds.main) {
    client.channels.cache.get("1006065497562943610").send(`<a:leave:1006511956011790418> \`${member.user.tag}\` has just left the server.`)
  }
})

client.on("messageCreate", async (message) => {
  const prefix = config.bot.prefix;
  const args = message.content.split(' ');
  const command = args.shift().toLowerCase();
  if(message.author.bot) return;
  if(!message.content.startsWith(prefix)) return;
  if(message.channel.type === "dm") return;
  if (command === prefix+'ping') return await message.reply({ content: `:ping_pong: Ping: \`${client.ws.ping}ms\`` });
  if (command === prefix+'eval') {
    if (!config.owners.includes(message.author.id)) return message.reply("You do not have permission to use this command.")
    if(!args[0]) return message.reply("You must provide code to eval.")
    let evaled;
    try {
      evaled = await eval(args.join(' '));
      if (evaled == client.token) return message.reply("Stop trying to get my token, this is why your dad left.")
  
      if (typeof evaled !== 'string') {
        evaled = inspect(evaled);
        message.channel.send(evaled, { code: 'js' });
      }
      message.channel.send("```js\n"+inspect(evaled)+"```");
    }
    catch (error) {
      console.error(error);
      message.reply('There was an error during evaluation.');
    }

 } 
 if(command === prefix+"purge") {

  let errorEmbed = new EmbedBuilder()
  .setTitle('Error!')
  .setDescription("Please provide a number between 2 and 99 for the number of messages to delete.")
  .setTimestamp()

    const deleteCount = parseInt(args[0]);


    if(!deleteCount || deleteCount < 2 || deleteCount > 99)

      return message.channel.send({ embeds: [errorEmbed] });

    
    const fetched = await message.channel.messages.fetch({limit: deleteCount + 1});

    message.channel.bulkDelete(fetched)
 }
})

client.on('messageCreate', async message => {
const config = global.config;
const prefix = config.bot.prefix;
const model = require("./models/user.js");

  if (message.author.bot) return; 
  if (message.content.startsWith(prefix)) return;

  let user = await model.findOne({ id: message.author.id});
  if(!user) return await model.create({ id: message.author.id, messages: 1 });
  
  user.messages = user.messages + 1;
 await user.save();

 if(user.messages == 25) {
    user.level = 1;
    await user.save();
  client.channels.cache.get(config.channels.levelup).send(`GG <@${message.author.id}>, You have leveled up to level 1!`)
}
if(user.messages == 50) {
  user.level = 2;
  await user.save();
client.channels.cache.get(config.channels.levelup).send(`GG <@${message.author.id}>, You have leveled up to level 2!`)
}
if(user.messages == 75) {
  user.level = 3;
  await user.save();
client.channels.cache.get(config.channels.levelup).send(`GG <@${message.author.id}>, You have leveled up to level 3!`)
}
if(user.messages == 100) {
  user.level = 4;
  await user.save();
client.channels.cache.get(config.channels.levelup).send(`GG <@${message.author.id}>, You have leveled up to level 4!`)
}
if(user.messages == 125) {
  user.level = 5;
  await user.save();
message.author.roles.add(config.levels.five)
client.channels.cache.get(config.channels.levelup).send(`GG <@${message.author.id}>, You have leveled up to level 5!`)
}
 
  })

//-Button Roles-//
client.on("interactionCreate", async (interaction) => {
  const r1 = "1006653826843029654";
  const r2 = "1006653433970958376";
  const r3 = "1006653765920755825";

  if (interaction.isButton()) {
    if (interaction.customId == "r1") {
      if (interaction.member.roles.cache.some((role) => role.id == r1)) {
        interaction.reply({
          content: `The role **Sneak Peaks** was successfully removed from you.`,
          ephemeral: true,
        });
        interaction.member.roles.remove(r1);
      } else {
        interaction.member.roles.add(r1);
        await interaction.reply({
          content: `The role **Sneak Peaks** was successfully added to you.`,
          ephemeral: true,
        });
      }
    } else if (interaction.customId == "r2") {
      if (interaction.member.roles.cache.some((role) => role.id == r2)) {
        interaction.reply({
          content: `The role **Announcements** was successfully removed from you!`,
          ephemeral: true,
        });
        interaction.member.roles.remove(r2);
      } else {
        interaction.member.roles.add(r2);
        await interaction.reply({
          content: `The role **Announcements** was successfully added to you!`,
          ephemeral: true,
        });
       }
      } else if (interaction.customId == "r3") {
        if (interaction.member.roles.cache.some((role) => role.id == r3)) {
          interaction.reply({
            content: `The role **Website Status** was successfully removed from you!`,
            ephemeral: true,
          });
          interaction.member.roles.remove(r3);
        } else {
          interaction.member.roles.add(r3);
          await interaction.reply({
            content: `The role **Website Status** was successfully added to you!`,
            ephemeral: true,
          });
        }
    }
  }
});