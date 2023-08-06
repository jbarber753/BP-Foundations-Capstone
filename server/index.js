require('dotenv').config();
const express = require('express');
const app = express();
const {SERVER_PORT} = process.env;
const { seed } = require('./seed.js');
const { getPlayers, getTeams, getPositions, getQBStats, getRBStats, getWRStats, getTEStats, getKickerStats } = require(`./controller.js`)

app.use(express.json());

app.post(`/seed`, seed);
app.get(`/players`, getPlayers);
app.get(`/teams`, getTeams);
app.get(`/positions`, getPositions);
app.get(`/quarterbacks`, getQBStats);
app.get(`/runningbacks`, getRBStats);
app.get(`/widereceivers`, getWRStats);
app.get(`/tightends`, getTEStats);
app.get(`/kickers`, getKickerStats);

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`));