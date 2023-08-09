require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require(`express-session`);
const app = express();
const {SERVER_PORT} = process.env;
const { seed } = require('./seed.js');
const { getAuth, endSession, createUser, loginUser, getUsers, getPlayers, getTeams, getPositions, getQBStats, getRBStats, getWRStats, getTEStats, getKickerStats,addQB, addRB, addWR, addTE, addK } = require(`./controller.js`)

app.use(session({
    name: `ML Session`,
    secret: "shhh",
    saveUninitialized: false,
    cookie: {httpOnly: false, maxAge: 1000 * 60 * 30},
    resave: false
}));
app.use(express.json());
app.use(cors());
app.use(express.static(`${__dirname}/../public`));

app.post(`/seed`, seed);
app.get(`/auth`, getAuth);
app.get(`/logout`, endSession);
app.post(`/register`, createUser);
app.post(`/login`, loginUser);
app.get(`/users`, getUsers);
app.get(`/players`, getPlayers);
app.get(`/teams`, getTeams);
app.get(`/positions`, getPositions);
app.get(`/quarterbacks`, getQBStats);
app.put(`/quarterbacks`, addQB);
app.get(`/runningbacks`, getRBStats);
app.put(`/runningbacks`, addRB);
app.get(`/widereceivers`, getWRStats);
app.put(`/widereceivers`, addWR);
app.get(`/tightends`, getTEStats);
app.put(`/tightends`, addTE);
app.get(`/kickers`, getKickerStats);
app.put(`/kickers`, addK);

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`));