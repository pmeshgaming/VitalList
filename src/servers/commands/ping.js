const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check if the bot is alive and runng."),
  async execute(interaction) {
    return interaction.reply(`:ping_pong: Ping: \`${sclient.ws.ping}ms\``).catch(() => null);
  },
};
