module.exports = {
    name: 'level',
    async run(client, message, args) {
        return message.channel.send({content: `You are currently level ${message.member.roles.cache.some((role) => role.id == "1006653826843029654") ? "1" : "2"}`})
    }
}
