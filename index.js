const express = require("express");
const mongoose = require("mongoose");
const sessionModel = require("./models/sessionModel");
const app = express();
const cors = require("cors");

require("dotenv").config({ path: "./config.env" });
const port = 8001;

const connectionString = process.env.DBCONNECTION;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    //credentials: true
  })
);

mongoose.connect(connectionString).then(() => {
  app.get("/", (req, res) => {
    res.send("<p>Hello World</p>");
  });
  //when joining a session: check req.sessionID and send back the maps
  app.post("/joinSession", (req, res) => {
    console.log(req);
    res.send("You joined Session XY");
  });

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
    whoVoted: ["Kurice", "Impulze"],
    participants: ["Nesing", "Kurice"],
  });
  //newSession.save();
});
