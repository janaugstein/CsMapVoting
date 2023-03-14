//Require Mongoose
const mongoose = require("mongoose");

// Define schema
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  sessionID: Number,
  maps: [{ type: Schema.Types.ObjectId, ref: "Map" }],
  whoVoted: [String],
  participants: [String],
  expireAt: {
    type: Date,
    expires: 1800,
    default: Date.now,
  },
});

// Compile model from schema
const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
