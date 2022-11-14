//-Config Varibles-//
const config = require("./config.js");
var cron = require("node-cron");
global.config = config;
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");

//-Other Files-//
require("./app.js");

//-Main Client-//

const client = new Client({
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: false,
  },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember],
});
client.commands = new Collection();

client.login(config.bot.token);
global.client = client;
require("../mainbot/client.js");

//-ServerList Client-//

const sclient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel, Partials.GuildMember],
});
sclient.login(config.servers.token);
global.sclient = sclient;
require("./servers/client.js");

//Globals
global.voteModel = require("./models/serverVote.js");
global.serverModel = require("./models/server.js");
global.userModel = require("./models/user.js");
global.botModel = require("./models/bot.js");

//Updater
cron.schedule("*/30 * * * *", () => {
  global.voteModel = require("./models/serverVote.js");
  global.serverModel = require("./models/server.js");
  global.userModel = require("./models/user.js");
  global.botModel = require("./models/bot.js");
});


cron.schedule("* * */ 30 * *", async () => {
  let dbots = await global.botModel.find({
    denied: true,
  });
  for (dbot of dbots) {
    const tendaysago = new Date().getTime() - 10 * 24 * 60 * 60 * 1000;
    if (dbots.deniedOn < tendaysago) {
      dbots.deleteOne();
      dbots.save();
    }
  }
  
});
//process.on('unhandledRejection', (reason, promise) => console.log(`Unhandled Rejection at: ${promise} reason: ${reason}`));
//process.on('uncaughtException', (err) => console.log(`Uncaught Exception: ${err}`))
