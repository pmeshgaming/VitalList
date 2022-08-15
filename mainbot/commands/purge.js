module.exports = {
    name: 'purge',
    async run(client, message, args) {
        if(!global.config.owners.includes(message.author.id)) return;
        if(!args[0]) return message.reply({ content: `:x: You must provide a number of messages to delete.` });
        let amount = parseInt(args[0]);
        if(isNaN(amount)) return message.reply({ content: `:x: You must provide a number of messages to delete.` });
        if(amount > 100) return message.reply({ content: `:x: You can only delete up to 100 messages at a time.` });
        if(amount < 1) return message.reply({ content: `:x: You must provide a number of messages to delete.` });
        await message.channel.messages.fetch({ limit: amount }).then(messages => {
            message.channel.bulkDelete(messages);
        });
    }
}