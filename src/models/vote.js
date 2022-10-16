const mongoose = require("mongoose");

let app = mongoose.Schema({
  bot: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: false,
  },
  time: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("votes", app);
