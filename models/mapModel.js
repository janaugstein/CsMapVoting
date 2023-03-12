//Require Mongoose
const mongoose = require("mongoose");

// Define schema
const Schema = mongoose.Schema;

const mapSchema = new Schema({
  name: String,
  votes: Number,
});

const Map = mongoose.model("Map", mapSchema);

module.exports = Map;
