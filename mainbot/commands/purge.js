module.exports = {
    name: 'purge',
    description: 'Moderation command to delete a amount of messages quickly.',
    async run(client, message, args) {
        if(!global.config.staff.includes(message.author.id)) return;
        if(!args[0]) return message.reply({ content: `:x: You must provide a number of messages to delete.` });
        let amount = parseInt(args[0]);
        if(isNaN(amount)) return message.reply({ content: `:x: You must provide a number of messages to delete.` });
        if(amount > 99) return message.reply({ content: `:x: You can only delete up to 99 messages at a time.` });
        if(amount < 1) return message.reply({ content: `:x: You must provide a number of messages to delete.` });
        await message.channel.messages.fetch({ limit: amount+1 }).then(messages => {
            message.channel.bulkDelete(messages);
        });
    }
}