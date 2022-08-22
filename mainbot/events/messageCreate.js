module.exports = {
     async run(client, message) {
        const config = global.config;
        const prefix = config.bot.prefix;
        if (message.author.bot) return; 
        if (message.channel.type === "dm") return;
        if (message.guild.id != "1006065494257848433") return;
        let args = message.content.split(" ");
        let command = args.shift().slice(prefix.length).toLowerCase();
        let cmd = client.commands.get(command);
        if (!cmd) return;
        try {
            cmd.run(client, message, args);
        } catch (error) {
            console.error(error);
        }
    }
}