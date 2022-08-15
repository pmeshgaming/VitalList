module.exports = {
    name: 'help',
    async run(client, message, args) {
        const commands = [];
        client.commands.forEach(command => {
            if (command.name === 'help') return;
            commands.push(command.name);
        });
        return await message.channel.send({content: commands.join(', ')});
    }
}