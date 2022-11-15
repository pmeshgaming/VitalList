const logger = require("../functions/logger");
const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const ms = require("ms");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const mongoose = require("mongoose");
const config = global.config;
global.logger = logger;
const path = require("path");
const express = require("express"),
  session = require("express-session"),
  passport = require("passport"),
  Strategy = require("passport-discord").Strategy;
const SQLiteStore = require("connect-sqlite3")(session);
const helmet = require("helmet");
// const rateLimit = require('express-rate-limit')
Array.prototype.shuffle = function () { // Define this once 
  return this.map((k, i, o, p = Math.floor(Math.random() * this.length)) => [o[i], o[p]] = [o[p], o[i]]) && this
}
//-Database Login-//

try {
  mongoose.connect(config.mongo).then(logger.system("Mongoose connected."));
} catch (error) {
  logger.error(error);
}

//-Webserver-//

const app = express();

/* const limiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100,
   standardHeaders: true,
 }) */

// Apply the rate limiting middleware to all requests
//app.use(limiter)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/static"));
app.set("views", path.join(__dirname, "pages"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  if (req.method === "OPTIONS") {
    res.status(200).send();
  } else {
    next();
  }
});

//-Alaways use protection!-//

var minifyHTML = require("express-minify-html-terser");
const { find } = require("./models/review.js");
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
    function (accessToken, _refreshToken, profile, done) {
      process.nextTick(function () {
        profile.tokens = {
          accessToken,
        };
        return done(null, profile);
      });
    }
  )
);

app.use(
  session({
    store: new SQLiteStore(),
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
    prompt: prompt,
  }),
  (req, res) => {
    if (req.query.from) req.session.returnTo = req.query.from;
  }
);

app.get(
  "/auth/callback",
  passport.authenticate("discord", {
    failureRedirect: "/",
  }),
  function (req, res) {
    // const client = global.client;

  /*  try {
      fetch(
        `https://discord.com/api/v10/guilds/${config.guilds.main}/members/${req.user.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            access_token: req.user.accessToken,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${client.token}`,
          },
        }
      );
    } catch {}
    Need to add a popup of consent before */

    res.redirect(req.session.returnTo || "/"); 
  } 
);

app.get("/info", async (req, res) => {
  return res.json(req.user);
});

app.get("/auth/logout", function (req, res) {
  req.logout(() => {
    res.redirect("/");
  });
  if (req.session.returnTo) {
    delete req.session.returnTo;
  }
});

//-bot-//

app.get("/", async (req, res) => {
  const client = global.client;
  let bots = await global.botModel.find({
    approved: true,
  });

  for (let i = 0; i < bots.length; i++) {
    const BotRaw = await client.users.fetch(bots[i].id);
    bots[i].name = BotRaw.username;
    bots[i].avatar = BotRaw.avatar;
    bots[i].name = bots[i].name.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ""
    );
    bots[i].tags = bots[i].tags.join(", ");
  }


  res.render("index.ejs", {
    bot: req.bot,
    bots: bots.shuffle(),
    user: req.user || null,
  });
});

app.get("/bots", async (req, res) => {
  const client = global.client;
  let bots = await global.botModel.find({ approved: true });

  for (let i = 0; i < bots.length; i++) {
    const BotRaw = await client.users.fetch(bots[i].id);
    bots[i].name = BotRaw.username;
    bots[i].avatar = BotRaw.avatar;
    bots[i].name = bots[i].name.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ""
    );
    bots[i].tags = bots[i].tags.join(", ");
  }

  res.render("botlist/bots.ejs", {
    bot: req.bot,
    bots: bots.shuffle(),
    user: req.user || null,
  });
}); //Removing end point
app.get('/explore', async (req, res) => {
  res.redirect('/')
});


app.get("/bots/new", checkAuth, async (req, res) => {
  res.render("botlist/add.ejs", {
    bot: global.client,
    tags: global.config.tags,
    user: req.user || null,
  });
});

app.post("/bots/new", checkAuth, async (req, res) => {
  const client = global.client;
  const logs = client.channels.cache.get(config.channels.weblogs);
  let data = req.body;

  if (!data) return res.redirect("/");

  if (
    await global.botModel.findOne({
      id: data.id,
    })
  )
    return res.status(409).json({
      message: "This application has already been added to our site.",
    });

  try {
    await client.users.fetch(data.id);
  } catch (err) {
    return res.status(400).json({
      message: "This is not a real application on Discord.",
    });
  }

  const bot = await client.users.fetch(data.id);

  if (bot.bot === false) {
    return res.status(400).json({
      message: "You tried to add a user account to the site, you need to add a BOT ID.",
    });
  }

  await global.botModel.create({
    id: data.id,
    prefix: data.prefix,
    owner: req.user.id,
    desc: data.desc,
    shortDesc: data.shortDesc,
    submittedOn: Date.now(),
    views: 0,
    tags: data.tags,
    invite: data.invite,
    support: data.support || null,
    github: data.github || null,
    website: data.website || null,
  });

  const date = new Date();
  const addEmbed = new EmbedBuilder()
    .setTitle("Bot Added")
    .setDescription(
      "<:VD_add:1006511788155752558> " +
      bot.tag +
      " has been submitted to Vital List."
    )
    .setColor("Blue")
    .addFields({
      name: "Bot",
      value: `[${bot.tag}](https://vitallist.xyz/bots/${bot.id})`,
      inline: true,
    })
    .addFields({
      name: "Owner",
      value: `[${req.user.username}#${req.user.discriminator}](https://vitallist.xyz/users/${req.user.id})`,
      inline: true,
    })
    .addFields({
      name: "Date",
      value: `${date.toLocaleString()}`,
      inline: true,
    })
    .setFooter({
      text: "Add Logs - VitalList",
      iconURL: `${global.client.user.displayAvatarURL()}`,
    });
  logs.send({ content: `<@${req.user.id}>`, embeds: [addEmbed] });

  return res.redirect(
    `/bots/${data.id}?success=true&body=Your bot was added successfully.`
  );
});

