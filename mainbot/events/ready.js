const { EmbedBuilder } = require('discord.js');
const { model } = require('mongoose');
const model1 = require('../../src/models/bot.js')
module.exports = {
    name: 'ready',
    async run(client, message, args) {
        const bots = await model1.find();
        global.logger.system(`${client.user.tag} is online and ready.`);
        client.user.setActivity(`vitallist.xyz | ${bots.length} bots.`, { type: 3 })
        
        const lb_message = await client.channels.cache.get(global.config.channels.leaderboard).messages.fetch("1008537121637814363");

        setInterval(async () => {
            const model = require("../../src/models/user.js");
            const users = await model.find({}).sort({ xp: -1}).limit(10)
            const filtered = users.filter(user => user.xp > 0);
            const sorted = filtered.sort((a, b) => b.level - a.level || b.xp - a.xp);
            const list = sorted.map((user, i) => `${i + 1}. **${user.username}** | **Level:** ${user.level} | **XP:** ${user.xp}`).join("\n")

            const embed = new EmbedBuilder()
            .setTitle(`Top 10 Leaderboard`)
            .setDescription(`${list}`)
            .setColor('Random')
            .setThumbnail(lb_message.guild.iconURL())
            .setTimestamp()
            .setFooter({ text: lb_message.guild.name+" - Live Leaderboard | Updated", iconURL: "https://vitallist.xyz/img/icon.png"})
            await lb_message.edit({embeds: [embed]});
        }, 1200000);
        /*
        const model = require("../../src/models/user.js");

        const users = await model.find();
        users.forEach(getUsername)
        */
    }
}

async function getTag(userID) {
    const user = await client.users.fetch(userID);
    if (!user) user = await client.users.fetch(userID, { cache: false, force: true });
    return user.tag;
}
