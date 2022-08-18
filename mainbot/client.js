const client = global.client;
const config = global.config;
const fs = require('fs')
const { join } = require('path')

client.on('guildMemberRemove', async (member) => {
  if (member.guild.id === config.guilds.main) {
    client.channels.cache.get("1006065497562943610").send(`<a:leave:1006511956011790418> \`${member.user.tag}\` has just left the server.`)
  }
})

const cfiles = fs.readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for(const cfile of cfiles) {
  const command = require(join(__dirname, "commands", `${cfile}`))
  client.commands.set(command.name, command);

}

const efiles = fs.readdirSync(join(__dirname, 'events')).filter(file => file.endsWith('.js'));
for(const efile of efiles) {
  const event = require(join(__dirname, "events", `${efile}`))
  const eventName = efile.split(".")[0];
  client.on(eventName, (...args) => event.run(client, ...args));
}