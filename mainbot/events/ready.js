const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'ready',
    async run(client, message, args) {
        global.logger.system(`${client.user.tag} is online and ready.`);
        client.user.setActivity("Stalking")

        const lb_message = await client.channels.cache.get(global.config.channels.leaderboard).messages.fetch("1008537121637814363");
        setInterval(async () => {
            console.log('e')
            const model = require("../../src/models/user.js");
            const users = await model.find({}).sort({ xp: -1 }).limit(10)
            const sorted = users.sort((a, b) => b.xp - a.xp);
            const flitered = sorted.map(x => x.xp).sort((a, b) => b - a)
            const embed = new EmbedBuilder()
            .setTitle(`Top 10 Leaderboard`)
            .setDescription(`${flitered.map((x, i) => `${i + 1}. ${client.users.fetch(users.find(y => y.xp == x).id, {force: true})}`).join('\n')}`)
            //Promise "error"
            .setColor('Random')
            .setThumbnail(lb_message.guild.iconURL())
            .setTimestamp()
        lb_message.edit({embeds: [embed]});
        }, 3000);
        

    }
}
