//Require Mongoose
const mongoose = require("mongoose");

// Define schema
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  sessionID: Number,
  map1: String,
  map2: String,
  map3: String,
  votesMap1: Number,
  votesMap2: Number,
  votesMap3: Number,
  whoVoted: [String],
  participants: [String],
});

// Compile model from schema
const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
