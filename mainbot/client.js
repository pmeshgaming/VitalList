const client = global.client;
const { readdirSync } = require("node:fs");
const { join } = require("node:path");
const getFiles = (path) => readdirSync(join(__dirname, path)).filter((file) => file.endsWith(".js"));


for (const cfile of getFiles("commands")) {
  const command = require(join(__dirname, "commands", `${cfile}`));
  client.commands.set(command.name, command);
  if (command.aliases) command.aliases.forEach(alias => client.aliases.set(alias, command.name));
}

for (const efile of getFiles("events")) {
  const event = require(join(__dirname, "events", `${efile}`));
  const eventName = efile.split(".")[0];
  client.on(eventName, (...args) => event.run(client, ...args));
}
