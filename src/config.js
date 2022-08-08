const dotenv = require('dotenv')
dotenv.config();

module.exports = {
    port: 80,
    staff: ["529815278456930314", "926929432243994626"],
    owners: ["926929432243994626", "529815278456930314"],
    mongo: process.env.mongo,
    bot: {
        id: "1004263717355126845",
        secret: process.env.secret,
        redirect: "http://localhost/auth/callback",
        token: process.env.token
    },
    servers: {
      token: process.env.stoken
    },
    guilds: {
      main: '937131743205543947',
      testing: '937131743205543947'
    },
    roles: {
      mod: '',
      admin: '',
      developer: '1004265446125617203',
      bots: '1004265398226657292',
      bottester: '953029305305280512'
    },
    channels: {
     weblogs: '1004261651035455538',
     modlogs: '1004262049414647809'
     }
     
}