const dotenv = require('dotenv')
dotenv.config();

module.exports = {
    port: 80,
    staff: ["529815278456930314", "700609775838298113", "272442568275525634", "324646179134636043", "966504857718644826"],
    owners: ["529815278456930314", "700609775838298113"],
    developers: ["529815278456930314", "700609775838298113", "272442568275525634"],
    betatesters: ["529815278456930314", "272442568275525634"],
    mongo: process.env.mongo,
    bot: {
        id: "1004263717355126845",
        prefix: "v!",
        secret: process.env.secret,
        redirect: "http://localhost/auth/callback",
        token: process.env.token
    },
    servers: {
      prefix: "vs!",
      apikey: process.env.apikey,
      token: process.env.stoken
    },
    guilds: {
      main: '1006065494257848433',
      testing: '1006248338380820531'
    
    },
    roles: {
      mod: '1006507906352545792',
      admin: '1006665897118806086',
      developer: '1006065897456283730',
      partner: '1031727870046904342',
      bots: '1009640898159714304',
      bottester: '953029305305280512',
      members: '1006067703238369291',
      botsintesting: '1006664369372938280',
    },
    levels: {
      five: "1007058570879180851",
    },
    channels: {
      weblogs: '1006247458906591372',
      levelup: '1007055641199779910',
      modlogs: '1006247811613982791',
      leaderboard: '1008533581238374430',
      testingcategory: "1006664887084273685"
    },
    tags: {
      servers: ['Community', 'Development', 'BotList', "ServerList", 'Soical', 'Gaming', 'Fun', 'Emotes', 'Streaming', 'Anime', 'Memes'],
      bots: ['Moderation', 'Fun', 'Economy', 'Leveling', 'Utilities', 'Logging', 'Music', 'Anime', 'Memes',]
    }
     
} 
