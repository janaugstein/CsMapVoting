//Require Mongoose
const mongoose = require("mongoose");

// Define schema
const Schema = mongoose.Schema;

const mapSchema = new Schema({
  name: String,
  votes: Number,
  expireAt: {
    type: Date,
    expires: 1800,
    default: Date.now,
  },
});

const Map = mongoose.model("Map", mapSchema);

module.exports = Map;
