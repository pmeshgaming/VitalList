const client = global.sclient;
const config = global.config;
const logger = global.logger;
const { EmbedBuilder } = require('discord.js');

client.on('ready', () => {
    logger.system(`${client.user.tag} is online and ready.`)
    client.user.setActivity("VitalServers.xyz")
})