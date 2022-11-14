
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
module.exports = {
    name: "botinfo",
    description: "Find info on a specific bot on VitalList.",
    async run(client, message, args) {
        let model = require("../../src/models/bot.js")
        let bot = message.mentions.users.first();
        if(!bot) return message.reply("Please mention a bot on VitalList.")
        let data = await model.findOne({ id: bot.id });
        if(!data) return message.reply("That's not a bot on VitalList.");

          if(!data.website) {
            data.website = "N/A"
          }
          if(!data.github) {
            data.github = "N/A"
          }

         const botOwner = await client.users.fetch(data.owner);

          let embed = new EmbedBuilder()
          .setAuthor({ name: `${bot.tag}`, iconURL: `${bot.displayAvatarURL()}`})
          .setThumbnail(bot.displayAvatarURL())
          .setDescription("**[Vote for "+bot.tag+" on VitalList](https://vitallist.xyz/bots/"+bot.id+"/vote)**.")
          .addFields({ name: "Prefix:", value: `${data.prefix || "N/A"}`, inline: true})
          .addFields({ name: "Servers:", value: `${data.servers || "N/A"}`, inline: true})
          .addFields({ name: "Added on:", value: `<t:${data.submittedOn}:R>`, inline: true})
          .addFields({ name: "Approved on:", value: `<t:${data.approvedOn}:R>`, inline: true})
          .addFields({ name: "Tags:", value: `${data.tags.join(", ")}`, inline: true})
          .addFields({ name: "Owner:", value: `${botOwner.tag}`, inline: true})
          .addFields({ name: "Short Desc:", value: `${data.shortDesc || "N/A"}`, inline: true})
          .setFooter({ text: "VitalList - BotInfo command", iconURL: global.client.user.displayAvatarURL()})
          let row = "hi";

          if(data.invite) {
           row = new ActionRowBuilder()
             .addComponents(
              new ButtonBuilder()
              .setURL(data.invite)
              .setLabel("Invite Link")
              .setStyle(ButtonStyle.Link),

              new ButtonBuilder()
                  .setURL(`https://discord.gg/${data.support}`)
                  .setLabel("Support")
                  .setStyle(ButtonStyle.Link),

                  new ButtonBuilder()
                      .setURL(data.website)
                      .setLabel("Website")
                      .setStyle(ButtonStyle.Link),

                      new ButtonBuilder()
                          .setURL(`https://github.com/${data.github}`)
                          .setLabel("Github")
                          .setStyle(ButtonStyle.Link)

             )}

        message.reply({ embeds: [embed], components: [row] });
    },
  };
  