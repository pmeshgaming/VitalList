module.exports = {
    name: 'mute',
    description: 'Moderation command for muting bad people.',
    async run(client, message, args) {
        return await message.reply({ content: `Mute Command` });
    }
}