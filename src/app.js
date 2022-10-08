const logger = require('../functions/logger');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const fetch = (...args) =>
    import ("node-fetch").then(({
        default: fetch
    }) => fetch(...args));
const mongoose = require("mongoose");
const config = global.config;
global.logger = logger;
const path = require("path");
const express = require("express"),
    session = require("express-session"),
    passport = require("passport"),
    Strategy = require('passport-discord').Strategy;
app = express();
const SQLiteStore = require('connect-sqlite3')(session);

const {
    inspect
} = require("util");

//-Database Login-//

try {
    mongoose
        .connect(config.mongo)
        .then(logger.system("Mongoose connected."));
} catch (error) {
    logger.error(error);
}

//-Webserver-//

app = express();

app.use(require("express").json());
app.use(require("express").urlencoded({
    extended: false
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/static"));
app.set("views", path.join(__dirname, "pages"));
app.disable('x-powered-by');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://localhost');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    if (req.method === 'OPTIONS') {
        res.status(200).send();
    } else {
        next();
    }
});

//-Alaways use protection!-//

var minifyHTML = require("express-minify-html-terser");
app.use(
    minifyHTML({
        override: true,
        exception_url: false,
        htmlMinifier: {
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeEmptyAttributes: true,
            minifyJS: true,
        },
    })
);

//-Passport Discord-//

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

var scopes = ["identify", "guilds.join"];
var prompt = "consent";

passport.use(
    new Strategy({
            clientID: config.bot.id,
            clientSecret: config.bot.secret,
            callbackURL: config.bot.redirect,
            scope: scopes,
            prompt: prompt,
        },
        function(accessToken, _refreshToken, profile, done) {
            process.nextTick(function() {
                profile.tokens = {
                    accessToken
                };
                return done(null, profile);
            });
        }
    )
);

app.use(
    session({
        store: new SQLiteStore,
        secret: "SupersercetratioskklnkWiOndy",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());

app.use(passport.session());

app.get(
    "/auth/login",
    passport.authenticate("discord", {
        scope: scopes,
        prompt: prompt
    }),
    function(_req) {}
);

app.get(
    "/auth/callback",
    passport.authenticate("discord", {
        failureRedirect: "/"
    }),
    function(req, res) {
        const config = global.config;
        const client = global.client;

        try {
            fetch(`https://discordapp.com/api/v8/guilds/${config.guilds.main}/members/${req.user.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    access_token: req.user.accessToken
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bot ${client.token}`
                },
            });
        } catch {}

        res.redirect(req.session.backURL || "/");
    }
);

app.get('/info', async(req, res) => {
    return res.json(req.user);

})

app.get("/auth/logout", function(req, res) {
    req.logout(() => {
        res.redirect("/");
    });
});

