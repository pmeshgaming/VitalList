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
  xp: {
    type: Number,
    required: false,
    default: 0
  },
  level: {
    type: Number,
    required: false,
    default: 0
  }
});
module.exports = mongoose.model("user1", app);
