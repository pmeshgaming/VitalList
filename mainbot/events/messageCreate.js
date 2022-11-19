module.exports = {
  async run(client, message) {
    if (!message.author.bot || !message.guild) return;
    if (!message.content.toLowerCase().startsWith(global.config.bot.prefix)) return;
    if (message.guild.id !== global.config.guilds.main) return;
    let args = message.content.split(" ");
    let command = args.shift().slice(global.config.bot.prefix.length).toLowerCase();
    let cmd = client.commands.get(command);
    if (!cmd) return;
    try {
      cmd.run(client, message, args);
    } catch (error) {
      console.error(error);
    }
  },
};