/*app.get("/arc-sw.js", function(req, res) {
    res.send('!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=93)}({3:function(t,e,n){"use strict";n.d(e,"a",(function(){return r})),n.d(e,"c",(function(){return o})),n.d(e,"g",(function(){return i})),n.d(e,"j",(function(){return a})),n.d(e,"i",(function(){return d})),n.d(e,"b",(function(){return f})),n.d(e,"k",(function(){return u})),n.d(e,"d",(function(){return p})),n.d(e,"e",(function(){return l})),n.d(e,"f",(function(){return m})),n.d(e,"h",(function(){return v}));var r={images:["bmp","jpeg","jpg","ttf","pict","svg","webp","eps","svgz","gif","png","ico","tif","tiff","bpg","avif","jxl"],video:["mp4","3gp","webm","mkv","flv","f4v","f4p","f4bogv","drc","avi","mov","qt","wmv","amv","mpg","mp2","mpeg","mpe","m2v","m4v","3g2","gifv","mpv","av1","ts","tsv","tsa","m2t","m3u8"],audio:["mid","midi","aac","aiff","flac","m4a","m4p","mp3","ogg","oga","mogg","opus","ra","rm","wav","webm","f4a","pat"],interchange:["json","yaml","xml","csv","toml","ini","bson","asn1","ubj"],archives:["jar","iso","tar","tgz","tbz2","tlz","gz","bz2","xz","lz","z","7z","apk","dmg","rar","lzma","txz","zip","zipx"],documents:["pdf","ps","doc","docx","ppt","pptx","xls","otf","xlsx"],other:["srt","swf"]},o=["js","cjs","mjs","css"],c="arc:",i={COMLINK_INIT:"".concat(c,"comlink:init"),NODE_ID:"".concat(c,":nodeId"),CLIENT_TEARDOWN:"".concat(c,"client:teardown"),CLIENT_TAB_ID:"".concat(c,"client:tabId"),CDN_CONFIG:"".concat(c,"cdn:config"),P2P_CLIENT_READY:"".concat(c,"cdn:ready"),STORED_FIDS:"".concat(c,"cdn:storedFids"),SW_HEALTH_CHECK:"".concat(c,"cdn:healthCheck"),WIDGET_CONFIG:"".concat(c,"widget:config"),WIDGET_INIT:"".concat(c,"widget:init"),WIDGET_UI_LOAD:"".concat(c,"widget:load"),BROKER_LOAD:"".concat(c,"broker:load"),RENDER_FILE:"".concat(c,"inlay:renderFile"),FILE_RENDERED:"".concat(c,"inlay:fileRendered")},a="serviceWorker",d="/".concat("shared-worker",".js"),f="/".concat("dedicated-worker",".js"),u="/".concat("arc-sw-core",".js"),s="".concat("arc-sw",".js"),p=("/".concat(s),"/".concat("arc-sw"),"arc-db"),l="key-val-store",m=2**17,v="".concat("https://warden.arc.io","/mailbox/propertySession");"".concat("https://warden.arc.io","/mailbox/transfers")},93:function(t,e,n){"use strict";n.r(e);var r=n(3);if("undefined"!=typeof ServiceWorkerGlobalScope){var o="https://arc.io"+r.k;importScripts(o)}else if("undefined"!=typeof SharedWorkerGlobalScope){var c="https://arc.io"+r.i;importScripts(c)}else if("undefined"!=typeof DedicatedWorkerGlobalScope){var i="https://arc.io"+r.b;importScripts(i)}}});', type = 'application/javascript');
  });*/

//-BotList-//

app.get("/", checkMaintenance, async(req, res) => {
    const client = global.client;

    let model = require("./models/bot.js");
    let bots = await model.find({
        approved: true
    });
    let dbots = await model.find({
        denied: false
    });

    for (dbot of dbots) {
        const tendaysago = new Date().getTime() - 10 * 24 * 60 * 60 * 1000;
        if (dbot.deniedOn < tendaysago) {
            dbot.deleteOne()
            dbot.save()
        }
    }

    for (let i = 0; i < bots.length; i++) {
        const BotRaw = await client.users.fetch(bots[i].id);
        bots[i].name = BotRaw.username;
        bots[i].avatar = BotRaw.avatar;
        bots[i].name = bots[i].name.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
        bots[i].tags = bots[i].tags.join(", ")
    }
    Array.prototype.shuffle = function() {
        let a = this;
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };


    res.render("index.ejs", {
        bot: req.bot,
        bots: bots.shuffle(),
        user: req.user || null
    });
})
app.get("/bots", checkMaintenance, async(req, res) => {
    const client = global.client;

    let model = require("./models/bot.js");
    let bots = await model.find({
        approved: true
    });
    let dbots = await model.find({
        denied: false
    });

    for (dbot of dbots) {
        const tendaysago = new Date().getTime() - 10 * 24 * 60 * 60 * 1000;
        if (dbot.deniedOn < tendaysago) {
            dbot.deleteOne()
            dbot.save()
        }
    }

    for (let i = 0; i < bots.length; i++) {
        const BotRaw = await client.users.fetch(bots[i].id);
        bots[i].name = BotRaw.username;
        bots[i].avatar = BotRaw.avatar;
        bots[i].name = bots[i].name.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
        bots[i].tags = bots[i].tags.join(", ")
    }
    Array.prototype.shuffle = function() {
        let a = this;
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };


    res.render("botlist/bots.ejs", {
        bot: req.bot,
        bots: bots.shuffle(),
        user: req.user || null
    });
})

