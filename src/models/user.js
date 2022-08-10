const mongoose = require("mongoose");

let app = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: false
  }, 
  messages: {
    type: Number,
    required: false,
    default: 0
  },
  level: {
    type: String,
    required: false,
    default: 0
  }
});
module.exports = mongoose.model("user", app);