app.get("/bots/:id/invite", async (req, res) => {
  const id = req.params.id;
  const bot = await global.botModel.findOne({ id: id });
  if (!bot) return res.status(404).redirect("/404");

  if (!bot.invite) {
    return res.redirect(
      `https://discord.com/oauth2/authorize?client_id=${id}&scope=bot%20applications.commands&permissions=0&response_type=code`
    );
  }

  return res.redirect(bot.invite);
});

app.get("/bots/:id/edit", checkAuth, async (req, res) => {
  const client = global.client;
  const id = req.params.id;

  const bot = await global.botModel.findOne({ id: id });
  if (!bot) return res.redirect("/404");
  if (req.user.id !== bot.owner) return res.redirect("/404");

  const BotRaw = (await client.users.fetch(id)) || null;
  bot.name = BotRaw.username;
  bot.avatar = BotRaw.avatar;

  res.render("botlist/edit.ejs", {
    bot: bot,
    tags: global.config.tags,
    user: req.user || null,
  });
});

app.post("/bots/:id/edit", checkAuth, async (req, res) => {
  const client = global.client;
  const logs = client.channels.cache.get(config.channels.weblogs);
  const botm = await global.botModel.findOne({ id: req.params.id });
  let data = req.body;

  if (!data) {
    return res.redirect("/");
  }
  if (req.user.id !== botm.owner) return res.redirect("/404");

  const bot = await client.users.fetch(req.params.id);
  if (!bot) {
    return res.status(400).json({
      message: "This is not a real application on Discord.",
    });
  }
  botm.id = req.params.id;
  botm.prefix = data.prefix;
  botm.owner = req.user.id;
  botm.desc = data.desc;
  botm.shortDesc = data.shortDesc;
  botm.tags = data.tags;
  botm.invite = data.invite;
  botm.support = data.support || null;
  botm.github = data.github || null;
  botm.website = data.website || null;
  botm.webhook = data.webhook || null;
  await botm.save();

  const date = new Date();
  const editEmbed = new EmbedBuilder()
    .setTitle("Bot Edited")
    .setDescription(":pencil: " + bot.tag + " has been edited on Vital List.")
    .setColor("Yellow")
    .addFields({
      name: "Bot",
      value: `[${bot.tag}](https://vitallist.xyz/bots/${bot.id})`,
      inline: true,
    })
    .addFields({
      name: "Owner",
      value: `[${req.user.username}#${req.user.discriminator}](https://vitallist.xyz/users/${req.user.id})`,
      inline: true,
    })
    .addFields({
      name: "Date",
      value: `${date.toLocaleString()}`,
      inline: true,
    })
    .setFooter({
      text: "Edit Logs - VitalList",
      iconURL: `${global.client.user.displayAvatarURL()}`,
    });
  logs.send({ content: `<@${req.user.id}>`, embeds: [editEmbed] });

  return res.redirect(
    `/bots/${req.params.id}?success=true&body=You have successfully edited your bot.`
  );
});

app.post("/bots/:id/apikey", checkAuth, async (req, res) => {
  let id = req.params.id;
  let model = global.botModel;
  let bot = await model.findOne({ bot: id });
  if (!bot) return res.redirect("/");
  if (req.user.id !== bot.owner) return res.redirect("/");

  let data = req.body;
  function genApiKey(options = {}) {
    let length = options.length || 5;
    let string =
      "abcdefghijklmnopqrstuwvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let code = "";
    for (let i = 0; i < length; i++) {
      let random = Math.floor(Math.random() * string.length);
      code += string.charAt(random);
    }
    return code;
  }
  bot.apikey = genApiKey({ length: 20 });
  await bot.save().then(() => {
    res.status(201).json({ apikey: bot.apikey, code: "OK" });
  });
})

app.post("/bots/:id/vote", checkAuth, async (req, res) => {
  let bot = await global.botModel.findOne({
    id: req.params.id,
  });
  if (!bot)
    return res
      .status(404)
      .json({ message: "This bot was not found on our site." });

  let x = await global.voteMode.findOne({
    user: req.user.id,
    bot: req.params.id,
  });

  if (x) {
    let timeObj = ms(x.time - (Date.now() - x.date), { long: true });
    return res
      .redirect(`/bots/${req.params.id}/vote?error=true&body=Please wait ${timeObj} before you can vote again.`)
  }

  await global.voteMode.create({
    bot: req.params.id,
    user: req.user.id,
    date: Date.now(),
    time: 43200000,
  });

  await global.botModel.findOneAndUpdate(
    {
      id: req.params.id,
    },
    {
      $inc: {
        votes: 1,
      },
    }
  );

  const BotRaw = (await global.client.users.fetch(bot.id)) || null;
  bot.name = BotRaw.username;
  bot.discriminator = BotRaw.discriminator;
  bot.avatar = BotRaw.avatar;

  const logs = global.client.channels.cache.get(global.config.channels.weblogs);
  const date = new Date();
  const votedEmbed = new EmbedBuilder()
    .setTitle("Bot Voted")
    .setDescription(
      "<:vote:1028862219313762304> " +
      bot.name +
      "#" +
      bot.discriminator +
      " has been voted on Vital List."
    )
    .setColor("Purple")
    .addFields({
      name: "Bot",
      value: `[${bot.name}#${bot.discriminator}](https://vitallist.xyz/bots/${bot.id})`,
      inline: true,
    })
    .addFields({
      name: "Voter",
      value: `[${req.user.username}#${req.user.discriminator}](https://vitallist.xyz/users/${req.user.id})`,
      inline: true,
    })
    .addFields({
      name: "Date",
      value: `${date.toLocaleString()}`,
      inline: true,
    })
    .setFooter({
      text: "Vote Logs - VitalList",
      iconURL: `${global.client.user.displayAvatarURL()}`,
    });
  logs.send({ embeds: [votedEmbed] });

  return res.redirect(
    `/bots/${req.params.id}?success=true&body=You voted successfully. You can vote again after 12 hours.`
  );
});