app.get("/bots/new", checkMaintenance, checkAuth, async(req, res) => {
    res.render("botlist/add.ejs", {
        bot: global.client,
        user: req.user || null
    });
})

app.post("/bots/new", checkMaintenance, checkAuth, async(req, res) => {
    const client = global.client;
    const logs = client.channels.cache.get(config.channels.weblogs)
    let model = require("./models/bot.js");
    let data = req.body;

    if (!data) {
        res.redirect('/')
    }

    if (await model.findOne({
            id: data.id
        })) return res.status(409).json({
        message: "This application has already been added to our site."
    });

    const bot = await client.users.fetch(data.id);
    if(!bot) { 
        return res.status(400).json({
            message: "This is not a real application on Discord."
        });
    }
    await model
        .create({
            id: data.id,
            prefix: data.prefix,
            owner: req.user.id,
            desc: data.description.long,
            shortDesc: data.description.short,
            submitedOn: Date.now(),
            views: 0,
            tags: data.tags,
            invite: data.invite,
            support: data.support || null,
            github: data.github || null,
            website: data.website || null
        });
    logs.send("<:VD_add:1006511788155752558> <@" + req.user.id + "> has submitted **" + bot.tag + "** to Vital List.")

    return res.redirect("/?=success");

})

app.get("/bots/:id/invite", async (req, res) => {
    const model = require("./models/bot.js");
    const id = req.params.id;
    const bot = await model.findOne({ id: id });
    if(!bot) return res.status(404).redirect("/404");

    if(!bot.invite) {
     return await res.redirect(`https://discord.com/oauth2/authorize?client_id=${id}&scope=bot%20applications.commands&permissions=8&response_type=code`);
    }

    return await res.redirect(bot.invite);
})

app.get("/bots/:id", checkMaintenance, async(req, res) => {
    let id = req.params.id;
    const client = global.client;
    const model = require("./models/bot.js")
    const bot = await model.findOne({ id: id});
    const guild = await client.guilds.fetch(global.config.guilds.main)
    if(!bot) return res.status(404).send("This bot was not found on our list.");

    try { 
        guild.members.fetch(id) || null;
     } catch(err) {
             return res.status(404).send("This bot is not in our Discord server, so we could not fetch it's data. Error: "+ err);
     }

    const BotRaw = (await client.users.fetch(id)) || null;
    const OwnerRaw = (await client.users.fetch(bot.owner));
    console.log(OwnerRaw)
    const PresenceRaw = await guild.members.fetch(id) || null;
    bot.name = BotRaw.username;
    bot.avatar = BotRaw.avatar;
    bot.presence = PresenceRaw.presence;
    bot.discriminator = BotRaw.discriminator;
    bot.tag = BotRaw.tag;
    bot.ownerTag = OwnerRaw.tag;
    bot.ownerAvatar = OwnerRaw.avatar;
    bot.tags = bot.tags.join(", ")

    res.render("botlist/viewbot.ejs", {
        bot2: req.bot,
        bot: bot,
        user: req.user || null
    });


//-TAG-//
app.get('/tag', async(req, res) => {
    
})
})

//-API-//

app.get('/api/bots/:id', async(req, res) => {
    let model = require("./models/bot.js");
    let data = await model.findOne({
        id: req.params.id
    }).lean().then(rs => {
        if (!rs) return res.status(404).json({
            message: "This bot is not in our database."
        })
        if (!rs.approved) return res.status(404).json({
            message: "This bot is not approved."
        })
        delete rs._id;
        delete rs.__v
        delete rs.approved
        return rs;

    });
    if (!data) return res.status(404).json({
        message: "This bot is not in our database."
    })
    res.end(inspect(data));
})

