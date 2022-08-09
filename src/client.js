const client = global.client;
const config = global.config;
const logger = global.logger;
const { EmbedBuilder } = require('discord.js');
const model = require("./models/bot.js")
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

    if (command === prefix+'ping') {
     await message.reply({ content: `:ping_pong: Ping: \`${client.ws.ping}ms\`` });
  }
      if (command === prefix+'eval') {

        if (!config.owners.includes(message.author.id)) {
          return message.reply("You do not have permission to use this command.")
        } 
    
   if(!args[0]) {
    return message.reply("You must provide code to eval.")
   }

    let evaled;
    try {
      evaled = await eval(args.join(' '));
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