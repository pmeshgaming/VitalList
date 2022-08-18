const logger = require('../functions/logger');

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const mongoose = require("mongoose");
const config = global.config;
global.logger = logger;
const path = require("path");
const express = require("express"),
  session = require("express-session"),
  passport = require("passport"),
  Strategy = require('passport-discord').Strategy;
  app = express();

const { inspect } = require("util");

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
app.use(require("express").urlencoded({ extended: false }));
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

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

var scopes = ["identify", "guilds.join"];
var prompt = "consent";

passport.use(
  new Strategy(
    {
      clientID: config.bot.id,
      clientSecret: config.bot.secret,
      callbackURL: config.bot.redirect,
      scope: scopes,
      prompt: prompt,
    },
    function (_accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  )
);

app.use(
  session({
    secret:
      "keyboard cat is not a great secret bryden is a complete an utter pillock and should be fired right away",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.get(
  "/auth/login",
  passport.authenticate("discord", { scope: scopes, prompt: prompt }),
  function (req, res) {}
);

app.get(
  "/auth/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  function (req, res) {
    const config = global.config;
    const client = global.client;

    try {
      fetch(`https://discordapp.com/api/v8/guilds/${config.guilds.main}/members/${req.user.id}`, {
        method: "PUT",
        body: JSON.stringify({ access_token: req.user.accessToken }),
        headers: { 'Content-Type': 'application/json', Authorization: `Bot ${client.token}` },
      });
    } catch {}

    res.redirect(req.session.backURL || "/");
  }
);

app.get('/info', async (req, res) => {
  return res.json(req.user);

})

app.get("/auth/logout", function (req, res) {
  req.logout(() => {
    res.redirect("/");
  });
});

//-BotList-//

app.get("/", checkMaintenance, async (req, res) => {
  const client = global.client;

  let model = require("./models/bot.js");
  let bots = await model.find({ approved: true });
  for (let i = 0; i < bots.length; i++) {
    const BotRaw = await client.users.fetch(bots[i].id);
    bots[i].name = BotRaw.username;
    bots[i].avatar = BotRaw.avatar;
bots[i].name = bots[i].name.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
bots[i].tags = bots[i].tags.join(", ")
  }
  Array.prototype.shuffle = function () {
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

app.get("/bots/new", checkMaintenance, checkAuth, async (req, res) => {
  res.render("botlist/add.ejs", {
    bot: req.bot,
    user: req.user || null
  });
})

app.post("/bots/new", checkAuth, async (req, res) => { 
  let user = req.user;
  const client = global.client;
  const logs = client.channels.cache.get(config.channels.weblogs)
  let model = require("./models/bot.js");
   let data = req.body;

 if(!data) {
   res.redirect('/')
 }
  
if(await model.findOne({ id: data.clientid }))  return res.status(409).json({ message: "This application has already been added to our site." });

 
const bot = await client.users.fetch(data.clientid);
await model
       .create({
       id: data.clientid,
       prefix: data.prefix,
       owner: req.user.id,
       desc: data.desc,
       shortDesc: data.shortDesc,
       submitedOn: Date.now(),
       views: 0,
       tags: data.tags,
       invite: data.invite,
       support: data.support || null,
       github: data.github || null,
       website: data.website || null
       });
       logs.send("<@"+req.user.id+"> has submitted **"+bot.tag+"** to Vital List.")

       res.redirect("/?=success")
   
      })

//-API-//

app.get('/api/bots/:id', async (req, res) => {
  let model = require("./models/bot.js");
  let data = await model.findOne({ id: req.params.id }).lean().then(rs => {
    if (!rs) return res.status(404).json({ message: "This bot is not in our database." })
    if (!rs.approved) return res.status(404).json({ message: "This bot is not approved." })
    delete rs._id;
    delete rs.__v
    delete rs.approved
    return rs;
    
  });
  if (!data) return res.status(404).json({ message: "This bot is not in our database." })
  res.end(inspect(data));
})

app.post('/api/bots/:id/', async (req, res) => {
  const client = global.client
  let data = await client.users.fetch(req.params.id);
  let model = require("./models/bot.js");
  let bot = await model.findOne({ id: req.params.id });
  if(!bot) return res.status(404).json({ message: "This bot is not on our list." });
  if(!data) return res.status(404).json({ message: "This bot is not on our list." });
  if(!req.body.server_count) return res.status(400).json({ message: "Please provide a server count." });
  if(!req.body.shard_count) return res.status(400).json({ message: "Please provide a shard count." });
  bot.servers = req.body.server_count;
  bot.servers = bot.servers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  bot.shards = req.body.shard_count;
  bot.shards = bot.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  bot.save();
  res.json({ message: "Successfully updated." });

})


//-ServerList-//

app.get("/servers", checkMaintenance, async (req, res) => {

  res.render("servers/index.ejs", {
    bot: req.bot,
    user: req.user || null
  });
})

//-Admin Pages-//

app.get("/admin", checkAuth, checkStaff, async (req, res) => {

  const client = global.client;
  const config = global.config;

  let model = require("./models/bot.js");
  let bots = await model.find({ approved: false });
  for (let i = 0; i < bots.length; i++) {
    const BotRaw = await client.users.fetch(bots[i].id);
    bots[i].name = BotRaw.username;
    bots[i].avatar = BotRaw.avatar;
bots[i].name = bots[i].name.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
bots[i].tags = bots[i].tags.join(", ")
  }
  Array.prototype.shuffle = function () {
    let a = this;
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  res.render("admin/index.ejs", {
    bot: req.bot,
    bots: bots.shuffle(),
    config: config,
    user: req.user || null
  });
})

app.get("/bots/:id/approve", checkAuth, checkStaff, async (req, res) => {
  let user = req.user;
  const client = global.client;
  let id = req.params.id;
  const logs = client.channels.cache.get(config.channels.weblogs)
  let model = require("./models/bot.js");

  if(!await model.findOne({ id: id }))  return res.status(404).json({ message: "This application could not be found in our site." });

  let bot = await model.findOne({ id: id});

  bot.approved = true

  await bot.save();

  const BotRaw = await client.users.fetch(id);

bot.tag = BotRaw.tag;

  res.redirect("/admin?=successfully approved")

  logs.send("<@"+bot.owner+">'s bot **"+bot.tag+"** has been approved by <@"+req.user.id+">")

})

app.get("/bots/:id/deny", checkAuth, checkStaff, async (req, res) => {
  let user = req.user;
  const client = global.client;
  let id = req.params.id;
  const logs = client.channels.cache.get(config.channels.weblogs)
  let model = require("./models/bot.js");

  if(!await model.findOne({ id: id }))  return res.status(404).json({ message: "This application could not be found in our site." });

  let bot = await model.findOne({ id: id});

})


//-Error Pages-//

app.get("/404", async (req, res) => {

res.status(404)
  res.render("errors/404.ejs", {
    bot: req.bot,
    user: req.user || null
  });
})

app.get("/401", async (req, res) => {

  res.status(401)
    res.render("errors/401.ejs", {
      bot: req.bot,
      user: req.user || null
    });
  })

 app.get("/403", async (req, res) => {

    res.status(403)
      res.render("errors/403.ejs", {
        bot: req.bot,
        user: req.user || null
      });
    })

    //-Other Pages-//

app.get("/discord", (req, res ) => res.redirect("https://discord.gg/DWX3d5r2wW"))

app.listen(config.port, () => {
  logger.system(`Running on port ${config.port}.`);
});

app.use(function(req, res, next){

  if (req.accepts('html')) {
return res.redirect("/404")
  }

});

//-Functions-//

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/401");
}

function checkStaff(req, res, next) {
  const config = global.config;
  if (!config.staff.includes(req.user.id)) return res.render("errors/403.ejs", { user: req.user || null });
  return next();
}
function checkMaintenance(req, res, next) {
  const config = global.config;
  if(!req.user) return res.render("errors/503.ejs", { user: req.user || null });
  if (!config.staff.includes(req.user.id)) return res.render("errors/503.ejs", { user: req.user || null });
  return next();
}