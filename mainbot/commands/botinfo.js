
const { EmbedBuilder } = require("discord.js");
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
          .setDescription("**[Vote for "+bot.tag+" on VitalList](https://vitallist.xyz/bots/"+bot.id+"/vote)**")
          .addFields({ name: "Prefix:", value: `${data.prefix || "N/A"}`, inline: true})
          .addFields({ name: "Short Desc:", value: `${data.shortDesc || "N/A"}`, inline: true})
          .addFields({ name: "Website:", value: `${data.website || "N/A"}`, inline: true})
          .addFields({ name: "Github:", value: `${data.github || "N/A"}`, inline: true})
          .addFields({ name: "Support:", value: `https://discord.gg/${data.support || "N/A"}`, inline: true})
          .addFields({ name: "Votes:", value: `${data.votes || "N/A"}`, inline: true})
          .addFields({ name: "Servers:", value: `${data.servers || "N/A"}`, inline: true})
          .addFields({ name: "Added on:", value: `${data.submittedOn || "N/A"}`, inline: true})
          .addFields({ name: "Approved on:", value: `${data.approvedOn || "N/A"}`, inline: true})
          .addFields({ name: "Invite:", value: `[Click Me](${data.invite || "N/A"})`, inline: true})
          .addFields({ name: "Tags:", value: `${data.tags.join(", ")}`, inline: true})
          .addFields({ name: "Owner:", value: `${botOwner.tag}`, inline: true})
          .setFooter({ text: "VitalList - BotInfo command", iconURL: global.client.user.displayAvatarURL()})
        message.reply({ embeds: [embed] });
    },
  };
  