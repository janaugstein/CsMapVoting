const express = require("express");
const mongoose = require("mongoose");
const sessionModel = require("./models/sessionModel");
const MapModel = require("./models/mapModel");
const app = express();
const cors = require("cors");

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT;
const connectionString = process.env.DBCONNECTION;
const corsOrigin = process.env.CORSORIGINURL;

app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST"],
    //credentials: true
  })
);
app.use(express.json());

mongoose.connect(connectionString).then(() => {
  app.get("/", (req, res) => {
    res.send("<p>Hello World</p>");
  });
  /**
   * Route to join a session. The required Session will be loaded and the maps that are in the sesion are loaded and send back to the Frontend
   * req: contains the sessionID and the name of the user
   * res: used to send back the maps
   */
  app.post("/joinSession", async (req, res) => {
    try {
      //console.log(req.body);
      var searchedSession = await sessionModel.find({
        sessionID: req.body.sessionID,
      });
      //console.log(searchedSession[0].maps[0]);
      var maps = [];
      for (var i = 0; i < searchedSession[0].maps.length; i++) {
        var map = await MapModel.findById(searchedSession[0].maps[i]);
        //console.log(map);
        maps.push(map.name);
        //console.log(map.name);
      }
      //add user to the list of participants
      var user = req.body.name;
      var participants = searchedSession[0].participants;
      participants.push(user);
      let check = await sessionModel.findOneAndUpdate(
        { sessionID: req.body.sessionID },
        { participants: participants }
      );
      res.send({ message: "You joined Session XY", data: maps });
    } catch (err) {
      console.log(err);
      res.send({ error: err });
    }
  });
  /**
   * Route that is used to vote for a map. Search the required session, check if user already voted. If not then increase the vote for the voted map
   * req: contains sessionID, the name of the user and the map that has been voted
   * res: is used to send back a message if u have already voted and therefor are not allowed or that u just voted for a map
   */
  app.post("/vote", async (req, res) => {
    try {
      var sessionID = req.body.sessionID;
      var votedFor = req.body.voted;
      var user = req.body.name;

      var session = await sessionModel.find({ sessionID: sessionID });
      //check if user already voted
      if (session[0].whoVoted.includes(req.body.name)) {
        res.send({ message: "You already voted", voted: true });
      } else {
        var mapIDsInSession = session[0].maps;
        //search for voted Map and increased the counter for votes
        for (var j = 0; j < mapIDsInSession.length; j++) {
          var map = await MapModel.findById(mapIDsInSession[j]);
          if (map.name === votedFor) {
            var newvotes = map.votes + 1;
            await MapModel.findByIdAndUpdate(mapIDsInSession[j], {
              votes: newvotes,
            });
            //add user to the list of whoVoted
            var participants = session[0].whoVoted;
            participants.push(user);
            //console.log(participants);
            await sessionModel.findOneAndUpdate(
              { sessionID: sessionID },
              { whoVoted: participants }
            );
            res.send({
              message: `You just voted for ${map.name}`,
              voted: true,
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
      res.send({ error: err });
    }
  });
  /**
   * Route used to get the maps and corresponding votes of a session.
   * req: contains the sessionID
   * res: is used to send back a list of maps and their votes
   */
  app.post("/getVotesFromSession", async (req, res) => {
    try {
      var sessionID = req.body.sessionID;
      var session = await sessionModel.find({ sessionID: sessionID });
      if (session.length === 0) {
        res.send({ message: "Session doesnt exist" });
        return;
      }
      var mapIds = session[0].maps;
      var maps = [];
      //console.log(mapIds);
      for (var k = 0; k < mapIds.length; k++) {
        //console.log(mapIds[k]);
        var map = await MapModel.findById(mapIds[k]);
        maps.push(map);
      }
      //console.log(maps);
      res.send({
        maps: maps,
        participants: session[0].participants,
        whoVoted: session[0].whoVoted,
        sessionOwner: session[0].sessionOwner,
      });
    } catch (err) {
      console.log(err);
      res.send({ error: err });
    }
  });
  /**
   * Route to create a Session by generating a random 4 digit number, saving the maps that are send from the frontend and then saving the session with the corresponding maps
   * req: contains a list of the maps
   * res: is used to send back the sessionID for the frontend
   */
  app.post("/createSession", async (req, res) => {
    try {
      var maps = req.body.maps;
      var sessionID = Math.floor(1000 + Math.random() * 9000);
      //console.log(maps);
      //console.log(sessionID);
      var mapObjIDs = [];
      for (var i = 0; i < maps.length; i++) {
        var map = new MapModel({ name: maps[i], votes: 0 });
        //console.log(map);
        mapObjIDs.push(map._id);
        await map.save();
      }
      var newSession = new sessionModel({
        sessionID: sessionID,
        maps: mapObjIDs,
        whoVotes: [],
        participants: [],
        sessionOwner: req.body.name,
      });
      await newSession.save();
    } catch (err) {
      console.log(err);
      res.send({ error: err });
    }
    res.send({ sessionID: sessionID });
  });

  app.listen(port, () => [
    console.log(`Example app listening on port ${port}`),
  ]);
});
