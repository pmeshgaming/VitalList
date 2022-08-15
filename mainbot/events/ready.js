module.exports = {
    name: 'ready',
    async run(client, message, args) {
        global.logger.system(`${client.user.tag} is online and ready.`);
        client.user.setActivity("Stalking")
    }
}