app.get("/bots/:id/vote", checkAuth, async (req, res) => {
  let bot = await global.botModel.findOne({
    id: req.params.id,
  });
  if (!bot)
    return res
      .status(404)
      .json({ message: "This bot was not found on our site." });
  let user = await global.userModel.findOne({
    id: req.user.id,
  });
  if (!user) {
    await global.userModel.create({ id: req.user.id });
  }

  const BotRaw = (await global.client.users.fetch(bot.id)) || null;
  bot.name = BotRaw.username;
  bot.discriminator = BotRaw.discriminator;
  bot.avatar = BotRaw.avatar;

  res.render("botlist/vote.ejs", {
    bot: bot,
    user: req.user || null,
  });
});

app.get("/bots/:id/review", checkAuth, async (req, res) => {
  let id = req.params.id;
  const bot = await global.botModel.findOne({ id: id });

  if (!bot)
    return res.status(404).json({
      message: "This bot could not be found in our site.",
    });

  if (bot.owner === req.user.id)
    return res.status(400).json({
      message: "You cannot review your own bot."
    })


  const BotRaw = (await global.client.users.fetch(bot.id)) || null;
  bot.name = BotRaw.username;
  bot.discriminator = BotRaw.discriminator;
  bot.avatar = BotRaw.avatar;

  res.render("botlist/review.ejs", {
    bot: bot,
    config: global.config,
    user: req.user || null,
  });
})

app.post("/bots/:id/review", checkAuth, async (req, res) => {
  let id = req.params.id;
  const reviewModel = require("./models/review.js")
  const bot = await global.botModel.findOne({ id: id });
  const data = req.body;

  if (!bot)
    return res.status(404).json({
      message: "This bot could not be found in our site.",
    });

  if (bot.owner === req.user.id)
    return res.status(400).json({
      message: "You cannot review your own bot."
    })

  if (await reviewModel.findOne({ reviewer: req.user.id, botid: req.params.id }))
    return res.status(400).json({
      message: "You already have a review for this bot."
    })

  const d = new Date();
  await reviewModel.create({
    reviewer: req.user.id,
    botid: req.params.id,
    rating: data.rating,
    body: data.body,
    date: d.toLocaleString()
  });

  await res.redirect(`https://vitallist.xyz/bots/${id}?success=true&body=Your review was successfully added.`)

})

app.get("/bots/:id", async (req, res) => {
  let id = req.params.id;
  const client = global.client;
  const reviewsModel = require("./models/review.js")
  const bot = await global.botModel.findOne({ id: id });
  if (!bot)
    return res
      .status(404)
      .json({ message: "This bot was not found on our list." });
  const marked = require("marked");
  const desc = marked.parse(bot.desc);
  const BotRaw = (await client.users.fetch(id)) || null;
  const OwnerRaw = await client.users.fetch(bot.owner) || null;
  bot.name = BotRaw.username;
  bot.avatar = BotRaw.avatar;
  bot.discriminator = BotRaw.discriminator;
  bot.tag = BotRaw.tag;
  bot.ownerTag = OwnerRaw.tag;
  bot.ownerAvatar = OwnerRaw.avatar;
  bot.tags = bot.tags.join(", ");
  bot.desc = desc;
  bot.flags = BotRaw.flags.bitfield;

  const reviews = await reviewsModel.find({ botid: bot.id })

  for (let i = 0; i < reviews.length; i++) {
    const ReviewerRaw = await client.users.fetch(reviews[i].reviewer);
    reviews[i].reviewerName = ReviewerRaw.tag;
    reviews[i].reviewerAvatar = ReviewerRaw.avatar;
  }

  res.render("botlist/viewbot.ejs", {
    bot2: req.bot,
    bot: bot,
    user: req.user || null,
    reviews: reviews.shuffle(),
  });
});

app.get("/bots/:id/widget", async (req, res) => {
  let id = req.params.id;
  const client = global.client;
  const bot = await global.botModel.findOne({ id: id });

  const BotRaw = (await client.users.fetch(id)) || null;
  bot.name = BotRaw.username;
  bot.avatar = BotRaw.avatar;
  bot.discriminator = BotRaw.discriminator;
  bot.tag = BotRaw.tag;

  res.render("botlist/widget.ejs", {
    bot: bot,
    user: req.user || null
  })
})

//-TAGS-//

app.get("/tags", async (req, res) => {
  const bottags = global.config.tags.bots;
  const servertags = global.config.tags.servers;

  res.render("tags.ejs", {
    bottags: bottags,
    servertags: servertags,
    user: req.user || null,
  });
});

