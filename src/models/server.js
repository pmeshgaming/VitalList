const mongoose = require("mongoose");

let app = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  invite: {
    type: String,
    required: false
  }, 
  bumps: {
    type: Number,
    required: false,
    default: 0
  },
  website: {
    type: String,
    required: false
  },
  owner: {
    type: Number,
    required: false
  },
  views: {
    type: Number,
    required: false,
    default: 0
  },
  votes: {
    type: Number,
    required: false,
    default: 0
  },
  votedate: {
  type: Number,
    required: false
  },
  submittedOn: {
    type: String,
    required: false
  },
  uniqueViews: {
    type: Number,
    required: false
  },
  tags: {
    type: Array,
    required: false
  },
  shortDesc: {
    type: String,
    required: false
  },
  desc: {
    type: String,
    required: false
  }
});
module.exports = mongoose.model("server", app);
