const roles = {
  "r1": "1006653826843029654",
  "r2": "1006653433970958376",
  "r3": "1006653765920755825"
}

module.exports = {
  async run(client, interaction) {
    if (interaction.isButton()) {
      if (["r1", "r2", "r3"].includes(interaction.customId)) {
        await interaction.deferReply({ ephemeral: true }).catch(() => null);
        let roleId = roles[interaction.customId];
        let role = interaction.guild.roles.resolve(roleId);
        if (!role) return interaction.editReply(`I was unable to find that role in the server (${roleId})`).catch(() => null);
        if (interaction.member.roles.cache.has(role.id)) {
          let r = await interaction.member.roles.remove(role.id).catch(e => e);
          if (r instanceof Error) {
            console.log(r);
            return interaction.editReply(`I was unable to remove you from the role.`).catch(() => null);
          };
          return interaction.editReply(`The role **${role.name}** was successfully removed from you.`).catch(() => null);
        };
        let r = await interaction.member.roles.add(role.id).catch(e => e);
        if (r instanceof Error) {
          console.log(r);
          return interaction.editReply(`I was unable to add you to the role.`).catch(() => null);
        };
        return interaction.editReply(`The role **${role.name}** was successfully added to you.`).catch(() => null);
      }
    }
  },
};