app.get("/bots/tags/:tag", async (req, res) => {
  const tag = req.params.tag;

  if (!global.config.tags.bots.includes(tag))
    return res
      .status(404)
      .json({ message: "This tag was not found in our database." });

  let data = await global.botModel.find();
  let bots = data.filter((a) => a.approved === true && a.tags.includes(tag));
  if (bots.length <= 0) return res.redirect("/");

  for (let i = 0; i < bots.length; i++) {
    const BotRaw = await global.client.users.fetch(bots[i].id);
    bots[i].name = BotRaw.username;
    bots[i].avatar = BotRaw.avatar;
    bots[i].name = bots[i].name.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ""
    );
    bots[i].tags = bots[i].tags.join(", ");
  }

  res.render("botlist/tags.ejs", {
    bots: bots.shuffle(),
    tag: tag,
    user: req.user,
  });
});

app.get("/servers/tags/:tag", async (req, res) => {
  const tag = req.params.tag;

  if (!global.config.tags.servers.includes(tag))
    return res
      .status(404)
      .json({ message: "This tag was not found in our database." });

  let data = await global.serverModel.find();
  let servers = data.filter(
    (a) => a.published === true && a.tags.includes(tag)
  );
  if (servers.length <= 0) return res.redirect("/");
  for (let i = 0; i < servers.length; i++) {
    const ServerRaw = await global.sclient.guilds.fetch(servers[i].id);
    servers[i].name = ServerRaw.name;
    servers[i].icon = ServerRaw.iconURL({ dynamic: true });
    servers[i].memberCount = ServerRaw.memberCount
      .toLocaleString()
      .replace(",", ",");
    servers[i].boosts = ServerRaw.premiumSubscriptionCount;
    servers[i].tags = servers[i].tags.join(", ");
  }

  res.render("servers/tags.ejs", {
    tag: tag,
    user: req.user || null,
    servers: servers.shuffle(),
  });
});

//-API-//

app.get("/api/bots/:id", async (req, res) => {

  let model = global.botModel
  let data = await model
    .findOne({
      id: req.params.id,
    })
    .lean()
    .then(async (rs) => {
      if (!rs)
        return res.status(404).json({
          message: "This bot is not in our database.",
        });
      if (!rs.approved)
        return res.status(404).json({
          message: "This bot is not approved yet.",
        });

        const BotRaw = await client.users.fetch(rs.id) || null;
        const OwnerRaw = await client.users.fetch(rs.owner)|| null;

  final_data = {
     id: rs.id,
     username: BotRaw.username,
     discriminator: BotRaw.discriminator,
     avatar: `https://cdn.discordapp.com/avatars/${rs.id}/${BotRaw.avatar}.png`,
     prefix: rs.prefix,
     owner: rs.owner,
     ownerTag: OwnerRaw.tag,
     tags: rs.tags,
     views: rs.views,
     submittedOn: rs.submittedOn,
     approvedOn: rs.approveOn,
     shortDescription: rs.shortDesc,
     description: rs.desc,

    // Counts
    shards: rs.shards,
    servers: rs.servers,
    votes: rs.votes,
    views: rs.views,

    // Links
    banner: rs.banner,
    invite: rs.invite,
    website: rs.website,
    github: rs.github,
    support: rs.support,
  }

   return res.json(final_data)
  });
});

app.post("/api/bots/:id/", async (req, res) => {
  const client = global.client;
  let model = global.botModel

  const key = req.headers.authorization;
  if (!key) return res.status(401).json({ json: "Please provides a API Key." });

  let bot = await model.findOne({
    apikey: key,
  });
  if (!bot)
    return res.status(404).json({
      message: "This bot is not on our list, or you entered an invaild API Key.",
    });

  if (!req.header("server_count"))
    return res.status(400).json({
      message: "Please provide a server count.",
    });
  if (!req.header("shard_count"))
    return res.status(400).json({
      message: "Please provide a shard count.",
    });

  bot.servers = req.header("server_count");
  bot.servers = bot.servers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  bot.shards = req.header("shard_count");
  bot.shards = bot.shards.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  bot.save();
  res.json({
    message: "Successfully updated.",
  });
});

//-ServerList-//

app.get("/servers", async (req, res) => {
  let servers = await global.serverModel.find({ published: true });
  for (let i = 0; i < servers.length; i++) {
    const ServerRaw = await global.sclient.guilds.fetch(servers[i].id);
    servers[i].name = ServerRaw.name;
    servers[i].icon = ServerRaw.iconURL({ dynamic: true });
    servers[i].memberCount = ServerRaw.memberCount
      .toLocaleString()
      .replace(",", ",");
    servers[i].boosts = ServerRaw.premiumSubscriptionCount;
    servers[i].tags = servers[i].tags.join(`, `);
  }

  res.render("servers/index.ejs", {
    bot: req.bot,
    user: req.user || null,
    servers: servers.shuffle(),
  });
});

app.get(
  "/servers/new",
  checkAuth,
  async (req, res) =>
    await res.redirect(
      "https://discord.com/api/oauth2/authorize?client_id=1004264023111507979&permissions=313409&scope=applications.commands%20bot"
    )
);

app.get("/servers/:id", async (req, res) => {
  const id = req.params.id;

  const server = await global.serverModel.findOne({ id: id });
  if (!server) return res.redirect("/404");

  if (server.published === false) {
    if (!req.user) return res.redirect("/404?error=503");
    if (!server.owner.includes(req.user.id))
      return res.redirect("/404?error=503");
  }

  server.views = parseInt(server.views) + 1;
  await server.save();

  //-Cleaning Server Desc-//
  const marked = require("marked");
  const desc = marked.parse(server.desc);

  const ServerRaw = (await global.sclient.guilds.fetch(id)) || null;
  const OwnerRaw = await global.sclient.users.fetch(server.owner);
  (server.name = ServerRaw.name),
    (server.icon = ServerRaw.iconURL({ dynamic: true })),
    (server.memberCount = ServerRaw.memberCount
      .toLocaleString()),
    (server.boosts = ServerRaw.premiumSubscriptionCount);
  server.tags = server.tags.join(", ");
  server.ownerTag = OwnerRaw.tag;
  server.ownerAvatar = OwnerRaw.avatar;
  server.desc = desc;
  server.emojis = ServerRaw.emojis.cache.size;
  res.render("servers/viewserver.ejs", {
    bot: global.client,
    server: server,
    user: req.user,
  });
});

