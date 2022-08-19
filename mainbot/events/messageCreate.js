module.exports = {
     async run(client, message) {
        const config = global.config;
        const prefix = config.bot.prefix;
        const model = require("../../src/models/user.js");
        if (message.author.bot) return; 
        if (message.channel.type === "dm") return;
        if (message.guild.id != "1006065494257848433") return;
        let user = await model.findOne({ id: message.author.id});
        if(!user) return await model.create({ id: message.author.id, username: message.author.username, xp: 1 });
        user.xp = 1 + user.xp;
        await user.save();
        if (user.xp % 50 === 0) {
            user.xp = 0;
            user.level = user.level + 1;
            await user.save();
            //client.channels.cache.get(config.channels.levelup).send(`GG <@${message.author.id}>, You have leveled up to level ${user.level}!`)
        }
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