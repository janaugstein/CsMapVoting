const express = require("express");
const mongoose = require("mongoose");
const sessionModel = require("./models/sessionModel");
const MapModel = require("./models/mapModel");
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

  app.post("/vote", async (req, res) => {
    console.log(req.body);
    //res.send({ message: "You just voted" });
    var session = await sessionModel.find({ sessionID: req.body.sessionID });
    console.log(session);
    if (session[0].whoVoted.includes(req.body.name)) {
      res.send({ message: "You already voted" });
    } else {
      res.send({ message: "You just voted" });
    }
    /**
     * TODO
     * increase the counter of the vouted map, add the name to the voted, check if he already voted before
     */
  });

  app.listen(port, () => [
    console.log(`Example app listening on port ${port}`),
  ]);

  async function seeding() {
    const cache = new MapModel({ name: "cache", votes: 2 });
    const inferno = new MapModel({ name: "inferno", votes: 1 });
    const anubis = new MapModel({ name: "anubis", votes: 0 });

    //cache.save();
    //inferno.save();
    //anubis.save();
    var cacheObj = await MapModel.find({ name: "cache" });
    console.log(cacheObj[0]);
    var cacheID = cacheObj[0]._id;
    var infernoObj = await MapModel.find({ name: "inferno" });
    console.log(infernoObj[0]);
    var infernoID = infernoObj[0]._id;
    var anubisObj = await MapModel.find({ name: "anubis" });
    console.log(anubisObj[0]);
    var anubisID = anubisObj[0]._id;

    const newSession = new sessionModel({
      sessionID: 1,
      maps: [cacheID, infernoID, anubisID],
      whoVoted: ["Kurice", "Impulze"],
      participants: ["Nesing", "Kurice"],
    });
    newSession.save();
  }
  //seeding();
});