app.post('/api/bots/:id/', checkKey, async(req, res) => {
    const client = global.client;
    let model = require("./models/bot.js");
    let bot = await model.findOne({
        id: req.params.id
    });
    if (!bot) return res.status(404).json({
        message: "This bot is not on our list."
    });

    if (!req.body.server_count) return res.status(400).json({
        message: "Please provide a server count."
    });
    if (!req.body.shard_count) return res.status(400).json({
        message: "Please provide a shard count."
    });
    bot.servers = req.body.server_count;
    bot.servers = bot.servers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    bot.shards = req.body.shard_count;
    bot.shards = bot.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    bot.save();
    res.json({
        message: "Successfully updated."
    });

})


//-ServerList-//

app.get("/servers", checkMaintenance, checkStaff, async(req, res) => {
    const client = global.sclient;

    let model = require("./models/server.js");
    let servers = await model.find({ published: true });
    for (let i = 0; i < servers.length; i++) {
      const ServerRaw = await client.guilds.fetch(servers[i].id);
      servers[i].name = ServerRaw.name;
      servers[i].icon = ServerRaw.iconURL({ dynamic: true });
      servers[i].memberCount = ServerRaw.memberCount;
      servers[i].boosts = ServerRaw.premiumSubscriptionCount;
      servers[i].tags = servers[i].tags.join(", ")
    }
  
    Array.prototype.shuffle = function () {
      let a = this;
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
  
    res.render("servers/index.ejs", {
      bot: req.bot,
      user: req.user || null,
      servers: servers.shuffle()
    });
});

app.get("/servers/:id", checkMaintenance, async (req, res) => {
    const client = global.sclient;
    const model = require("./models/server.js")
    const id = req.params.id;

    const server = await model.findOne({ id: id })
    if (!server) return res.redirect("/404");

    if (server.published === false) {
     if(!req.user) return res.redirect("/404?error=503");
     if (!server.owner.includes(req.user.id)) return res.redirect("/404?error=503");
    }

    server.views = server.views + 1;
    await server.save();

    //-Cleaning Server Desc-//
 const { marked } = require("marked");
 server.desc = marked.parse(server.desc);

 const ServerRaw = (await client.guilds.fetch(id)) || null;
 (server.name = ServerRaw.name), (server.icon = ServerRaw.iconURL()), 
 (server.memberCount = ServerRaw.memberCount), (server.boosts = ServerRaw.premiumSubscriptionCount);

    res.render("servers/viewserver.ejs", {
     bot: req.bot,
     server: server,
     user: req.user
   });
});

app.get("/servers/:id/join", async (req, res) => {
    const model = require("./models/server.js");
    const id = req.params.id;
    const server = await model.findOne({ id: id });
    if(!server) return res.status(404).redirect("/404");

    if(!server.invite) {
     return await res.send("This server does not have an invite set, please contact the owner or set one with the /invite command in this guild.")
    }

    return await res.redirect(server.invite);
})

app.get("/servers/:id/edit", checkMaintenance, checkAuth, async (req, res) => {
    const client = global.sclient;
    const model = require("./models/server.js")
    const id = req.params.id;
  
    const server = await model.findOne({ id: id })
    if (!server) return res.redirect("/404");
  
    if (!server.owner.includes(req.user.id)) return res.redirect("/");
  
  const ServerRaw = (await client.guilds.fetch(id)) || null;
  
  (server.name = ServerRaw.name), (server.icon = ServerRaw.iconURL()), (server.memberCount = ServerRaw.memberCount)
  
    res.render("servers/editserver.ejs", {
     bot: req.bot,
     server: server,
     user: req.user
   });
});

app.post("/servers/:id/edit", checkAuth, async (req, res) => {
    const sclient = global.sclient;
    const model = require("./models/server.js");
    const id = req.params.id;
    const data = req.body;
  
    const server = await model.findOne({ id: id });
    if (!server) return res.redirect("/404");
    
    const logServer = await model.findOne({ id: id });
  
    if (!server.owner.includes(req.user.id)) return res.redirect("/");
  
    server.shortDesc = data.short_description;
    server.desc = data.long_description;
    server.published = true;
    await server.save();
  
    const ServerRaw = (await sclient.guilds.fetch(server.id)) || null;
    (server.name = ServerRaw.name)
  
    if(logServer.published === false) {
      const logs = sclient.channels.cache.get(global.config.channels.weblogs);
      logs.send({ content: `<@${req.user.id}> published **${server.name}**.`});
      return res.redirect(`https://servers.ofdiscord.com/server/${id}`);
    } else {
      const logs = sclient.channels.cache.get(global.config.channels.weblogs);
      logs.send({ content: `<@${req.user.id}> edited **${server.name}**.`});
      return res.redirect(`https://servers.ofdiscord.com/server/${id}`);
    }
})

//-User Pages-//

app.get("/me", checkAuth, async(req, res) => {
    const user = req.user || null;
    //const response = await fetch(`https://japi.rest/discord/v1/user/${req.user.id}`)
    let umodel = require("./models/user.js");
    let userm = await umodel.findOne({
        id: req.user.id,
    })
    user.bio = userm?.bio || "No bio has been set"
    let model = require("./models/bot.js");
    let bots = await model.find({
        tested: true,
        owner: user.id

    });
    res.render("me.ejs", {
        bot: req.bot,
        bots: bots,
        user: user || null
    });
})

app.get("/users/:id", checkAuth, async(req, res) => {
    const guild = await client.guilds.fetch(global.config.guilds.main);
    let user = (await guild.members.fetch(req.params.id)) || null;
    user = user?.user
    if (user.bot) return res.redirect('/'); 
    if(!user) {
        res.status(404).json({ message: "This user was not found on Discord."})
    }
    
    let umodel = require("./models/user.js");
    let userm = await umodel.findOne({
        id: req.params.id,
    })
    user.bio = userm?.bio || "This user has no bio set."


    let bmodel = require("./models/bot.js");
    let bots = await bmodel.find({
        tested: true,
        owner: req.params.id
    });
    
    res.render("user.ejs", {
        bot: req.bot,
        fetched_user: user,
        user: req.user || null
    });
})

//-Admin Pages-//

app.get("/queue", checkAuth, checkStaff, async(req, res) => {

    const client = global.client;
    const config = global.config;

    let model = require("./models/bot.js");
    let bots = await model.find({
        tested: false
    });
    for (let i = 0; i < bots.length; i++) {
        const BotRaw = await client.users.fetch(bots[i].id);
        bots[i].name = BotRaw.username;
        bots[i].tag = BotRaw.tag;
        bots[i].avatar = BotRaw.avatar;
        bots[i].name = bots[i].name.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
        bots[i].tags = bots[i].tags.join(", ")
    }

    let inprogress = await model.find({
        inprogress: true
    });

    for (let i = 0; i < inprogress.length; i++) {
        const IPRaw = await client.users.fetch(inprogress[i].id);
        const ReviewerRaw = await client.users.fetch(inprogress[i].reviewer);
        inprogress[i].tag = IPRaw.tag;
        inprogress[i].name = IPRaw.username;
        inprogress[i].avatar = IPRaw.avatar;
        inprogress[i].reviewer = ReviewerRaw.tag;
        inprogress[i].tags = inprogress[i].tags.join(", ")
    }

    Array.prototype.shuffle = function() {
        let a = this;
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };

    res.render("queue/index.ejs", {
        bot: req.bot,
        bots: bots.shuffle(),
        config: config,
        user: req.user || null,
        inprogress: inprogress
    });
})

app.get("/bots/:id/approve", checkAuth, checkStaff, async(req, res) => {
    const config = global.config; 
    let model = require("./models/bot.js");
    let bot = await model.findOne({ id: req.params.id });
    if (!bot) return res.status(404).json({
        message: "This application could not be found in our site."
    });
  
    res.render("queue/approve.ejs", {
      bot: req.bot,
      id: req.params.id,
      config: config,
      user: req.user || null
  });
  })

app.get("/bots/:id/deny", checkAuth, checkStaff, async(req, res) => {
  const config = global.config; 
  let model = require("./models/bot.js");
  let bot = await model.findOne({ id: req.params.id });
  if (!bot) return res.status(404).json({
      message: "This application could not be found in our site."
  });
  
  res.render("queue/deny.ejs", {
    bot: req.bot,
    id: req.params.id,
    config: config,
    user: req.user || null
});
})

app.post("/bots/:id/deny", checkAuth, checkStaff, async(req, res) => {
    const config = global.config; 
    const logs = client.channels.cache.get(config.channels.weblogs)
    const BotRaw = await client.users.fetch(req.params.id);
    let model = require("./models/bot.js");
    let bot = await model.findOne({ id: req.params.id });

    if (!bot) return res.status(404).json({
        message: "This application could not be found in our site."
    });
    
    const OwnerRaw = await client.users.fetch(bot.owner);

    bot.tag = BotRaw.tag;
    bot.denied = true;
    bot.tested = true;
    bot.inprogress = false;
    bot.ownerName = OwnerRaw.tag;
    bot.reason = req.body.reason;
    bot.deniedOn = Date.now();
    const date = new Date();

    await bot.save();

    const denyEmbed = new EmbedBuilder()
    .setTitle("Bot Denied")
    .setDescription("<:redcross:1020135034075746404> " + bot.tag + " has been denied on Vital List.")
    .setColor("Red")
    .addFields({ name: "Bot", value: `[${bot.tag}](https://vitallist.xyz/bots/${bot.id})`, inline: true})
    .addFields({ name: "Owner", value: `[${bot.ownerName}](https://vitallist.xyz/usesr/${bot.owner})`, inline: true})
    .addFields({ name: "Reviewer", value: `[${req.user.username}#${req.user.discriminator}](https://vitallist.xyz/users/${req.user.id})`, inline: true})
    .addFields({ name: "Reason", value: `${bot.reason}`, inline: true})
    .addFields({ name: "Date", value: `${date.toLocaleString()}`, inline: true})
    .setFooter({ text: "Deny Logs - VitalList", iconURL: `${global.client.user.displayAvatarURL()}`})
    logs.send({ embeds: [denyEmbed] })
    const channelName = `${BotRaw.username}-${BotRaw.discriminator}`;
    let guild = client.guilds.cache.get(global.config.guilds.testing);
    let channel = await guild.channels.cache.find(c => c.name == channelName.toLowerCase())
    if(channel) channel.delete();
    return res.redirect("/queue?=successfully declined");
  });

app.post('/bots/:id/testing', checkAuth, checkStaff, async(req, res) => {
    let model = require("./models/bot.js");
    let bot = await model.findOne({ id: req.params.id });
    let client = global.client;

    if (!bot) return res.status(404).json({
        message: "This application could not be found in our site."
    });
    const LogRaw = (await client.users.fetch(bot.id)) || null;
    bot.inprogress = true;   
    bot.tested = true;
    bot.reviewer = req.user.id;
    await bot.save();

    res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${bot.id}&scope=bot&permissions=0&guild_id=${global.config.guilds.testing}`)
    let guild = client.guilds.cache.get(global.config.guilds.testing);
    let channel = await guild.channels.create({ name: `${LogRaw.username}-${LogRaw.discriminator}`, reason: `Testing channel for ${LogRaw.tag}.`, parent: global.config.channels.testingcategory })
    const embed = new EmbedBuilder()
    .setTitle("New Testing Session")
    .setDescription(`Welcome to your new testing session for ${LogRaw}.\nYou may now begin testing this bot. Any questions? View the queue page or ask a admin.`)
    .setFooter({ text: "Testing Session - VitalList", iconURL: `${global.client.user.displayAvatarURL()}`})
    const row = new ActionRowBuilder()
    .addComponents(
    new ButtonBuilder()
    .setURL(`https://vitallist.xyz/queue`)
    .setLabel('View Queue')
    .setStyle(ButtonStyle.Link));
    await channel.send({content: `<@${req.user.id}>`, embeds: [embed], components: [row]}) 

})
app.use('/bots/:id/status', checkAuth, checkStaff, async(req, res) => {
    const client = global.client;
    const logs = client.channels.cache.get(config.channels.weblogs)
    const BotRaw = await client.users.fetch(req.params.id);
    let model = require("./models/bot.js");
    let bot = await model.findOne({ id: req.params.id });

    if (!bot) return res.status(404).json({
        message: "This application could not be found in our site."
    });
 
    const OwnerRaw = await client.users.fetch(bot.owner);

    if (req.method === 'POST') {
        bot.tag = BotRaw.tag;
        bot.approved = true
        bot.inprogress = false;
        bot.ownerName = OwnerRaw.tag;
        bot.approvedOn = Date.now();
        bot.tested = true
        await bot.save();
        const date = new Date();

        const approveEmbed = new EmbedBuilder()
    .setTitle("Bot Approved")
    .setDescription("<:greentick:1020134758753255555> "+ bot.tag + " has been approved on Vital List.")
    .setColor("Green")
    .addFields({ name: "Bot", value: `[${bot.tag}](https://vitallist.xyz/bots/${bot.id})`, inline: true})
    .addFields({ name: "Owner", value: `[${bot.ownerName}](https://vitallist.xyz/users/${bot.owner})`, inline: true})
    .addFields({ name: "Reviewer", value: `[${req.user.username}#${req.user.discriminator}](https://vitallist.xyz/users/${req.user.id})`, inline: true})
    .addFields({ name: "Date", value: `${date.toLocaleString()}`, inline: true})
    .setFooter({ text: "Approve Logs - VitalList", iconURL: `${global.client.user.displayAvatarURL()}`})

    logs.send({ embeds: [approveEmbed] })
        return res.redirect("/queue?=successfully approved");
    }
})


