const client = global.client;
const config = global.config;
const logger = global.logger;
const { EmbedBuilder } = require('discord.js');
const model = require("./models/bot.js")
const { inspect } = require('util');

client.on('ready', () => {
    logger.system(`${client.user.tag} is online and ready.`);
    client.user.setActivity("VitalList")
})

client.on("messageCreate", async (message) => {
  const args = message.content.split(' ');
   const command = args.shift().toLowerCase();
    if(message.author.bot) return;
     if(!message.content.startsWith("!")) return;

    if (command === '!ping') {
     await message.reply({ content: `:ping_pong: Ping: \`${client.ws.ping}ms\`` });
  }
      if (command === '!eval') {

        if (!config.owners.includes(message.author.id)) {
          return message.reply("You do not have permission to use this command.")
        } 
    
   if(!args[1]) {
    return message.reply("You must provide code to eval.")
   }

    let evaled;
    try {
      evaled = await eval(args.join(' '));
      message.channel.send(inspect(evaled));
    }
    catch (error) {
      console.error(error);
      message.reply('There was an error during evaluation.');
    }

 } //else if

})