//Require Mongoose
const mongoose = require("mongoose");

// Define schema
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  sessionID: Number,
  maps: [{ type: Schema.Types.ObjectId, ref: "Map" }],
  whoVoted: [String],
  participants: [String],
  sessionOwner: String,
  createdAt: {
    type: Date,
    expires: 180000,
    default: Date.now,
  },
});

// Compile model from schema
const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