//-Error Pages-//
app.all('*', (req, res) => {
    res.status(404)
    res.render("errors/404.ejs", {
        bot: req.bot,
        user: req.user || null
    });

  });

app.all('*', (req, res) => {

    res.status(401)
    res.render("errors/401.ejs", {
        bot: req.bot,
        user: req.user || null
    });
})

app.all('*', (req, res) => {

    res.status(403)
    res.render("errors/403.ejs", {
        bot: req.bot,
        user: req.user || null
    });
})

//-Other Pages-//

app.get("/discord", (_req, res) => res.redirect("https://discord.gg/DWX3d5r2wW"))

app.listen(config.port, () => {
    logger.system(`Running on port ${config.port}.`);
});

//-Functions-//

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.status(401)
}

function checkStaff(req, res, next) {
    const config = global.config;
    if (!config.staff.includes(req.user.id)) return res.render("errors/403.ejs", {
        user: req.user || null
    });
    return next();
}

function checkMaintenance(req, res, next) {
    const config = global.config;
    if (!req.user) return res.render("errors/503.ejs", {
        user: req.user || null
    });
    if (!config.betatesters.includes(req.user.id)) {  
        return res.render("errors/503.ejs", {
        user: req.user || null
    })
} 
    return next();
}

function checkKey(req, req, next) {
    const key = req.body.key || null;
    if (!key) return res.status(401).json({json: "Please provides a API Key"})
    
    let model = require("./models/user.js");
    //apikey check and whatever
    return next();

}