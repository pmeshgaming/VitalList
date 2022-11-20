module.exports = {
  name: "ping",
  description: "Check the bots ping. (Delay)",
  async run(client, message, args) {
    return message.reply(`:ping_pong: Ping: \`${client.ws.ping}ms\``);
  },
};
