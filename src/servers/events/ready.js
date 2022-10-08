const { ActivityType } = require("discord.js");

module.exports = {
    name: 'ready',
    async run(message, args) {
        const sclient = global.sclient;

        global.logger.system(sclient.user.tag+` is online and ready.`)
        sclient.user.setActivity('vitallist.xyz/servers', { type: ActivityType.Watching})

    }
}