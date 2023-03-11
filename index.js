const express = require("express");
const mongoose = require("mongoose");
const sessionModel = require("./models/sessionModel");
const app = express();
const port = 8001;

const connectionString =
  "mongodb+srv://janA:jan97315@cluster0.bm2xy.mongodb.net/csmapvoting?retryWrites=true&w=majority";

mongoose.connect(connectionString).then(() => {
  app.get("/", (req, res) => [res.send("<p>Hello World</p>")]);
  app.listen(port, () => [
    console.log(`Example app listening on port ${port}`),
  ]);
  const newSession = new sessionModel({
    sessionID: 1,
    map1: "cache",
    map2: "inferno",
    map3: "anubis",
    votesMap1: 2,
    votesMap2: 1,
    votesMap3: 0,
    whoVoted: [543, 215],
  });
  //newSession.save();
});
