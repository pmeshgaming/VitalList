const client = global.sclient;
const config = global.config;
const logger = global.logger;
const { EmbedBuilder } = require('discord.js');

client.on('ready', () => {
    logger.system(`${client.user.tag} is online and ready.`)
    client.user.setActivity("VitalServers")
})

client.on("messageCreate", async (message) => {
    const prefix = config.servers.prefix;
    const args = message.content.split(' ');
     const command  = args.shift().toLowerCase();
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (message.channel.type === "dm") return;
      if(message.author.bot) return;
       if(!message.content.startsWith(prefix)) return;
      if (command === prefix+'ping') {
       await message.reply({ content: `:ping_pong: Ping: \`${client.ws.ping}ms\`` });
    }
  })