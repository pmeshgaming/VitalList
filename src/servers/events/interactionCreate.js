module.exports = {
  name: "guildCreate",
  async run(sclient, interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = sclient.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.deferred) return interaction.editReply("There was an error while executing this command!").catch(() => null);
      return interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      }).catch(() => null);
    }
  },
};
