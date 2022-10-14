const model = require("../../models/server.js");
module.exports = {
  name: "guildDelete",
  async run(sclient, guild) {
    if (!(await model.findOne({ id: guild.id }))) return;

    await model.findOneAndDelete({ id: guild.id });
  },
};
