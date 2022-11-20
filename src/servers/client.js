const sclient = global.sclient;
const fs = require("node:fs");
const { REST } = require("@discordjs/rest");
const { join } = require("node:path");
const { Collection, Routes } = require("discord.js");

sclient.on("guildCreate", async (guild) => {
  const clientId = "1004264023111507979";
  const guildId = guild.id;

  const commands = [];
  const commandsPath = join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }
  const rest = new REST({ version: "10" }).setToken(global.config.servers.token);

  (async () => {
    try {
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
    } catch (error) {
      console.error(error);
    }
  })();
});

sclient.commands = new Collection();
const commandsPath = join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = require(filePath);
  sclient.commands.set(command.data.name, command);
}

//-Events-//

const efiles = fs
  .readdirSync(join(__dirname, "events"))
  .filter((file) => file.endsWith(".js"));
for (const efile of efiles) {
  const event = require(join(__dirname, "events", `${efile}`));
  const eventName = efile.split(".")[0];
  sclient.on(eventName, (...args) => event.run(sclient, ...args));
}
