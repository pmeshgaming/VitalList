module.exports = {
  async run(client, interaction) {
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
  },
};

// you need to catch the errors
