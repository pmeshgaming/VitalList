const client = global.client;
const config = global.config;
const logger = global.logger;
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const { inspect } = require('util');
const canvacord = require('canvacord');
const fs = require('fs')
const { join } = require('path')

client.on('ready', () => {
    logger.system(`${client.user.tag} is online and ready.`);
    client.user.setActivity("Stalking")
})

client.on('guildMemberAdd', async (member) => {
  if (member.guild.id === config.guilds.main) {
    member.roles.add(config.roles.members)
    client.channels.cache.get("1006065497562943610").send(`<:add:1006511788155752558> \`${member.user.tag}\` has just joined the server!`)
  }
})

client.on('guildMemberRemove', async (member) => {
  if (member.guild.id === config.guilds.main) {
    client.channels.cache.get("1006065497562943610").send(`<a:leave:1006511956011790418> \`${member.user.tag}\` has just left the server.`)
  }
})

client.on("messageCreate", async (message) => {
  const prefix = config.bot.prefix;
  const args = message.content.split(' ');
  const command = args.shift().toLowerCase();
  if(message.author.bot) return;
  if(!message.content.startsWith(prefix)) return;
  if(message.channel.type === "dm") return;

 if(command === prefix+"purge") {

  let errorEmbed = new EmbedBuilder()
  .setTitle('Error!')
  .setDescription("Please provide a number between 2 and 99 for the number of messages to delete.")
  .setTimestamp()

    const deleteCount = parseInt(args[0]);


    if(!deleteCount || deleteCount < 2 || deleteCount > 99)

      return message.channel.send({ embeds: [errorEmbed] });

    
    const fetched = await message.channel.messages.fetch({limit: deleteCount + 1});

    message.channel.bulkDelete(fetched)
 }
 if(command === prefix+"level") {
  let model = require("../src/models/user.js")

  let user = await model.findOne({ id: message.author.id })
  if (!user) {
    user = new model({
      id: message.author.id,
      xp: 0,
      level: 0,
    })
    user.save()
  }
  const img = message.author.displayAvatarURL();
  let level = user.level + 1;
  let flitered = await model.find({}).sort({ xp: -1 }).limit(10)
  let sorted = flitered.map(x => x.xp).sort((a, b) => b - a)
  let rank = sorted.splice(0, message.guild.memberCount)
  let rankIndex = rank.indexOf(user.xp) + 1
  const userrank = new canvacord.Rank()
      .setAvatar(img)
      .setCurrentXP(user.xp)
      .setRequiredXP(level * 50)
      .setStatus("online")
      .setLevel(user.level)
      .setRank(rankIndex)
      .setProgressBar("#FFFFFF", "COLOR")
      .setUsername(message.author.username)
      .setDiscriminator(message.author.discriminator);
  
  userrank.build()
      .then(data => {
          const attachment = new AttachmentBuilder(data, {name: "RankCard.png" });
          message.reply({ files: [attachment] });
      });
    }
  });

const cfiles = fs.readdirSync('./mainbot/commands').filter(file => file.endsWith('.js'));
for(const cfile of cfiles) {
  const command = require(join(__dirname, "commands", `${cfile}`))
  client.commands.set(command.name, command);

}

const efiles = fs.readdirSync('./mainbot/events').filter(file => file.endsWith('.js'));
for(const efile of efiles) {
  const event = require(join(__dirname, "events", `${efile}`))
  const eventName = efile.split(".")[0];
  client.on(eventName, (...args) => event.run(client, ...args));
}