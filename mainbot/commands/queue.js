const { EmbedBuilder, inlineCode } = require("@discordjs/builders");
const { EmbedBuild } = require("discord.js")

module.exports = {
    name: "queue",
    aliases: ["q"],
    description: "Check the bot queue of VitalList.",
    async run(client, message, args) {

        if (!message.member.roles.cache.some((role) => role.id === global.config.roles.mod)) return message.channel.send("Who do you think you're fooling? You anit no moderator.");

        let x = await global.botModel.find();
        let bots = x.filter(x => x.tested === false);
        let awaitingApprovalBots = x.filter(x => x.tested === false && x.inprogress === false);
        let InProgressBots = x.filter(x => x.inprogress === true);
        const embed = new EmbedBuilder()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setDescription(`**There are ${bots.length || "0"} bot(s) in queue.**`)
        .addFields({ name: "Awaiting Approval", value: `${!awaitingApprovalBots ? "" : awaitingApprovalBots.map(a => "<@"+a.id+"> \`("+a.id+")\` Owner: <@"+a.owner+"> | [Start Testing](https://vitallist.xyz/queue)").join("\n") || "There are no bots awaiting approval, what a shame."}`} )
        .addFields({ name: "In Progress", value: `${!InProgressBots ? "" : InProgressBots.map(a => "<@"+a.id+"> \`("+a.id+")\` Owner: <@"+a.owner+"> | [Approve](https://vitallist.xyz/bots/"+a.id+"/approve) | [Deny](https://vitallist.xyz/bots/"+a.id+"/deny)").join("\n") || "There are no bots in queue, what a shame."}`})
        .setFooter({ text: "VitalList - Queue command", iconURL: client.user.displayAvatarURL() })
        message.reply({ embeds: [embed] })
    },
  };
  