app.get("/servers/:id/join", async (req, res) => {
  const id = req.params.id;
  const server = await global.serverModel.findOne({ id: id });
  if (!server) return res.status(404).redirect("/404");

  if (!server.invite) {
    return res.send(
      "This server does not have an invite set, please contact the owner or set one with the /invite command in this guild."
    );
  }

  return res.redirect(server.invite);
});

app.get("/servers/:id/edit", checkAuth, async (req, res) => {
  const id = req.params.id;

  const server = await global.serverModel.findOne({ id: id });
  if (!server) return res.redirect("/404");

  if (req.user.id !== server.owner) return res.redirect("/404");

  const ServerRaw = (await global.sclient.guilds.fetch(id)) || null;

  (server.name = ServerRaw.name),
    (server.icon = ServerRaw.iconURL()),
    (server.memberCount = ServerRaw.memberCount);

  res.render("servers/editserver.ejs", {
    bot: req.bot,
    server: server,
    tags: global.config.tags,
    user: req.user,
  });
});

app.post("/servers/:id/edit", checkAuth, async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const server = await global.serverModel.findOne({ id: id });
  if (!server) return res.redirect("/404");

  if (req.user.id !== server.owner) return res.redirect("/404");

  server.shortDesc = data.short_description;
  server.desc = data.long_description;
  server.tags = data.tags;
  server.website = data.website || null;
  server.published = true;
  await server.save();

  const ServerRaw = (await global.sclient.guilds.fetch(server.id)) || null;

  server.name = ServerRaw.name;

  if (server.published === false) {
    const logs = global.sclient.channels.cache.get(global.config.channels.weblogs);
    const date = new Date();
    const publishEmbed = new EmbedBuilder()
      .setTitle("Server Published")
      .setDescription(
        "<:VD_add:1006511788155752558> " +
        server.name +
        " has been published to Vital Servers."
      )
      .setColor("Blue")
      .addFields({
        name: "Server",
        value: `[${server.name}](https://vitallist.xyz/servers/${server.id})`,
        inline: true,
      })
      .addFields({
        name: "Owner",
        value: `[${req.user.username}#${req.user.discriminator}](https://vitallist.xyz/users/${req.user.id})`,
        inline: true,
      })
      .addFields({
        name: "Date",
        value: `${date.toLocaleString()}`,
        inline: true,
      })
      .setFooter({
        text: "Publish Logs - VitalServers",
        iconURL: `${global.sclient.user.displayAvatarURL()}`,
      });
    logs.send({ content: `<@${req.user.id}>`, embeds: [publishEmbed] });
    return res.redirect(
      `/servers/${req.params.id}?success=true&body=Your server was successfully published.`
    );
  } else {
    const logs = global.sclient.channels.cache.get(global.config.channels.weblogs);
    const date = new Date();
    const editEmbed = new EmbedBuilder()
      .setTitle("Server Edited")
      .setDescription(
        ":pencil: " + server.name + " has been edited on Vital Servers."
      )
      .setColor("Yellow")
      .addFields({
        name: "Server",
        value: `[${server.name}](https://vitallist.xyz/servers/${server.id})`,
        inline: true,
      })
      .addFields({
        name: "Owner",
        value: `[${req.user.username}#${req.user.discriminator}](https://vitallist.xyz/users/${req.user.id})`,
        inline: true,
      })
      .addFields({
        name: "Date",
        value: `${date.toLocaleString()}`,
        inline: true,
      })
      .setFooter({
        text: "Edit Logs - VitalServers",
        iconURL: `${global.sclient.user.displayAvatarURL()}`,
      });
    logs.send({ content: `<@${req.user.id}>`, embeds: [editEmbed] });
    return res.redirect(
      `/servers/${req.params.id}?success=true&body=Your server was successfully edited.`
    );
  }
});

app.post("/servers/:id/vote", checkAuth, async (req, res) => {
  let server = await global.serverModel.findOne({
    id: req.params.id,
  });
  if (!server)
    return res
      .status(404)
      .json({ message: "This server was not found on our site." });

  let x = await global.voteModel.findOne({
    user: req.user.id,
    server: req.params.id,
  });
  if (x) {
    let timeObj = ms(x.time - (Date.now() - x.date), { long: true });
    return res
      .status(400)
      .json({ message: `You can vote again in ${timeObj}.` });
  }

  await global.voteModel.create({
    server: req.params.id,
    user: req.user.id,
    date: Date.now(),
    time: 3600000,
  });

  await global.serverModel.findOneAndUpdate(
    {
      id: req.params.id,
    },
    {
      $inc: {
        votes: 1,
      },
    }
  );

  const ServerRaw = (await global.sclient.guilds.fetch(server.id)) || null;
  server.name = ServerRaw.name;
  server.icon = ServerRaw.iconURL();

  const logs = global.sclient.channels.cache.get(
    global.config.channels.weblogs
  );
  const date = new Date();
  const votedEmbed = new EmbedBuilder()
    .setTitle("Server Voted")
    .setDescription(
      "<:vote:1028862219313762304> " +
      server.name +
      " has been voted on VitalServers."
    )
    .setColor("Purple")
    .addFields({
      name: "Server",
      value: `[${server.name}](https://vitallist.xyz/servers/${server.id})`,
      inline: true,
    })
    .addFields({
      name: "Voter",
      value: `[${req.user.username}#${req.user.discriminator}](https://vitallist.xyz/users/${req.user.id})`,
      inline: true,
    })
    .addFields({
      name: "Date",
      value: `${date.toLocaleString()}`,
      inline: true,
    })
    .setFooter({
      text: "Vote Logs - VitalServers",
      iconURL: `${global.sclient.user.displayAvatarURL()}`,
    });
  logs.send({ embeds: [votedEmbed] });

  return res.redirect(
    `/servers/${req.params.id}?success=true&body=You voted successfully. You can vote again after 12 hours.`
  );
});

