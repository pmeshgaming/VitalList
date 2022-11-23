module.exports = {
    name: 'purge',
    description: 'Moderation command to delete a amount of messages quickly.',
    async run(client, message, args) {
        if (!message.member.roles.cache.some((role) => role.id === "1006067106070147154")) return message.channel.send("Who do you think you're fooling? You anit no moderator.");

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