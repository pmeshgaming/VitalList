const { EmbedBuilder } = require('discord.js');
const { model } = require('mongoose');
const model1 = require('../../src/models/bot.js')
module.exports = {
    name: 'ready',
    async run(client, message, args) {
        const bots = await model1.find();
        global.logger.system(`${client.user.tag} is online and ready.`);
        client.user.setActivity(`vitallist.xyz | ${bots.length} bots.`, { type: 3 })
    }
}