app.get("/servers/:id/vote", checkAuth, async (req, res) => {
  let server = await global.serverModel.findOne({
    id: req.params.id,
  });
  if (!server)
    return res
      .status(404)
      .json({ message: "This server was not found on our site." });
  let user = await global.userModel.findOne({
    id: req.user.id,
  });

  if (!user) {
    await global.userModel.create({ id: req.user.id });
  }

  const ServerRaw = (await global.sclient.guilds.fetch(server.id)) || null;
  server.name = ServerRaw.name;
  server.icon = ServerRaw.iconURL();

  res.render("servers/vote.ejs", {
    server: server,
    user: req.user || null,
  });
});

//-User Pages-//

app.get("/me", checkAuth, async (req, res) => {
  const user = req.user || null;
  //const response = await fetch(`https://japi.rest/discord/v1/user/${req.user.id}`)
  let userm = await global.userModel.findOne({
    id: req.user.id,
  });
  user.bio = userm?.bio || "No bio has been set";
  let bots = await global.botModel.find({
    tested: true,
    owner: user.id,
  });
  let servers = await global.serverModel.find({
    published: true,
    owner: req.params.id,
  });
  for (let i = 0; i < servers.length; i++) {
    const ServerRaw = await global.sclient.guilds.fetch(servers[i].id);
    servers[i].name = ServerRaw.name;
    servers[i].icon = ServerRaw.iconURL({ dynamic: true });
    servers[i].memberCount = ServerRaw.memberCount;
    servers[i].boosts = ServerRaw.premiumSubscriptionCount;
    servers[i].tags = servers[i].tags.join(", ");
  }

  for (let i = 0; i < bots.length; i++) {
    const BotRaw = await global.client.users.fetch(bots[i].id);
    bots[i].name = BotRaw.username;
    bots[i].avatar = BotRaw.avatar;
    bots[i].tags = bots[i].tags.join(", ");
  }
  res.render("user.ejs", {
    bot: req.bot,
    fetched_user: user || null,
    bots: bots,
    servers: servers,
    config: global.config,
    user: user || null,
  });
});

app.get("/users/:id", async (req, res) => {
  const guild = await global.client.guilds.fetch(global.config.guilds.main);
  let user = (await guild.members.fetch(req.params.id)) || null;
  user = user?.user;
  if (user.bot) return res.redirect("/");
  if (!user) return res.status(404).json({ message: "This user was not found on Discord." });
  let userm = await global.userModel.findOne({
    id: req.params.id,
  });
  user.bio = userm?.bio || "This user has no bio set.";
  user.website = userm?.website;
  user.github = userm?.github;
  let bots = await global.botModel.find({
    owner: req.params.id,
  });
  for (let i = 0; i < bots.length; i++) {
    const BotRaw = await global.client.users.fetch(bots[i].id);
    bots[i].name = BotRaw.username;
    bots[i].avatar = BotRaw.avatar;
    bots[i].tags = bots[i].tags.join(", ");
  }
  let servers = await global.serverModel.find({
    published: true,
    owner: req.params.id,
  });
  for (let i = 0; i < servers.length; i++) {
    const ServerRaw = await global.sclient.guilds.fetch(servers[i].id);
    servers[i].name = ServerRaw.name;
    servers[i].icon = ServerRaw.iconURL({ dynamic: true });
    servers[i].memberCount = ServerRaw.memberCount;
    servers[i].boosts = ServerRaw.premiumSubscriptionCount;
    servers[i].tags = servers[i].tags.join(", ");
  }

  res.render("user.ejs", {
    bot: req.bot,
    fetched_user: user,
    bots: bots,
    servers: servers,
    config: global.config,
    user: req.user || null,
  });
});

app.get("/users/:id/edit", checkAuth, async (req, res) => {
  const guild = await global.client.guilds.fetch(global.config.guilds.main);
  let user = (await guild.members.fetch(req.params.id)) || null;
  user = user?.user;
  if (user.bot) return res.redirect("/");
  if (!user) {
    res.status(404).json({ message: "This user was not found on Discord." });
  }
  if (req.user.id !== user.id) return res.redirect("/404");

  let userm = await global.userModel.findOne({
    id: req.params.id,
  });
  user.bio = userm?.bio || "This user has no bio set.";
  user.website = userm?.website;
  user.github = userm?.github;
  user.twitter = userm?.twitter;

  res.render("edituser.ejs", {
    bot: req.bot,
    fetched_user: user,
    user: req.user || null,
  });
});

