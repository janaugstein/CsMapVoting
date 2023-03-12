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
app.use(express.json());

mongoose.connect(connectionString).then(() => {
  app.get("/", (req, res) => {
    res.send("<p>Hello World</p>");
  });
  //when joining a session: check req.sessionID and send back the maps
  app.post("/joinSession", async (req, res) => {
    console.log(req.body);
    var searchedSession = await sessionModel.find({
      sessionID: req.body.sessionID,
    });
    console.log(searchedSession);
    /**
     * TODO
     * add the name to the participants
     */
    res.send({ message: "You joined Session XY", data: searchedSession });
  });

  app.post("/vote", (req, res) => {
    console.log(req.body);
    res.send({ message: "You just voted" });
    /**
     * TODO
     * increase the counter of the vouted map, add the name to the voted, check if he already voted before
     */
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
