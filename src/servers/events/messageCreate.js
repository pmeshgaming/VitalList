module.exports = {
  async run(client, message) {
    let prefix = global.config.servers.prefix;
    if (message.author.bot) return;
    const content = message.content.toLowerCase();
    if (!content.startsWith(prefix)) return;
    if (content.startsWith(`${prefix}ping`)) return message.reply(`:ping_pong: Ping: \`${client.ws.ping}ms\``);
  },
};
