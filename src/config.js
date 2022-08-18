const dotenv = require('dotenv')
dotenv.config();

module.exports = {
    port: 80,
    staff: ["529815278456930314", "700609775838298113"],
    owners: ["529815278456930314", "700609775838298113"],
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
      token: process.env.stoken
    },
    guilds: {
      main: '1006065494257848433',
      testing: '1006248338380820531'
    },
    roles: {
      mod: '',
      admin: '',
      developer: '1006065897456283730',
      bots: '1009640898159714304',
      bottester: '953029305305280512',
      members: '1006067703238369291',
    },
    levels: {
    five: "1007058570879180851",
    },
    channels: {
     weblogs: '1006247458906591372',
     levelup: '1007055641199779910',
     modlogs: '1006247811613982791',
     leaderboard: '1008533581238374430',
     }
     
}