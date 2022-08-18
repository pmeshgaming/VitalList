module.exports = {
    async run(client, member) {
        const config = global.config;
        if (member.guild.id === config.guilds.main) {
            if(!member.user.bot) member.roles.add(config.roles.members)
            if (member.user.bot) member.roles.add(config.roles.bots)
            client.channels.cache.get("1006065497562943610").send(`<:add:1006511788155752558> \`${member.user.tag}\` has just joined the server!`)

        }
    }
}