app.post("/users/:id/edit", checkAuth, async (req, res) => {
  const client = global.client;
  const userm = await global.userModel.findOne({ id: req.params.id });
  let data = req.body;

  if (!data) {
    return res.redirect("/");
  }

  if (req.user.id !== userm.id) return res.redirect("/404");

  const user = await client.users.fetch(req.params.id).catch(() => null);
  if (!user) {
    return res.status(400).json({
      message: "This is not a real person on Discord.",
    });
  }

  userm.bio = data.bio || null;
  userm.github = data.github || null;
  userm.website = data.website || null;
  userm.twitter = data.twitter || null;
  await userm.save();

  return res.redirect(
    `/users/${req.params.id}?success=true&body=You have successfully edited your profile.`
  );
});

//-Admin Pages-//

app.get("/queue", checkAuth, checkStaff, async (req, res) => {
  const client = global.client;
  let bots = await global.botModel.find({
    tested: false,
  });
  for (let i = 0; i < bots.length; i++) {
    const BotRaw = await client.users.fetch(bots[i].id);
    bots[i].name = BotRaw.username;
    bots[i].tag = BotRaw.tag;
    bots[i].avatar = BotRaw.avatar;
    bots[i].name = bots[i].name.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ""
    );
    bots[i].tags = bots[i].tags.join(", ");
  }

  let inprogress = await global.botModel.find({
    inprogress: true,
  });

  for (let i = 0; i < inprogress.length; i++) {
    const IPRaw = await client.users.fetch(inprogress[i].id);
    const ReviewerRaw = await client.users.fetch(inprogress[i].reviewer);
    inprogress[i].tag = IPRaw.tag;
    inprogress[i].name = IPRaw.username;
    inprogress[i].avatar = IPRaw.avatar;
    inprogress[i].reviewer = ReviewerRaw.tag;
    inprogress[i].tags = inprogress[i].tags.join(", ");
  }

  res.render("queue/index.ejs", {
    bot: req.bot,
    bots: bots.shuffle(),
    config: config,
    user: req.user || null,
    inprogress: inprogress,
  });
});

app.get("/bots/:id/approve", checkAuth, checkStaff, async (req, res) => {
  const config = global.config;
  let bot = await global.botModel.findOne({ id: req.params.id });
  if (!bot)
    return res.status(404).json({
      message: "This application could not be found in our site.",
    });

  res.render("queue/approve.ejs", {
    bot: req.bot,
    id: req.params.id,
    config: config,
    user: req.user || null,
  });
});

app.get("/bots/:id/deny", checkAuth, checkStaff, async (req, res) => {
  let bot = await global.botModel.findOne({ id: req.params.id });
  if (!bot)
    return res.status(404).json({
      message: "This application could not be found in our site.",
    });

  res.render("queue/deny.ejs", {
    bot: req.bot,
    id: req.params.id,
    config: config,
    user: req.user || null,
  });
});

app.post("/bots/:id/deny", checkAuth, checkStaff, async (req, res) => {
  const config = global.config;
  const logs = global.client.channels.cache.get(config.channels.weblogs);
  const BotRaw = await global.client.users.fetch(req.params.id);
  let bot = await global.botModel.findOne({ id: req.params.id });

  if (!bot)
    return res.status(404).json({
      message: "This application could not be found in our site.",
    });

  if (bot.approved === true) {
    return res
      .status(400)
      .json({ message: "This bot is already approved on VitalList." });
  }

  if (bot.denied === true) {
    return res
      .status(400)
      .json({ message: "This bot is already denied. on VitalList." });
  }

  const OwnerRaw = await global.client.users.fetch(bot.owner) || null;

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
    .setDescription(
      "<:redcross:1020135034075746404> " +
      bot.tag +
      " has been denied on Vital List."
    )
    .setColor("Red")
    .addFields({
      name: "Bot",
      value: `[${bot.tag}](https://vitallist.xyz/bots/${bot.id})`,
      inline: true,
    })
    .addFields({
      name: "Owner",
      value: `[${bot.ownerName}](https://vitallist.xyz/users/${bot.owner})`,
      inline: true,
    })
    .addFields({
      name: "Reviewer",
      value: `[${req.user.username}#${req.user.discriminator}](https://vitallist.xyz/users/${req.user.id})`,
      inline: true,
    })
    .addFields({ name: "Reason", value: `${bot.reason}`, inline: true })
    .addFields({
      name: "Date",
      value: `${date.toLocaleString()}`,
      inline: true,
    })
    .setFooter({
      text: "Deny Logs - VitalList",
      iconURL: `${global.client.user.displayAvatarURL()}`,
    });
  logs.send({ content: `<@${bot.owner}>`, embeds: [denyEmbed] });
  const channelName = `${BotRaw.username}-${BotRaw.discriminator}`;
  let guild = global.client.guilds.cache.get(global.config.guilds.testing);
  const kickBot = guild.members.cache.get(bot.id);
  kickBot.kick({ reason: "Denied on VitalList." });
  let channel = guild.channels.cache.find(
    (c) => c.name == channelName.toLowerCase().replace(" ", "-")
  );
  if (channel) channel.delete();
  return res.redirect(
    `/queue?success=true&body=The bot was successfully denied.`
  );
});

