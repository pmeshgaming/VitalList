const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "help",
  async run(client, message, args) {
    const commands = client.commands.filter(c => c.name !== "help").map(c => `**${c.name}** - ${c.description}`)
    const embed = new EmbedBuilder()
      .setTitle("VitalList Help")
      .setDescription(commands.join("\n"))
      .setFooter({
        text: `${message.guild.name} - Help Command`,
        iconURL: message.guild.iconURL(),
      });
    return message.channel.send({ embeds: [embed] });
  },
};
