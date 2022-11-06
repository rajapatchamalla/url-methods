const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDataAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDataAndServer();
module.exports = app;

app.get("/players/", async (request, response) => {
  const getPlayerQuery = `
    SELECT
    *
    FROM
    cricket_team
    ORDER BY
    player_id;`;
  const playersArray = await db.all(getPlayerQuery);
  response.send(playersArray);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;
  const addPlayerQuery = `
    INSERT INTO
    cricket_team (player_id,player_name,jersey_number,role)
    VALUES
    (
        ${playerId},
        ${playerName},
        ${jerseyNumber},
        ${role},
    );`;

  const dbResponse = await db.run(addPlayerQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT
    *
    FROM
    cricket_team
    WHERE
    player_id = ${playerId};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;
  const updatePlayerQuery = `
    UPDATE
    cricket_team
    SET
        player_id = ${playerId},
        player_name = ${playerName},
        jersey_number = ${jerseyNumber},
        role = ${role}
    WHERE
    player_id = ${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
    cricket_team
    WHERE
    player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
