module.exports = {
    name: 'ping',
    async run(client, message, args) {
        return await message.reply({ content: `:ping_pong: Ping: \`${client.ws.ping}ms\`` });
    }
}