app.post("/bots/:id/testing", checkAuth, checkStaff, async (req, res) => {
  let bot = await global.botModel.findOne({ id: req.params.id });
  let client = global.client;

  if (!bot)
    return res.status(404).json({
      message: "This application could not be found in our site.",
    });
  const LogRaw = (await client.users.fetch(bot.id)) || null;
  bot.inprogress = true;
  bot.tested = true;
  bot.reviewer = req.user.id;
  await bot.save();

  res.redirect(
    `https://discord.com/oauth2/authorize?client_id=${bot.id}&scope=bot&permissions=0&guild_id=${global.config.guilds.testing}`
  );
  let guild = client.guilds.cache.get(global.config.guilds.testing);
  let channel = await guild.channels.create({
    name: `${LogRaw.username}-${LogRaw.discriminator}`,
    reason: `Testing channel for ${LogRaw.tag}.`,
    parent: global.config.channels.testingcategory,
  });
  const embed = new EmbedBuilder()
    .setTitle("New Testing Session")
    .setDescription(
      `Welcome to your new testing session for ${LogRaw}.\nYou may now begin testing this bot. Any questions? View the queue page or ask a admin.`
    )
    .addFields({ name: "Bot Prefix", value: `${bot.prefix}` })
    .setFooter({
      text: "Testing Session - VitalList",
      iconURL: `${global.client.user.displayAvatarURL()}`,
    });
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setURL(`https://vitallist.xyz/queue`)
      .setLabel("View Queue")
      .setStyle(ButtonStyle.Link)
  );
  await channel.send({
    content: `<@${req.user.id}>`,
    embeds: [embed],
    components: [row],
  });
});
app.use("/bots/:id/status", checkAuth, checkStaff, async (req, res) => {
  const client = global.client;
  const logs = client.channels.cache.get(config.channels.weblogs);
  const BotRaw = await client.users.fetch(req.params.id);
  let bot = await global.botModel.findOne({ id: req.params.id });

  if (!bot)
    return res.status(404).json({
      message: "This application could not be found in our site.",
    });

  if (bot.approved === true) {
    return res
      .status(400)
      .json({ message: "This bot is already approved on VitalList." });
  }

  if (bot.denied === true) {
    return res
      .status(400)
      .json({ message: "This bot is already denied. on VitalList." });
  }

  const OwnerRaw = await client.users.fetch(bot.owner);

  if (req.method === "POST") {
    bot.tag = BotRaw.tag;
    bot.approved = true;
    bot.inprogress = false;
    bot.ownerName = OwnerRaw.tag;
    bot.approvedOn = Date.now();
    bot.tested = true;
    await bot.save();
    const date = new Date();

    const approveEmbed = new EmbedBuilder()
      .setTitle("Bot Approved")
      .setDescription(
        "<:greentick:1020134758753255555> " +
        bot.tag +
        " has been approved on Vital List."
      )
      .setColor("Green")
      .addFields({
        name: "Bot",
        value: `[${bot.tag}](https://vitallist.xyz/bots/${bot.id})`,
        inline: true,
      })
      .addFields({
        name: "Owner",
        value: `[${bot.ownerName}](https://vitallist.xyz/users/${bot.owner})`,
        inline: true,
      })
      .addFields({
        name: "Reviewer",
        value: `[${req.user.username}#${req.user.discriminator}](https://vitallist.xyz/users/${req.user.id})`,
        inline: true,
      })
      .addFields({
        name: "Date",
        value: `${date.toLocaleString()}`,
        inline: true,
      })
      .setFooter({
        text: "Approve Logs - VitalList",
        iconURL: `${global.client.user.displayAvatarURL()}`,
      });

    logs.send({ content: `<@${bot.owner}>`, embeds: [approveEmbed] });
    const mainGuild = client.guilds.cache.get(global.config.guilds.main);
    const ownerRaw = mainGuild.members.cache.get(bot.owner);
    ownerRaw.roles.add(global.config.roles.developer);
    const channelName = `${BotRaw.username}-${BotRaw.discriminator}`;
    let guild = client.guilds.cache.get(global.config.guilds.testing);
    const kickBot = guild.members.cache.get(bot.id);
    kickBot.kick("Approved on VitalList.");
    let channel = guild.channels.cache.find(
      (c) => c.name == channelName.toLowerCase()
    );
    if (channel) channel.delete("This bot was approved on VitalList.");
    return res.redirect(
      `/queue?success=true&body=The bot was successfully approved.`
    );
  }
});

//-Other Pages-//

app.get("/discord", (_req, res) =>
  res.redirect("https://discord.gg/HrWe2BwVbd")
);

app.get("/partners", async (req, res) => {
  res.render("partners.ejs", { user: req.user });
});

app.get("/terms", async (req, res) => {
  res.render("legal/terms.ejs", { user: req.user });
});

app.get("/policy", async (req, res) => {
  res.render("legal/policy.ejs", { user: req.user });
});

//-Error Pages-//
app.all("*", (req, res) => {
  res.status(404);
  res.render("errors/404.ejs", {
    bot: req.bot,
    user: req.user || null,
  });
});

app.all("*", (req, res) => {
  res.status(401);
  res.render("errors/401.ejs", {
    bot: req.bot,
    user: req.user || null,
  });
});

app.all("*", (req, res) => {
  res.status(403);
  res.render("errors/403.ejs", {
    bot: req.bot,
    user: req.user || null,
  });
});

app.listen(config.port, () => {
  logger.system(`Running on port ${config.port}.`);
});

//-Functions-//

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect(`/auth/login?from=${req.originalUrl}`);
}

function checkStaff(req, res, next) {
  const config = global.config;
  if (!config.staff.includes(req.user.id))
    return res.render("errors/403.ejs", {
      user: req.user || null,
    });
  return next();
}

/* function checkKey(req, res, next) {
  const key = req.headers.authorization
  if (!key) return res.status(401).json({ json: "Please provides a API Key" });
  let data = global.userModel
    .findOne({
      id: key,
    })
    .lean()
    .then((rs) => {
      if (!rs)
        return res.status(404).json({
          message: "Invalid API KEY",
        });
      if (rs) return next()
    })
  //redo
  return;
} */
